"use client";

import "@/app/styles/bloom-entrance.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PINK, BOARD, NEAR_YOU_GRADS, type RealClub, type RealGathering } from "./clubs/shared";
import { ClubsHero } from "./clubs/clubs-hero";
import { FeaturedClubs } from "./clubs/featured-clubs";
import { ClubsSearchFilter } from "./clubs/clubs-search-filter";
import { AllClubsGrid } from "./clubs/all-clubs-grid";
import { UpcomingGatherings } from "./clubs/upcoming-gatherings";
import { ExploreByVibe } from "./clubs/explore-by-vibe";
import { NearYouClubs } from "./clubs/near-you-clubs";
import { StartClubCTA } from "./clubs/start-club-cta";

const NEAR_YOU_FALLBACK = [
  { name: "SoHo",          clubs: 0, grad: NEAR_YOU_GRADS[0] },
  { name: "Williamsburg",  clubs: 0, grad: NEAR_YOU_GRADS[1] },
  { name: "West Village",  clubs: 0, grad: NEAR_YOU_GRADS[2] },
  { name: "Brooklyn Hts",  clubs: 0, grad: NEAR_YOU_GRADS[3] },
  { name: "Harlem",        clubs: 0, grad: NEAR_YOU_GRADS[4] },
];

export function ClubsPage() {
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  const [clubs, setClubs] = useState<RealClub[]>([]);
  const [happenings, setHappenings] = useState<RealGathering[]>([]);
  const [nearYou, setNearYou] = useState(NEAR_YOU_FALLBACK);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("clubs")
      .select("id, name, description, primary_color, cover_url, slug, neighborhood, category")
      .eq("is_active", true)
      .order("member_count", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        const rows = (data ?? []) as RealClub[];
        setClubs(rows);

        const counts: Record<string, number> = {};
        for (const c of rows) {
          const n = c.neighborhood;
          if (n) counts[n] = (counts[n] ?? 0) + 1;
        }
        const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        if (entries.length > 0) {
          setNearYou(entries.map(([name, clubCount], i) => ({
            name, clubs: clubCount, grad: NEAR_YOU_GRADS[i % NEAR_YOU_GRADS.length],
          })));
        }
      });

    const now = new Date().toISOString();
    supabase
      .from("gatherings")
      .select("id, title, starts_at, venue, neighborhood")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(5)
      .then(({ data }) => { if (data) setHappenings(data as RealGathering[]); });
  }, []);

  return (
    <div className="bloom-world-enter" style={{ background: BOARD, minHeight: "100vh", fontFamily: "var(--font-jost)", paddingBottom: 120, paddingTop: "calc(env(safe-area-inset-top, 0px) + 54px)" }}>

      {/* Create Club FAB */}
      <Link href="/member/clubs/create" style={{ textDecoration: "none" }}>
        <div style={{
          position: "fixed", bottom: "calc(env(safe-area-inset-bottom,0px) + 88px)", right: 18, zIndex: 50,
          width: 44, height: 44, borderRadius: "50%", background: PINK,
          boxShadow: `0 4px 18px ${PINK}77`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </Link>

      <ClubsHero />
      <FeaturedClubs clubs={clubs} />
      <ClubsSearchFilter
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        showFilters={showFilters} setShowFilters={setShowFilters}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
      />
      <AllClubsGrid clubs={clubs} searchQuery={searchQuery} activeFilter={activeFilter} />
      <UpcomingGatherings happenings={happenings} />
      <ExploreByVibe activeVibe={activeVibe} onVibeChange={setActiveVibe} />
      <NearYouClubs nearYou={nearYou} />
      <StartClubCTA />
    </div>
  );
}
