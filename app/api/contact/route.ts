import { NextResponse } from "next/server";

/**
 * Minimal contact endpoint. Validates input and logs the enquiry.
 * TODO: wire to a real transport (Resend, SendGrid, a CRM webhook, etc.).
 */
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

    // Replace this with your delivery integration (Resend / CRM / webhook).
    console.log("[U Thant enquiry]", { name, email, phone, date, interest, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request." },
      { status: 400 }
    );
  }
}
