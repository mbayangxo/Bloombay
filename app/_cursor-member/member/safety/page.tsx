"use client";

import { useState } from "react";
import Link from "next/link";
import { MemberShell } from "../components/member-shell";

const BLOCKED = [{ name: "Alex R.", reason: "Harassment report" }];

export default function SafetyPage() {
  const [query, setQuery] = useState("");
  const [report, setReport] = useState("");

  return (
    <MemberShell backHref="/member/settings" backLabel="Settings" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Safety</h1>
        <p className="mp-hero__sub">Report, block, and verify — BloomBay is for real women only.</p>
      </div>

      <section className="mp-section">
        <p className="mp-section__title">Verify identity</p>
        <p style={{ fontSize: "0.85rem", color: "var(--mp-muted)", marginBottom: "0.65rem" }}>
          Verified women unlock clubs, seats, and Happenings.
        </p>
        <Link href="/member/onboarding" className="mp-btn mp-btn--hot mp-btn--block">
          Complete verification (demo)
        </Link>
        <Link href="/member/settings/safety" className="mp-link" style={{ display: "inline-block", marginTop: "0.5rem" }}>
          Advanced safety settings →
        </Link>
      </section>

      <section className="mp-section">
        <p className="mp-section__title">Report someone</p>
        <textarea
          className="mp-input"
          rows={3}
          placeholder="What happened? Include club or event if relevant."
          value={report}
          onChange={(e) => setReport(e.target.value)}
        />
        <button
          type="button"
          className="mp-btn mp-btn--outline mp-btn--block"
          style={{ marginTop: "0.5rem" }}
          onClick={() => {
            if (report.trim()) alert("Report received (demo). Our team will review.");
            else alert("Add details to your report first.");
          }}
        >
          Submit report (demo)
        </button>
      </section>

      <section className="mp-section">
        <p className="mp-section__title">Block</p>
        <input
          className="mp-input"
          placeholder="Search name to block…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="mp-btn mp-btn--outline mp-btn--block"
          style={{ marginTop: "0.65rem" }}
          onClick={() => {
            if (query.trim()) alert(`Blocked "${query}" (demo).`);
            else alert("Enter a name to block.");
          }}
        >
          Block member
        </button>
        {BLOCKED.map((b) => (
          <div key={b.name} className="mp-list-row" style={{ marginTop: "0.5rem" }}>
            <div>
              <p className="mp-list-row__title">{b.name}</p>
              <p className="mp-list-row__meta">{b.reason}</p>
            </div>
            <button
              type="button"
              className="mp-btn mp-btn--outline"
              style={{ fontSize: "0.7rem", padding: "0.35rem 0.65rem" }}
              onClick={() => alert(`Unblocked ${b.name} (demo).`)}
            >
              Unblock
            </button>
          </div>
        ))}
      </section>
    </MemberShell>
  );
}
