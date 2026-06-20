"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MemberShell } from "../../components/member-shell";
import { QrDisplay } from "../../components/qr-display";
import { DEMO_MEMBER_ID } from "@/lib/qr-codes";

type Tab = "bloomie" | "event";

function ProfileQrContent() {
  const queryTab = useSearchParams().get("tab");
  const [tab, setTab] = useState<Tab>(queryTab === "event" ? "event" : "bloomie");

  useEffect(() => {
    if (queryTab === "event" || queryTab === "bloomie") {
      setTab(queryTab);
    }
  }, [queryTab]);

  return (
    <MemberShell backHref="/member/lounge" backLabel="Apartment" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Your QR codes</h1>
        <p className="mp-hero__sub">
          Show your event QR at the door. Scan Bloomie QRs when you meet in person.
        </p>
      </div>

      <div className="mp-qr-tabs">
        {(
          [
            { id: "event" as const, label: "Event check-in" },
            { id: "bloomie" as const, label: "Bloomie QR" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            className={`mp-pill${tab === t.id ? " mp-pill--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mp-qr-page-grid">
        <div className="mp-qr-wrap" style={{ paddingTop: 0 }}>
          {tab === "bloomie" ? (
            <>
              <QrDisplay
                payload={{ kind: "member_bloomie", id: DEMO_MEMBER_ID, label: "Maya" }}
                size={200}
                caption="Scan to add me as a Bloomie"
              />
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--mp-muted)", textAlign: "center", maxWidth: 280 }}>
                When you meet in real life, she scans this — you become Bloomies (friends).
              </p>
            </>
          ) : (
            <>
              <QrDisplay
                payload={{ kind: "member_event", id: DEMO_MEMBER_ID }}
                size={200}
                caption="Show hosts at the door"
              />
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--mp-muted)", textAlign: "center", maxWidth: 280 }}>
                Club owners & BloomBay hosts scan this to check you into a gathering.
              </p>
            </>
          )}
        </div>

        <div className="mp-tier-card">
          <p className="mp-section__title">Quick actions</p>
          <Link href="/member/scan" className="mp-btn mp-btn--hot mp-btn--block" style={{ marginTop: "0.75rem" }}>
            Scan someone&apos;s Bloomie QR
          </Link>
          <Link href="/member/bloomies" className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "0.5rem" }}>
            View my Bloomies
          </Link>
          <Link href="/member/bouquet" className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "0.5rem" }}>
            My bouquet (12)
          </Link>
        </div>
      </div>
    </MemberShell>
  );
}

export default function ProfileQrPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <ProfileQrContent />
    </Suspense>
  );
}
