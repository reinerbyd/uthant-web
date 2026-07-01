import { getBrochureUrl } from "@/lib/cms";

/**
 * Serves the admin-uploaded brochure when one exists; otherwise generates a
 * minimal valid placeholder PDF on the fly.
 */
export async function GET(req: Request) {
  const uploaded = await getBrochureUrl();
  if (uploaded) {
    return Response.redirect(new URL(uploaded, req.url), 307);
  }

  const content = [
    "BT /F2 30 Tf 64 760 Td (U Thant) Tj ET",
    "BT /F1 13 Tf 64 730 Td (Kuala Lumpur's most considered address) Tj ET",
    "BT /F1 11 Tf 64 698 Td (The Embassy Quarter - Collection Brochure) Tj ET",
    "BT /F1 11 Tf 64 668 Td (Freehold residences from RM 3.5M to RM 85M) Tj ET",
    "BT /F1 10 Tf 64 628 Td (hello@uthant.com.my    +60 13 339 1393) Tj ET",
    "BT /F1 10 Tf 64 606 Td (Jalan Langgak Tunku, Taman Tunku, 50480 Kuala Lumpur) Tj ET",
  ].join("\n");

  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
  objects[3] =
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>";
  objects[4] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[6] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefPos = pdf.length;
  const count = objects.length; // index 0 reserved
  pdf += `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i < count; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="U-Thant-Brochure.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
