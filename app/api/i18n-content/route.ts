import { NextResponse } from "next/server";
import { readContent } from "@/lib/store";

/** Public: per-language overrides for admin-editable content (hero, testimonials…). */
export async function GET() {
  return NextResponse.json((await readContent()).i18n, {
    headers: { "Cache-Control": "no-store" },
  });
}
