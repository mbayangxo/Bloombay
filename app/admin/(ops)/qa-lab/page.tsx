import { AdminShell } from "@/app/components/admin/admin-shell";
import { BloomBayQaLab } from "@/app/components/bloombay-qa-lab";
import "@/app/styles/founder-qa-lab.css";

export default function AdminQaLabPage() {
  return (
    <AdminShell
      title="Live preview & QA"
      subtitle="Preview every portal — member, operations, clubhouse, partner, and curator."
      compactHeader
    >
      <BloomBayQaLab staffLabel="Operations" />
    </AdminShell>
  );
}
