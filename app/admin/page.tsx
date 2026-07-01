import { readContent } from "@/lib/store";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — U Thant", robots: { index: false } };

export default function AdminPage() {
  return <AdminDashboard initial={readContent()} />;
}
