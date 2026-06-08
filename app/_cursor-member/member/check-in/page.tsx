"use client";

import { useState } from "react";
import Link from "next/link";
import { MemberShell } from "../components/member-shell";
import { CHECKIN_SPOTS } from "@/lib/member-portal-data";

export default function CheckInPage() {
  const [custom, setCustom] = useState("");
  const [here, setHere] = useState(false);

  return (
    <MemberShell backHref="/member/home" backLabel="Home" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">I&apos;m here</h1>
        <p className="mp-hero__sub">Let nearby Bloomies know you&apos;re out.</p>
      </div>

      <section className="mp-section">
        <p className="mp-section__title">Share your moment</p>
        <div className="mp-checkin-locs">
          {CHECKIN_SPOTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="mp-checkin-loc"
              onClick={() => {
                setCustom(`At ${s.name} · ${s.hood}`);
                setHere(true);
              }}
            >
              <div className="mp-checkin-loc__circle" />
              <span className="mp-checkin-loc__name">{s.name}</span>
              <span style={{ fontSize: "0.62rem", color: "var(--mp-muted)" }}>{s.hood}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mp-section">
        <div className="mp-card mp-card--soft" style={{ padding: "1rem" }}>
          <p className="mp-section__title">Custom check-in</p>
          <input
            className="mp-input"
            style={{ marginTop: "0.5rem" }}
            placeholder="At the pop-up market ✨"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
          <button
            type="button"
            className="mp-btn mp-btn--hot mp-btn--block"
            style={{ marginTop: "0.75rem" }}
            onClick={() => setHere(true)}
          >
            {here ? "You're checked in ✓" : "I'm here"}
          </button>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.72rem", color: "var(--mp-muted)", textAlign: "center" }}>
            Only Bloomies can see this
          </p>
        </div>
      </section>

      <section className="mp-section">
        <div className="mp-section__head">
          <h2 className="mp-section__title">Nearby Bloomies</h2>
          <span className="mp-spots">3 here</span>
        </div>
        <div className="mp-avatars">
          {["M", "K", "S"].map((l, i) => (
            <span key={l} className="mp-avatars__img" style={{ zIndex: 3 - i }}>
              {l}
            </span>
          ))}
        </div>
        <Link href="/member/profile/qr" className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "1rem" }}>
          Show my event QR
        </Link>
      </section>
    </MemberShell>
  );
}
