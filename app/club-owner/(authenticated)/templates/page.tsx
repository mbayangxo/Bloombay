"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { duplicateTemplate, listEventTemplates } from "@/lib/club-operations-store";

export default function ClubOwnerTemplatesPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [templates, setTemplates] = useState(() => listEventTemplates(clubId));

  return (
    <ClubOwnerShell title="Templates" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Event templates"
        sub="Duplicate successful events — timeline, budget, checklist, cover, tax and volunteer requirements."
      />
      {templates.map((t) => (
        <article key={t.id} className="co-app-card" style={{ marginBottom: "0.75rem" }}>
          <strong>{t.name}</strong>
          <p className="co-hint">Budget ~${t.budgetEstimate.toLocaleString()}</p>
          <ul className="co-hint">
            {t.checklist.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="co-hint">Timeline: {t.timelineDays.map((d) => `${d.daysBefore}d — ${d.label}`).join(" · ")}</p>
          {t.volunteerNotes ? <p className="co-hint">Volunteers: {t.volunteerNotes}</p> : null}
          <button
            type="button"
            className="co-btn co-btn--primary"
            style={{ marginTop: "0.5rem" }}
            onClick={() => {
              duplicateTemplate(t.id, String(new Date().getFullYear() + 1));
              setTemplates(listEventTemplates(clubId));
            }}
          >
            Duplicate for next year
          </button>
        </article>
      ))}
    </ClubOwnerShell>
  );
}
