"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { logAudit } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";
import { clearRulesAcceptance, getClubRules, saveClubRules } from "@/lib/club-mama-kit";

export default function ClubOwnerRulesPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const initial = getClubRules(clubId);
  const [rules, setRules] = useState(initial.text);
  const [requireAccept, setRequireAccept] = useState(initial.requireAccept);
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const prev = getClubRules(clubId);
    saveClubRules(clubId, { text: rules, requireAccept });
    if (rules.trim() !== prev.text.trim()) {
      clearRulesAcceptance(clubId);
    }
    logAudit(clubId, "Updated club rules");
    setSaved(true);
  }

  const doc = getClubRules(clubId);

  return (
    <ClubOwnerShell title="Club rules" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="House rules"
        sub="Everyone must read and accept before they join. Saving changes bumps the version — members re-accept."
      />
      <p className="co-hint" style={{ marginBottom: "1rem" }}>
        <a href="/club-owner/customize" style={{ color: "var(--bb-hot)", fontWeight: 600 }}>
          Templates & BloomBay objects →
        </a>
      </p>
      <form onSubmit={save} className="co-form">
        <textarea
          className="co-input co-input--area"
          rows={10}
          value={rules}
          onChange={(e) => {
            setRules(e.target.value);
            setSaved(false);
          }}
        />
        <label className="co-check-row">
          <input
            type="checkbox"
            checked={requireAccept}
            onChange={(e) => {
              setRequireAccept(e.target.checked);
              setSaved(false);
            }}
          />
          Require acceptance before join (recommended)
        </label>
        <p className="co-hint">Current version v{doc.version} · members accept v{doc.version} on join.</p>
        <button type="submit" className="co-btn co-btn--primary">
          Save rules
        </button>
        {saved ? <p className="co-success">Saved. New joins must accept the latest rules.</p> : null}
      </form>
    </ClubOwnerShell>
  );
}
