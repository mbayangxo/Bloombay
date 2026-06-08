"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { listModeration, resolveModeration } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerModerationPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [items, setItems] = useState(() => listModeration(clubId));

  return (
    <ClubOwnerShell title="Moderation" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Moderation"
        sub="Review flagged lounge and club posts."
      />
      <ul className="co-app-list">
        {items.map((item) => (
          <li key={item.id} className="co-app-card">
            <p className="co-app-card__meta">{item.author}</p>
            <p>{item.excerpt}</p>
            {item.status === "open" ? (
              <div className="co-app-card__actions">
                <button type="button" className="co-btn co-btn--ghost" onClick={() => { resolveModeration(item.id, "dismissed"); setItems(listModeration(clubId)); }}>
                  Dismiss
                </button>
                <button type="button" className="co-btn co-btn--primary" onClick={() => { resolveModeration(item.id, "removed"); setItems(listModeration(clubId)); }}>
                  Remove post
                </button>
              </div>
            ) : (
              <span className={`co-badge co-badge--${item.status === "removed" ? "denied" : "approved"}`}>{item.status}</span>
            )}
          </li>
        ))}
      </ul>
    </ClubOwnerShell>
  );
}
