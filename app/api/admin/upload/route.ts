import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/store";

const OK_IMAGE = /^image\/(jpeg|png|webp|avif|gif)$/;
const OK_PDF = /^application\/pdf$/;

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file." }, { status: 400 });
  }
  const isPdf = OK_PDF.test(file.type);
  if (!OK_IMAGE.test(file.type) && !isPdf) {
    return NextResponse.json({ ok: false, error: "Unsupported file type." }, { status: 415 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "File too large (max 12MB)." }, { status: 413 });
  }

  const ext = isPdf ? ".pdf" : "." + (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const safe = (file.name || "file")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const name = `${Date.now()}-${safe || "asset"}${ext}`;

  await saveUpload(name, file.type, Buffer.from(await file.arrayBuffer()));

  // served by the /api/uploads/[file] route (from Neon or the data dir)
  return NextResponse.json({ ok: true, url: `/api/uploads/${name}` });
}
