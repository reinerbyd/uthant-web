import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth";

export async function POST() {
  const c = await cookies();
  c.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
