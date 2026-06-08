"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EditableDossier } from "@/app/components/member/editable-dossier";
import { ClubWorldObject } from "@/app/components/member/club-world-object";
import { listDiscoveredClubs, type DiscoveredClub } from "@/lib/club-registry";

export function ClubsDiscoverPage() {
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

  return (
    <div className="bb-clubs-discover bb-physical-surface">
      <header className="bb-clubs-discover__head">
        <p className="bb-clubs-discover__kicker">Club discovery</p>
        <h1 className="bb-clubs-discover__title">Find your girls through clubs</h1>
        <p className="bb-clubs-discover__sub">Join the rooms where your social life starts.</p>
      </header>

      <div className="bb-clubs-discover__body">
        <EditableDossier className="bb-clubs-discover__dossier" />

        <section className="bb-clubs-discover__live" aria-label="Clubs on the board">
          <div className="bb-clubs-discover__live-head">
            <h2 className="bb-clubs-discover__live-title">Live on the board</h2>
            <p className="bb-clubs-discover__live-whisper">
              Hosts & partners publish here — new clubs land automatically.
            </p>
          </div>
          {clubs.length === 0 ? (
            <p className="bb-clubs-discover__empty">No clubs on the board yet — check back soon.</p>
          ) : (
            <div className="bb-club-worlds bb-club-worlds--grid bb-clubs-discover__grid">
              {clubs.map((club, i) => (
                <ClubWorldObject key={club.id} club={club} heroImage={club.heroImage} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="bb-clubs-discover__foot">
        <Link href="/member/clubs" className="mp-btn mp-btn--outline mp-btn--sm">
          Open clubs board →
        </Link>
        <Link href="/member/clubs/board" className="mp-link">
          Club rankings
        </Link>
      </div>
    </div>
  );
}
