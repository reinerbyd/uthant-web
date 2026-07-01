import path from "node:path";
import { readUpload } from "@/lib/store";

/** Streams an admin-uploaded asset (from Neon or the data dir). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const name = path.basename(file); // prevent path traversal
  const asset = await readUpload(name);
  if (!asset) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(asset.bytes), {
    headers: {
      "Content-Type": asset.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
