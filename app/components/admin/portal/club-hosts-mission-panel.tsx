"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HOST_LEADERBOARD } from "@/lib/founder-insights";
import { PORTAL_QUEUE_FALLBACK } from "@/lib/founder-dashboard-metrics";

type ClubMamaApp = {
  id: string;
  club_name: string;
  club_emoji?: string | null;
  category: string | null;
  neighborhood: string | null;
  submitted_at: string;
  profiles?: { full_name?: string | null; email?: string | null } | null;
};

export function ClubHostsMissionPanel({ basePath }: { basePath: "/founder" | "/admin" }) {
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [liveGatherings, setLiveGatherings] = useState<number | null>(null);
  const [applications, setApplications] = useState<ClubMamaApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, appsRes] = await Promise.all([
        fetch("/api/admin/quick-stats"),
        fetch("/api/admin/club-mama-applications?status=pending"),
      ]);
      if (statsRes.ok) {
        const stats = (await statsRes.json()) as {
          pendingClubMama?: number;
          upcomingEvents?: number;
        };
        setPendingCount(stats.pendingClubMama ?? 0);
        setLiveGatherings(stats.upcomingEvents ?? 0);
      }
      if (appsRes.ok) {
        setApplications((await appsRes.json()) as ClubMamaApp[]);
      } else if (appsRes.status === 401 || appsRes.status === 403) {
        setError("Sign in as founder/admin to review applications.");
      }
    } catch {
      setError("Could not load Club Mama queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function review(id: string, action: "approve" | "decline") {
    setActing(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/club-mama-applications/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Update failed");
      setApplications((prev) => prev.filter((a) => a.id !== id));
      setPendingCount((c) => (c != null ? Math.max(0, c - 1) : c));
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setActing(null);
    }
  }

  const pendingDisplay = pendingCount ?? PORTAL_QUEUE_FALLBACK.clubHostsPending;

  return (
    <div className="fp-page">
      <header className="fp-page__head">
        <p className="fp-kicker">Hosts</p>
        <h2 className="fp-headline">Club hosts & clubhouse leads</h2>
        <p className="fp-sub">
          Women running clubs — attendance, trust, and applications waiting for your yes.
        </p>
      </header>

      <div className="fp-inbox-pink-cards">
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{pendingDisplay}</span>
          <span className="fp-inbox-pink-card__label">Pending approval</span>
        </article>
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{liveGatherings ?? "—"}</span>
          <span className="fp-inbox-pink-card__label">Live gatherings</span>
        </article>
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{HOST_LEADERBOARD.length}</span>
          <span className="fp-inbox-pink-card__label">Active hosts (top)</span>
        </article>
      </div>

      <section className="fp-card">
        <h3 className="fp-card__title">Club Mama applications</h3>
        {loading ? (
          <p className="fp-sub">Loading queue…</p>
        ) : applications.length === 0 ? (
          <p className="fp-sub">No pending Club Mama applications.</p>
        ) : (
          <ul className="fp-app-queue__list">
            {applications.map((app) => {
              const name =
                app.profiles?.full_name?.split(" ")[0] ??
                app.profiles?.email ??
                "Applicant";
              return (
                <li key={app.id} className="fp-app-person">
                  <div>
                    <strong>
                      {app.club_emoji ? `${app.club_emoji} ` : ""}
                      {app.club_name}
                    </strong>
                    <p className="fp-portal-muted">
                      {name}
                      {app.neighborhood ? ` · ${app.neighborhood}` : ""}
                      {app.category ? ` · ${app.category}` : ""}
                    </p>
                  </div>
                  <div className="fp-app-person__actions">
                    <button
                      type="button"
                      className="fp-portal-btn fp-portal-btn--pink"
                      disabled={acting === app.id}
                      onClick={() => review(app.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="fp-portal-btn"
                      disabled={acting === app.id}
                      onClick={() => review(app.id, "decline")}
                    >
                      Decline
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {error ? <p className="fp-sub" style={{ color: "#c00" }}>{error}</p> : null}
      </section>

      <section className="fp-card">
        <h3 className="fp-card__title">Host leaderboard</h3>
        <ol className="fp-host-lb">
          {HOST_LEADERBOARD.map((h) => (
            <li key={h.rank} className={`fp-host-lb__row fp-host-lb__row--${h.badge}`}>
              <span className="fp-host-lb__rank">#{h.rank}</span>
              <div>
                <strong>{h.name}</strong>
                <span className="fp-sub">{h.club}</span>
              </div>
              <div className="fp-host-lb__stats">
                <span>{h.attendanceRate}% attend</span>
                <span>{h.eventsHosted} events</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="fp-sub">
        <Link href={`${basePath}/applications?type=club_host`} className="fp-link-pill">
          Review waitlist host signups →
        </Link>
        {" · "}
        <Link href="/club-owner/dashboard" className="fp-link-pill">
          Clubhouse portal →
        </Link>
      </p>
    </div>
  );
}
