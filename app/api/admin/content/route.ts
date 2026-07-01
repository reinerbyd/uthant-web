import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readContent, writeContent, type ContentDoc } from "@/lib/store";

export async function GET() {
  return NextResponse.json(readContent());
}

export async function PUT(req: Request) {
  try {
    const incoming = (await req.json()) as Partial<ContentDoc>;
    const merged = { ...readContent(), ...incoming };
    writeContent(merged);

    // push changes live across the public site
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, content: merged });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid content." }, { status: 400 });
  }
}
