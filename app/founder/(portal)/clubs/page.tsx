import Link from "next/link";
import { FounderShell } from "@/app/components/admin/founder-shell";
import { ClubsHub } from "@/app/components/admin/clubs-hub";

export default function AdminClubsPage() {
  return (
    <FounderShell
      title="Clubs"
      subtitle="Club creation and growth — hosts, venues, and launch readiness."
    >
      <p style={{ marginBottom: "1rem" }}>
        <Link href="/founder/clubs/portfolio" style={{ color: "var(--bb-hot)", fontWeight: 700 }}>
          Multi-club portfolio →
        </Link>
      </p>
      <ClubsHub staffBase="/founder" />
    </FounderShell>
  );
}
