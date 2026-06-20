import { FounderShell } from "@/app/components/admin/founder-shell";
import { FounderQaLab } from "@/app/components/founder/qa-lab";
import "@/app/styles/founder-qa-lab.css";

export default function FounderQaLabPage() {
  return (
    <FounderShell
      title="Live preview & QA"
      subtitle="Desktop, tablet, and mobile — smoke checks and Cursor Agent briefs."
      compactHeader
    >
      <FounderQaLab />
    </FounderShell>
  );
}
