"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import {
  getNotificationPrefs,
  listNotifications,
  markNotificationRead,
  saveNotificationPrefs,
} from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerNotificationsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [notifs, setNotifs] = useState(() => listNotifications(clubId));
  const [prefs, setPrefs] = useState(() => getNotificationPrefs(clubId));

  return (
    <ClubOwnerShell title="Notifications" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Notifications"
        sub="In-app alerts and email preferences for applications, zones, and gatherings."
      />
      <ul className="co-app-list">
        {notifs.map((n) => (
          <li key={n.id} className={`co-app-card${n.read ? "" : " co-app-card--unread"}`}>
            <div className="co-app-card__head">
              <strong>{n.title}</strong>
              {!n.read ? (
                <button type="button" className="co-btn co-btn--ghost" style={{ padding: "0.3rem 0.5rem", fontSize: "0.62rem" }} onClick={() => { markNotificationRead(n.id); setNotifs(listNotifications(clubId)); }}>
                  Mark read
                </button>
              ) : null}
            </div>
            <p className="co-app-card__meta">{n.body}</p>
            <p className="co-hint">{new Date(n.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <form
        className="co-form"
        style={{ marginTop: "1.5rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          saveNotificationPrefs(clubId, prefs);
        }}
      >
        <p className="co-form__club">Email preferences</p>
        {(["emailApplications", "emailZones", "emailGatherings", "pushApplications"] as const).map((key) => (
          <label key={key} className="co-toggle">
            <input
              type="checkbox"
              checked={prefs[key]}
              onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
            />
            <span>{key.replace(/([A-Z])/g, " $1")}</span>
          </label>
        ))}
        <button type="submit" className="co-btn co-btn--primary">
          Save preferences
        </button>
      </form>
    </ClubOwnerShell>
  );
}
