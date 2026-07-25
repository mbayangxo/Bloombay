"use client";

import Link from "next/link";
import { ProfileGemsPanel } from "@/app/components/portal/profile-gems-panel";

const CREAM = "#FDFAF5";
const PINK = "#FF1F7D";

export default function MyGemsPage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: CREAM }}>
      <div className="px-5 pt-16 pb-4 max-w-md mx-auto">
        <Link
          href="/member/you"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: PINK,
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 14,
            fontFamily: "var(--font-jost)",
          }}
        >
          ← Profile
        </Link>
        <ProfileGemsPanel compact={false} showHeader />
      </div>
    </div>
  );
}
