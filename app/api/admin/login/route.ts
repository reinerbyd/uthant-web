import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_PASSWORD, COOKIE, makeToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }
  const c = await cookies();
  c.set(COOKIE, await makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return NextResponse.json({ ok: true });
}
