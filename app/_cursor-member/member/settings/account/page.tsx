"use client";

import { useState } from "react";
import { MemberShell } from "../../components/member-shell";
import { SettingsProfile } from "../../components/settings-profile";

export default function AccountPage() {
  const [confirm, setConfirm] = useState(false);

  return (
    <MemberShell backHref="/member/settings" backLabel="Settings" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Account</h1>
        <p className="mp-hero__sub">Update your name and location, or delete your account.</p>
      </div>

      <div className="mp-settings-group" style={{ marginTop: "1rem" }}>
        <SettingsProfile />
      </div>

      <div className="mp-hero" style={{ marginTop: "2rem" }}>
        <h2 className="mp-hero__title" style={{ fontSize: "1.1rem" }}>
          Delete account
        </h2>
        <p className="mp-hero__sub">
          This removes your profile, RSVPs, and club memberships. This cannot be undone.
        </p>
      </div>

      <section className="mp-section" style={{ paddingBottom: "2rem" }}>
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.88rem" }}>
          <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
          I understand my data will be permanently deleted.
        </label>
        <button
          type="button"
          className="mp-btn mp-btn--block"
          disabled={!confirm}
          style={{
            marginTop: "1.25rem",
            background: confirm ? "#b00020" : "#ccc",
            color: "#fff",
          }}
        >
          Delete my account
        </button>
        <p style={{ margin: "1rem 0 0", fontSize: "0.78rem", color: "var(--mp-muted)" }}>
          Prefer a pause? Contact us instead — we&apos;ll help.
        </p>
      </section>
    </MemberShell>
  );
}
