"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClubPolaroidCard } from "@/app/components/member/club-polaroid-card";
import { ClubWorldObject } from "@/app/components/member/club-world-object";
import {
  CLUBS_MAGAZINE_NEIGHBORHOODS,
  CLUBS_MAGAZINE_ONBOARDING,
  CLUBS_MAGAZINE_TRADITIONS,
  CLUBS_MAGAZINE_VIBES,
} from "@/lib/clubs-magazine";
import { listDiscoveredClubs, type DiscoveredClub } from "@/lib/club-registry";

export function ClubsMagazinePage() {
  const [clubs, setClubs] = useState<DiscoveredClub[]>(() =>
    typeof window !== "undefined" ? listDiscoveredClubs() : []
  );

  const refresh = useCallback(() => {
    setClubs(listDiscoveredClubs());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-clubs-discovery-updated", refresh);
    window.addEventListener("bb-events-updated", refresh);
    return () => {
      window.removeEventListener("bb-clubs-discovery-updated", refresh);
      window.removeEventListener("bb-events-updated", refresh);
    };
  }, [refresh]);

  const [showAllClubs, setShowAllClubs] = useState(false);

  const featured = clubs.slice(0, 8);
  const spotlight = clubs.find((c) => c.id === "culture-crawl") ?? clubs[0];
  const visibleClubs = showAllClubs ? clubs : clubs.slice(0, 6);

  const traditions = useMemo(() => {
    const live = clubs
      .filter((c) => c.upcomingEvents[0])
      .slice(0, 5)
      .map((c) => ({
        label: c.upcomingEvents[0]!.title,
        href: `/member/clubs/${c.id}`,
        meta: `${c.upcomingEvents[0]!.date} · ${c.name}`,
      }));
    if (live.length >= 3) return live;
    return CLUBS_MAGAZINE_TRADITIONS.map((t) => ({ ...t, meta: undefined }));
  }, [clubs]);

  return (
    <div className="bb-clubs-board bb-physical-surface">
      <header className="bb-clubs-board__hero">
        <div className="bb-clubs-board__hero-copy">
          <p className="bb-clubs-board__eyebrow">BloomBay clubs</p>
          <h1 className="bb-clubs-board__title">
            Find your <em>girls</em> through clubs
          </h1>
          <p className="bb-clubs-board__sub">Join the rooms where your social life starts.</p>
        </div>
        <Link href="/member/clubs/discover" className="mp-btn mp-btn--hot mp-btn--sm bb-clubs-board__discover">
          Discover clubs →
        </Link>
      </header>

      <section className="bb-clubs-board__section" aria-labelledby="featured-clubs">
        <div className="bb-clubs-board__section-head">
          <div>
            <h2 id="featured-clubs" className="bb-clubs-board__section-title">
              Featured clubs
            </h2>
            <p className="bb-clubs-board__section-whisper">Real clubs · real photos · tap to join</p>
          </div>
          <Link href="/member/clubs/discover" className="bb-clubs-board__pill">
            See all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="bb-clubs-board__empty">Clubs land here when hosts publish — check discover soon.</p>
        ) : (
          <div className="bb-clubs-board__carousel">
            {featured.map((club, i) => (
              <ClubPolaroidCard key={club.id} club={club} heroImage={club.heroImage} index={i} />
            ))}
          </div>
        )}
      </section>

      <div className="bb-clubs-board__mid">
        <section className="bb-clubs-board__traditions" aria-labelledby="club-traditions">
          <h2 id="club-traditions" className="bb-clubs-board__section-title">
            Traditions
          </h2>
          <ul className="bb-clubs-board__tradition-list">
            {traditions.map((t) => (
              <li key={t.label}>
                <Link href={t.href} className="bb-clubs-board__tradition-row">
                  <span>{t.label}</span>
                  {"meta" in t && t.meta ? <small>{t.meta}</small> : null}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/member/calendar" className="mp-link">
            Full calendar →
          </Link>
        </section>

        <section className="bb-clubs-board__onboard" aria-labelledby="new-here">
          <h2 id="new-here" className="bb-clubs-board__section-title bb-clubs-board__section-title--ink">
            New here?
          </h2>
          <ol className="bb-clubs-board__onboard-list">
            {CLUBS_MAGAZINE_ONBOARDING.map((step, i) => (
              <li key={step.week}>
                <Link href={step.href} className="bb-clubs-board__onboard-row">
                  <span className="bb-clubs-board__onboard-num">{i + 1}</span>
                  <span>
                    <strong>{step.week}</strong> — {step.task}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {spotlight ? (
        <section className="bb-clubs-board__spotlight" aria-labelledby="club-spotlight">
          <div className="bb-clubs-board__spotlight-copy">
            <p className="bb-clubs-board__eyebrow">Club spotlight</p>
            <h2 id="club-spotlight" className="bb-clubs-board__spotlight-title">
              {spotlight.name} — {spotlight.upcomingEvents[0]?.title ?? spotlight.tagline}
            </h2>
            <Link href={`/member/clubs/${spotlight.id}`} className="mp-btn mp-btn--ink mp-btn--sm">
              I&apos;m in
            </Link>
          </div>
          <Link href={`/member/clubs/${spotlight.id}`} className="bb-clubs-board__spotlight-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={spotlight.heroImage} alt="" loading="lazy" draggable={false} />
          </Link>
        </section>
      ) : null}

      <section className="bb-clubs-board__vibes" aria-label="Explore by vibe">
        <h2 className="bb-clubs-board__section-title">Explore by vibe</h2>
        <div className="bb-clubs-board__vibe-chips">
          {CLUBS_MAGAZINE_VIBES.map((v) => (
            <Link key={v.label} href={v.href} className="bb-clubs-board__vibe-chip">
              {v.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bb-clubs-board__near" aria-labelledby="near-you">
        <h2 id="near-you" className="bb-clubs-board__section-title bb-clubs-board__section-title--light">
          Near you · SoHo, NYC
        </h2>
        <div className="bb-clubs-board__near-grid">
          {CLUBS_MAGAZINE_NEIGHBORHOODS.map((n) => (
            <Link key={n.name} href={n.href} className="bb-clubs-board__near-card">
              <span className="bb-clubs-board__near-name">{n.name}</span>
              <span className="bb-clubs-board__near-count">{n.clubs} clubs</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bb-clubs-board__all" aria-label="All clubs">
        <h2 className="bb-clubs-board__section-title">All clubs on BloomBay</h2>
        <div className="bb-club-worlds bb-club-worlds--grid">
          {visibleClubs.map((club, i) => (
            <ClubWorldObject key={club.id} club={club} heroImage={club.heroImage} index={i} />
          ))}
        </div>
        {!showAllClubs && clubs.length > 6 ? (
          <button
            type="button"
            className="mp-btn mp-btn--outline mp-btn--sm bb-clubs-board__load-more"
            onClick={() => setShowAllClubs(true)}
          >
            Show all {clubs.length} clubs
          </button>
        ) : null}
      </section>
    </div>
  );
}
