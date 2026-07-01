import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/content";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Sends the enquiry via Resend when configured; always logs as a fallback. */
async function deliver(fields: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[U Thant enquiry]", fields); // no email transport configured
    return;
  }
  const to = process.env.CONTACT_TO || CONTACT.email;
  const from = process.env.CONTACT_FROM || "U Thant <onboarding@resend.dev>";
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#8a8273;text-transform:capitalize">${esc(
          k
        )}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`
    )
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: fields.email || undefined,
      subject: `New viewing request — ${fields.name || "enquiry"}`,
      html: `<h2 style="font-family:Georgia,serif;font-weight:400">New U Thant enquiry</h2><table style="font-family:system-ui,sans-serif;font-size:14px">${rows}</table>`,
    }),
  });
  if (!res.ok) {
    console.error("[U Thant enquiry] Resend failed:", res.status, await res.text());
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, date, interest, message } = body ?? {};

    if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
      return NextResponse.json(
        { ok: false, error: "Invalid name or email." },
        { status: 400 }
      );
    }

    // never fail the visitor's submission on a delivery hiccup — log + report ok
    await deliver({ name, email, phone, date, interest, message }).catch((e) =>
      console.error("[U Thant enquiry] deliver error:", e)
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
}
