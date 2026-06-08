"use client";

import { useState } from "react";
import Link from "next/link";
import { MemberShell } from "../components/member-shell";
import { BLOOMIES, type Bloomie } from "@/lib/member-social-data";
export default function BloomiesPage() {
  const [list] = useState(BLOOMIES);

  return (
    <MemberShell backHref="/member/lounge" backLabel="Apartment">
      <div className="mp-hero">
        <h1 className="mp-hero__title">Bloomies</h1>
        <p className="mp-hero__sub">Friends you&apos;ve met — usually from scanning QR in person.</p>
      </div>

      <section className="mp-section">
        <Link href="/member/scan" className="mp-btn mp-btn--hot mp-btn--block">
          Scan Bloomie QR
        </Link>
        <Link href="/member/profile/qr" className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "0.5rem" }}>
          Show my QR
        </Link>
      </section>

      <section className="mp-section">
        <div className="mp-section__head">
          <h2 className="mp-section__title">{list.length} Bloomies</h2>
          <Link href="/member/bouquet" className="mp-link">
            Bouquet →
          </Link>
        </div>
        {list.map((b) => (
          <BloomieRow key={b.id} bloomie={b} />
        ))}
      </section>
    </MemberShell>
  );
}

function BloomieRow({ bloomie }: { bloomie: Bloomie }) {
  return (
    <div className="mp-list-row" style={{ borderBottom: "1px solid var(--mp-line)" }}>
      <div
        className="mp-list-row__thumb"
        style={{
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          color: "var(--mp-hot)",
        }}
      >
        {bloomie.initial}
      </div>
      <div style={{ flex: 1 }}>
        <p className="mp-list-row__title">{bloomie.name}</p>
        <p className="mp-list-row__meta">{bloomie.met ?? "Connected on BloomBay"}</p>
      </div>
      <Link href="/member/bouquet" className="mp-btn mp-btn--outline" style={{ padding: "0.4rem 0.65rem", fontSize: "0.65rem" }}>
        + Bouquet
      </Link>
    </div>
  );
}
