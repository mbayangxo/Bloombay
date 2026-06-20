"use client";

import Link from "next/link";
import { MemberShell } from "../components/member-shell";

export default function GirlCodePage() {
  return (
    <MemberShell backHref="/member/lounge" backLabel="Apartment" compactHeader>
      <div className="mp-page-head">
        <h1 className="mp-page-head__title">Girl code</h1>
        <p className="mp-page-head__sub">How we keep BloomBay safe, warm, and women-only.</p>
      </div>
      <section className="mp-page-body mp-lounge-copy">
        <ul>
          <li>Women only — verified profiles, zero tolerance for harassment.</li>
          <li>What&apos;s shared in a club stays respectful; report anything that doesn&apos;t.</li>
          <li>Bloom requests are opt-in — always accept on your terms.</li>
          <li>Hosts and curators are held to the same standard as members.</li>
        </ul>
        <Link href="/member/safety" className="mp-btn mp-btn--hot mp-btn--block" style={{ marginTop: "1.25rem" }}>
          Safety & blocking →
        </Link>
      </section>
    </MemberShell>
  );
}
