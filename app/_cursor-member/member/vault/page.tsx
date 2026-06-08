"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useArtifactMotion } from "@/lib/use-artifact-motion";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { BLOOM_OBJECTS, HAPPENINGS_OBJECT } from "@/lib/bloom-object-assets";
import { BloomPostcard, BloomTicket } from "@/app/components/bloom-artifacts";
import { splitTitleHighlight } from "@/lib/bloom-artifact-types";
import {
  DEMO_BADGES,
  DEMO_MEMORIES,
  DEMO_STAMPS,
  DEMO_TICKETS,
  MEMBER_PASS,
} from "@/lib/member-vault-data";
import { MemberShell } from "../components/member-shell";

const TABS = ["lounge", "stamps", "tickets", "memories", "pass", "badges"] as const;

function VaultContent() {
  const queryTab = useSearchParams().get("tab");
  const initialTab =
    queryTab && TABS.includes(queryTab as (typeof TABS)[number])
      ? (queryTab as (typeof TABS)[number])
      : "memories";
  const [tab, setTab] = useState<(typeof TABS)[number]>(initialTab);
  const memoryMotion = useArtifactMotion();

  useEffect(() => {
    if (tab === "memories") memoryMotion.trigger("postcard-flip");
  }, [tab]);

  return (
    <MemberShell backHref="/member/lounge" backLabel="Apartment" compactHeader>
      <div className="mp-page-head">
        <h1 className="mp-page-head__title">My library</h1>
        <p className="mp-page-head__sub">Saved tickets, stamps, memories, pass, and badges — everything you kept.</p>
      </div>

      <nav className="mp-vault-tabs" aria-label="Personal space">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`mp-pill${tab === t ? " mp-pill--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <div className="mp-page-body">
        {tab === "lounge" && (
          <div className="mp-tier-card">
            <BloomObjectIcon src={BLOOM_OBJECTS.door} size={48} motion="open" className="mp-hero-object" />
            <p className="mp-list-row__title">My Lounge</p>
            <p className="mp-list-row__meta">Bulletin & city voice — your corner of BloomBay.</p>
            <Link href="/member/lounge" className="mp-btn mp-btn--hot mp-btn--block" style={{ marginTop: "0.75rem" }}>
              Enter Lounge →
            </Link>
          </div>
        )}

        {tab === "stamps" && (
          <ul className="mp-vault-list">
            {DEMO_STAMPS.map((s) => (
              <li key={s.id} className="mp-ed-card">
                <BloomObjectIcon src={HAPPENINGS_OBJECT} size={32} motion="stamp" />
                <div>
                  <strong>{s.label}</strong>
                  <p className="mp-list-row__meta">
                    {s.earnedAt}
                    {s.club ? ` · ${s.club}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tab === "tickets" && (
          <div className="bb-artifact-stack">
            {DEMO_TICKETS.map((t) => {
              const { lead, highlight } = splitTitleHighlight(t.event);
              return (
                <BloomTicket
                  key={t.id}
                  title={lead}
                  titleHighlight={highlight}
                  meta={[
                    { label: "When", value: t.when },
                    { label: "Status", value: t.status },
                    { label: "BloomBay", value: "Vault" },
                  ]}
                  code={`TKT-${t.id.toUpperCase()}`}
                />
              );
            })}
          </div>
        )}

        {tab === "memories" && (
          <div className={`bb-polaroid-strip--vault ${memoryMotion.className}`}>
            {DEMO_MEMORIES.map((m) => (
              <BloomPostcard
                key={m.id}
                caption={m.caption}
                meta={`${m.when}${m.club ? ` · ${m.club}` : ""}`}
              />
            ))}
          </div>
        )}

        {tab === "pass" && (
          <div className="mp-member-pass">
            <p className="mp-member-pass__tier">{MEMBER_PASS.tier}</p>
            <strong className="mp-member-pass__name">{MEMBER_PASS.name}</strong>
            <p className="mp-member-pass__id">{MEMBER_PASS.memberId}</p>
            <p className="mp-list-row__meta">
              {MEMBER_PASS.city} · {MEMBER_PASS.verified ? "Verified ✓" : "Pending verification"}
            </p>
            <Link href="/member/profile/qr" className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "1rem" }}>
              Show QR pass
            </Link>
          </div>
        )}

        {tab === "badges" && (
          <ul className="mp-vault-list">
            {DEMO_BADGES.map((b) => (
              <li key={b.id} className="mp-ed-card">
                <strong>{b.label}</strong>
                <p className="mp-list-row__meta">{b.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MemberShell>
  );
}

export default function VaultPage() {
  return (
    <Suspense fallback={<MemberShell compactHeader><p className="mp-page-body">Loading…</p></MemberShell>}>
      <VaultContent />
    </Suspense>
  );
}
