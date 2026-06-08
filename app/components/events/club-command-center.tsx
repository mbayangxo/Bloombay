"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLUBS } from "@/app/member/clubs/club-data";
import {
  addEventIdea,
  getClubAnalytics,
  getClubBranding,
  listEventIdeas,
  listEventsForClub,
  listMonthlyPlans,
  monthKey,
  removeEventIdea,
  saveClubBranding,
  saveMonthlyPlan,
} from "@/lib/bloombay-events-store";
export type EventsPortalBase = "/founder" | "/admin" | "/club-owner";
import { EventCoverUpload } from "./event-cover-upload";
import { EventsStudio } from "./events-studio";
import { EventsCalendar } from "./events-calendar";
import { ClubPlannerPanel } from "./club-planner-panel";
import { listEventArchive } from "@/lib/club-operations-store";

type Tab = "overview" | "calendar" | "planner" | "events" | "branding" | "monthly" | "ideas" | "archive";

export function ClubCommandCenter({
  clubId,
  staffBase = "/founder",
  defaultTab = "overview",
}: {
  clubId: string;
  staffBase?: EventsPortalBase;
  defaultTab?: Tab;
}) {
  const club = CLUBS.find((c) => c.id === clubId);
  const [tab, setTab] = useState<Tab>(defaultTab);
  const eventsBack =
    staffBase === "/club-owner" ? "/club-owner/events-studio" : `${staffBase}/events`;
  const [analytics, setAnalytics] = useState(() => getClubAnalytics(clubId));
  const [branding, setBranding] = useState(() => getClubBranding(clubId));
  const [month, setMonth] = useState(monthKey());
  const [plan, setPlan] = useState({
    managerName: "",
    overview: "",
    themes: "",
    weeklyRhythm: "",
    goals: "",
  });
  const [ideas, setIdeas] = useState(() => listEventIdeas(clubId));
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaNotes, setIdeaNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = listMonthlyPlans(clubId).find((x) => x.month === month);
    if (p) {
      setPlan({
        managerName: p.managerName,
        overview: p.overview,
        themes: p.themes,
        weeklyRhythm: p.weeklyRhythm,
        goals: p.goals,
      });
    }
  }, [clubId, month]);

  function refresh() {
    setAnalytics(getClubAnalytics(clubId));
    setIdeas(listEventIdeas(clubId));
  }

  useEffect(() => {
    const fn = () => refresh();
    window.addEventListener("bb-events-updated", fn);
    return () => window.removeEventListener("bb-events-updated", fn);
  }, [clubId]);

  if (!club) {
    return <p className="fp-portal-empty">Club not found.</p>;
  }

  const events = listEventsForClub(clubId);
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "planner", label: "Planner room" },
    { id: "events", label: "Events & covers" },
    { id: "branding", label: "Customization" },
    { id: "monthly", label: "Monthly plan" },
    { id: "ideas", label: "Ideas" },
    { id: "archive", label: "History" },
  ];

  return (
    <div className="fp-portal-page bb-club-command">
      <header className="fp-submissions-queue__hero">
        <Link href={eventsBack} className="fp-submissions-queue__back">
          ← {staffBase === "/club-owner" ? "Events studio" : "All events"}
        </Link>
        <p className="fp-portal-hero__kicker">{club.category}</p>
        <h2 className="fp-portal-hero__title">{club.name}</h2>
        <p className="fp-portal-hero__sub">{club.tagline}</p>
      </header>

      <nav className="bb-club-command__tabs" aria-label="Club sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`bb-club-command__tab${tab === t.id ? " bb-club-command__tab--on" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <div className="fp-inbox-pink-cards">
          <article className="fp-inbox-pink-card">
            <span className="fp-inbox-pink-card__num">{analytics.memberCount}</span>
            <span className="fp-inbox-pink-card__label">Members</span>
          </article>
          <article className="fp-inbox-pink-card">
            <span className="fp-inbox-pink-card__num">{analytics.liveEvents}</span>
            <span className="fp-inbox-pink-card__label">Live events</span>
          </article>
          <article className="fp-inbox-pink-card">
            <span className="fp-inbox-pink-card__num">{analytics.totalRsvps}</span>
            <span className="fp-inbox-pink-card__label">RSVPs</span>
          </article>
          <article className="fp-inbox-pink-card">
            <span className="fp-inbox-pink-card__num">★ {analytics.avgRating || "—"}</span>
            <span className="fp-inbox-pink-card__label">
              Avg rating ({analytics.ratingCount})
            </span>
          </article>
        </div>
      ) : null}

      {tab === "overview" ? (
        <section className="fp-card" style={{ marginTop: "1rem" }}>
          <h3 className="fp-card__title">Recent club events</h3>
          <ul className="fp-happenings-list">
            {events.slice(0, 6).map((e) => (
              <li key={e.id} className="fp-happenings-list__row">
                <div>
                  <strong>{e.title}</strong>
                  <p className="fp-sub">
                    {e.status} · ★ {e.ratingAvg} · {e.rsvpCount} RSVPs
                  </p>
                </div>
              </li>
            ))}
            {events.length === 0 ? (
              <li className="fp-portal-empty">No events yet — open Club events tab.</li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {tab === "calendar" ? (
        <div className="bb-events-studio__layout" style={{ marginTop: "1rem" }}>
          <EventsCalendar events={events} selectedId={null} onSelect={() => {}} />
          <p className="fp-portal-muted" style={{ marginTop: "0.75rem" }}>
            Plan months and years ahead — October, November, and beyond. Open Events & covers to edit drafts or publish.
          </p>
        </div>
      ) : null}

      {tab === "planner" ? (
        <ClubPlannerPanel clubId={clubId} staffBase={staffBase} />
      ) : null}

      {tab === "events" ? (
        <EventsStudio
          kind="regular"
          staffBase={staffBase}
          clubId={clubId}
          backHref={
            staffBase === "/club-owner"
              ? `/club-owner/events-studio`
              : `${staffBase}/events/clubs/${clubId}/dashboard`
          }
        />
      ) : null}

      {tab === "archive" ? (
        <ul className="fp-happenings-list" style={{ marginTop: "1rem" }}>
          {listEventArchive(clubId).map((a) => (
            <li key={a.id} className="fp-happenings-list__row">
              <div>
                <strong>{a.title}</strong>
                <p className="fp-sub">
                  {a.attendance} attended · {a.rating ? `${a.rating}★` : ""}
                </p>
                {a.lessonsLearned ? <p className="fp-portal-muted">{a.lessonsLearned}</p> : null}
              </div>
            </li>
          ))}
          {events
            .filter((e) => e.status === "cancelled" || e.status === "live")
            .slice(0, 4)
            .map((e) => (
              <li key={e.id} className="fp-portal-muted">
                Scheduled: {e.title} ({e.status})
              </li>
            ))}
        </ul>
      ) : null}

      {tab === "branding" ? (
        <form
          className="bb-events-form fp-surface-white"
          onSubmit={(e) => {
            e.preventDefault();
            saveClubBranding(clubId, branding);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          <h3>Limited club page edits</h3>
          <p className="fp-portal-muted">
            Banner, logo, and landing copy — members see this on the club world page.
          </p>
          <EventCoverUpload
            label="Club banner"
            coverUrl={branding.bannerUrl}
            onCoverChange={(bannerUrl) => setBranding((b) => ({ ...b, bannerUrl }))}
          />
          <EventCoverUpload
            label="Club logo"
            coverUrl={branding.logoUrl}
            onCoverChange={(logoUrl) => setBranding((b) => ({ ...b, logoUrl }))}
          />
          <label>
            Tagline
            <input
              value={branding.tagline}
              onChange={(e) => setBranding((b) => ({ ...b, tagline: e.target.value }))}
            />
          </label>
          <label>
            Landing headline
            <input
              value={branding.landingHeadline}
              onChange={(e) => setBranding((b) => ({ ...b, landingHeadline: e.target.value }))}
            />
          </label>
          <label>
            Landing subcopy
            <textarea
              rows={3}
              value={branding.landingSubcopy}
              onChange={(e) => setBranding((b) => ({ ...b, landingSubcopy: e.target.value }))}
            />
          </label>
          <label>
            Welcome message
            <textarea
              rows={4}
              value={branding.welcomeMessage}
              onChange={(e) => setBranding((b) => ({ ...b, welcomeMessage: e.target.value }))}
            />
          </label>
          <button type="submit" className="fp-portal-btn fp-portal-btn--pink">
            {saved ? "Saved ✓" : "Save branding"}
          </button>
        </form>
      ) : null}

      {tab === "monthly" ? (
        <form
          className="bb-events-form fp-surface-white"
          onSubmit={(e) => {
            e.preventDefault();
            saveMonthlyPlan(clubId, month, plan);
            setSaved(true);
          }}
        >
          <h3>Monthly manager plan</h3>
          <p className="fp-portal-muted">
            Designated space for the club manager to plan the month ahead.
          </p>
          <label>
            Month
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </label>
          <label>
            Manager name
            <input
              value={plan.managerName}
              onChange={(e) => setPlan((p) => ({ ...p, managerName: e.target.value }))}
            />
          </label>
          <label>
            Month overview
            <textarea
              rows={4}
              value={plan.overview}
              onChange={(e) => setPlan((p) => ({ ...p, overview: e.target.value }))}
              placeholder="What does this month look and feel like?"
            />
          </label>
          <label>
            Themes & programming
            <textarea
              rows={3}
              value={plan.themes}
              onChange={(e) => setPlan((p) => ({ ...p, themes: e.target.value }))}
            />
          </label>
          <label>
            Weekly rhythm
            <textarea
              rows={3}
              value={plan.weeklyRhythm}
              onChange={(e) => setPlan((p) => ({ ...p, weeklyRhythm: e.target.value }))}
            />
          </label>
          <label>
            Goals
            <textarea
              rows={2}
              value={plan.goals}
              onChange={(e) => setPlan((p) => ({ ...p, goals: e.target.value }))}
            />
          </label>
          <button type="submit" className="fp-portal-btn fp-portal-btn--pink">
            Save monthly plan
          </button>
        </form>
      ) : null}

      {tab === "ideas" ? (
        <div className="bb-club-ideas">
          <form
            className="bb-events-form fp-surface-white"
            onSubmit={(e) => {
              e.preventDefault();
              if (!ideaTitle.trim()) return;
              addEventIdea(clubId, ideaTitle.trim(), ideaNotes.trim());
              setIdeaTitle("");
              setIdeaNotes("");
              refresh();
            }}
          >
            <h3>Save event ideas</h3>
            <label>
              Idea title
              <input
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="Sunset rooftop series"
              />
            </label>
            <label>
              Notes
              <textarea
                rows={3}
                value={ideaNotes}
                onChange={(e) => setIdeaNotes(e.target.value)}
              />
            </label>
            <button type="submit" className="fp-portal-btn fp-portal-btn--pink">
              Save idea
            </button>
          </form>
          <ul className="bb-club-ideas__list">
            {ideas.map((idea) => (
              <li key={idea.id} className="fp-surface-white bb-club-ideas__item">
                <strong>{idea.title}</strong>
                {idea.notes ? <p>{idea.notes}</p> : null}
                <button
                  type="button"
                  className="fp-portal-link-btn"
                  onClick={() => {
                    removeEventIdea(idea.id);
                    refresh();
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
