import { readContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — U Thant", robots: { index: false } };

// TEMPORARY DIAGNOSTIC — isolates whether the /admin 500 is in the data layer
// (readContent) or the dashboard component's SSR. Restored immediately after.
export default function AdminPage() {
  let info = "";
  try {
    const c = readContent();
    info = "readContent OK — residences=" + (c.residences?.length ?? "?") + " testimonials=" + (c.testimonials?.length ?? "?");
  } catch (e) {
    info = "readContent THREW: " + (e instanceof Error ? e.message : String(e));
  }
  return (
    <pre style={{ padding: 24, fontSize: 13, fontFamily: "monospace", color: "#111" }}>
      DIAG OK{"\n"}node={process.version}{"\n"}dataDir={process.env.DATA_DIR || "(unset)"}{"\n"}{info}
    </pre>
  );
}
