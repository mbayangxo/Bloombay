"use client";

import { useState } from "react";
import { MemberShell } from "../../components/member-shell";

const BLOCKED = [
  { name: "Alex R.", reason: "Harassment report" },
];

export default function SafetySettingsPage() {
  const [query, setQuery] = useState("");

  return (
    <MemberShell backHref="/member/settings" backLabel="Settings" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Safety</h1>
        <p className="mp-hero__sub">Block someone — they won&apos;t see you in clubs or gatherings.</p>
      </div>

      <section className="mp-section">
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
      </section>

      <section className="mp-section">
        <p className="mp-section__title">Blocked</p>
        {BLOCKED.length === 0 ? (
          <p style={{ color: "var(--mp-muted)", fontSize: "0.88rem" }}>No one blocked.</p>
        ) : (
          BLOCKED.map((b) => (
            <div key={b.name} className="mp-list-row">
              <div>
                <p className="mp-list-row__title">{b.name}</p>
                <p className="mp-list-row__meta">{b.reason}</p>
              </div>
              <button
                type="button"
                className="mp-btn mp-btn--outline"
                style={{ padding: "0.4rem 0.75rem", fontSize: "0.7rem" }}
                onClick={() => alert(`Unblocked ${b.name} (demo).`)}
              >
                Unblock
              </button>
            </div>
          ))
        )}
      </section>
    </MemberShell>
  );
}
