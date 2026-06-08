"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { OnboardingChecklist } from "../components/onboarding-checklist";
import { CLUB_OWNER_HUB } from "@/lib/club-owner-hub";
import { getHostClubId, getHostOwnerName, listApplications } from "@/lib/club-host-store";
import { getClubAnalytics } from "@/lib/club-owner-data";
import { listGatherings, listNotifications } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerDashboardPage() {
  const [clubId, setClubId] = useState("morning-run-club");
  const [pending, setPending] = useState(0);
  const [zonesPending, setZonesPending] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [ownerName, setOwnerName] = useState("Maya");

  useEffect(() => {
    const id = getHostClubId();
    setClubId(id);
    setPending(listApplications(id, "pending").length);
    const analytics = getClubAnalytics(id, listApplications(id, "pending").length);
    setZonesPending(analytics.zonesPending);
    setUnreadNotifs(listNotifications(id).filter((n) => !n.read).length);
    setOwnerName(getHostOwnerName());
  }, []);

  const club = getClubProfile(clubId);
  const analytics = getClubAnalytics(clubId, pending);
  const gatherings = listGatherings(clubId);

  return (
    <ClubOwnerShell>
      <div className="co-dash-hero">
        <p className="co-welcome-line">
          Welcome, <span className="co-welcome-line__name">{ownerName}</span>
        </p>
        <h1 className="co-page-head__title co-dash-club-name">{club?.name ?? "Your club"}</h1>
        <p className="co-page-head__sub">
          Clubhouse portal — your club, not a venue partner. Health {analytics.healthScore}% ·{" "}
          {analytics.activeDaily} active today · ${analytics.revenue.totalMtd.toLocaleString()} MTD
        </p>
        {(pending > 0 || zonesPending > 0) && (
          <div className="co-attention-strip">
            {pending > 0 ? (
              <Link href="/club-owner/applications" className="co-attention-pill">
                {pending} application{pending === 1 ? "" : "s"} to review
              </Link>
            ) : null}
            {zonesPending > 0 ? (
              <Link href="/club-owner/zones" className="co-attention-pill">
                {zonesPending} zone request{zonesPending === 1 ? "" : "s"} waiting
              </Link>
            ) : null}
          </div>
        )}
      </div>

      <OnboardingChecklist clubId={clubId} />

      <div className="co-hub-grid">
        {CLUB_OWNER_HUB.map((card) => {
          const href = card.external ? card.href.replace("morning-run-club", clubId) : card.href;
          const badge =
            card.badgeKey === "apps"
              ? pending
              : card.badgeKey === "zones"
                ? zonesPending
                : card.badgeKey === "notifs"
                  ? unreadNotifs
                  : 0;
          return (
            <Link
              key={card.title}
              href={href}
              className={`co-hub-card co-hub-card--${card.accent}`}
              {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <strong>{card.title}</strong>
              <p>{card.desc}</p>
              {badge > 0 ? <span className="co-hub-card__badge">{badge}</span> : null}
            </Link>
          );
        })}
      </div>

      <section className="co-section co-section--full">
        <div className="co-section__head">
          <h2 className="co-section__title">Upcoming gatherings</h2>
          <Link href="/club-owner/gatherings" className="co-link">
            Plan →
          </Link>
        </div>
        {gatherings.slice(0, 4).map((ev) => (
          <Link key={ev.id} href={`/club-owner/events/${ev.id}`} className="co-row-card">
            <strong>{ev.title}</strong>
            <span>
              {ev.date}
              {ev.paid ? ` · $${ev.price ?? 25}` : ""}
            </span>
          </Link>
        ))}
      </section>
    </ClubOwnerShell>
  );
}
