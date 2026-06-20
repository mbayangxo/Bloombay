"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useArtifactMotion } from "@/lib/use-artifact-motion";
import { SEATS_VENUES } from "@/lib/member-portal-data";
import { MemberShell } from "../../components/member-shell";
import { HappeningsChrome } from "../../components/happenings-chrome";
import { SpaceMood } from "@/app/components/member/space-mood";
import { HappeningPosterObject } from "@/app/components/member/happening-poster-object";
import { SeatTicketObject } from "@/app/components/member/seat-ticket-object";
import {
  HAPPENING_POSTER_TEMPLATES,
  SEAT_TICKET_TEMPLATES,
  templateAt,
} from "@/lib/member-ui-templates";

type SeatVenue = {
  id: string;
  name: string;
  area: string;
  capacity: string;
  spotsLeft?: number;
  saved: boolean;
  gatheringId?: string;
};

function SeatsContent() {
  const [venues, setVenues] = useState<SeatVenue[]>(() =>
    SEATS_VENUES.map((v) => ({
      id: v.id,
      name: v.name,
      area: v.area,
      capacity: v.capacity,
      spotsLeft: v.spotsLeft,
      saved: v.saved,
    }))
  );
  const [source, setSource] = useState<"demo" | "db">("demo");
  const [loading, setLoading] = useState(true);
  const [animVenueId, setAnimVenueId] = useState<string | null>(null);
  const seatMotion = useArtifactMotion();

  const loadGatherings = useCallback(async () => {
    try {
      const res = await fetch("/api/irl/gatherings");
      if (!res.ok) throw new Error("not authed");
      const json = await res.json();
      if (json.source === "db" && json.gatherings?.length) {
        setSource("db");
        setVenues(
          json.gatherings.map(
            (g: {
              id: string;
              slug: string;
              title: string;
              area: string | null;
              capacity: number;
              spots_left: number;
              saved: boolean;
            }) => ({
              id: g.slug,
              gatheringId: g.id,
              name: g.title,
              area: g.area ?? "",
              capacity: `Up to ${g.capacity}`,
              spotsLeft: g.spots_left,
              saved: g.saved,
            })
          )
        );
      }
    } catch {
      /* stay on demo venues */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGatherings();
  }, [loadGatherings]);

  async function reserveSeat(venue: SeatVenue) {
    if (venue.saved) return;

    if (source === "db" && venue.gatheringId) {
      const res = await fetch("/api/irl/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gatheringId: venue.gatheringId }),
      });
      const json = await res.json();
      if (!json.ok) {
        alert(json.error ?? "Could not reserve seat. Sign in at /member/login first.");
        return;
      }
      setAnimVenueId(venue.id);
      seatMotion.trigger("seat-reserve");
      setVenues((prev) =>
        prev.map((v) =>
          v.id !== venue.id
            ? v
            : {
                ...v,
                saved: true,
                spotsLeft: json.gathering?.spots_left ?? Math.max(0, (v.spotsLeft ?? 1) - 1),
              }
        )
      );
      return;
    }

    setAnimVenueId(venue.id);
    seatMotion.trigger("seat-reserve");
    setVenues((prev) =>
      prev.map((v) =>
        v.id !== venue.id
          ? v
          : {
              ...v,
              saved: true,
              spotsLeft: Math.max(0, (v.spotsLeft ?? 1) - 1),
            }
      )
    );
  }

  return (
    <MemberShell compactHeader>
      <SpaceMood mood="happenings" showIntro={false}>
      <HappeningsChrome>
        <div className="mp-happenings-sub">
          <h2 className="mp-happenings-sub__title">Open seats</h2>
          <p className="mp-happenings-sub__sub">
            Save your seat — partners and hosts hold a place for you.
            {source === "db" ? " (Live from Supabase)" : loading ? "" : " (Demo — sign in for live seats)"}
          </p>
        </div>
        <section className="mp-page-body bb-physical-wall" style={{ paddingTop: 0 }}>
          <div className="bb-physical-wall__row">
          {venues.map((v, i) => {
            const motionClass = animVenueId === v.id ? seatMotion.className : "";
            const meta = `${v.area} · ${v.capacity}${
              typeof v.spotsLeft === "number" ? ` · ${v.spotsLeft} seats left` : ""
            }`;

            if (v.saved) {
              return (
                <div key={v.id} className={motionClass}>
                  <SeatTicketObject
                    index={i}
                    src={templateAt(SEAT_TICKET_TEMPLATES, i)}
                    title={v.name}
                    meta={meta}
                    code={`SEAT-${v.id.toUpperCase()}`}
                  />
                </div>
              );
            }

            return (
              <div key={v.id} className={motionClass}>
                <HappeningPosterObject
                  index={i}
                  src={templateAt(HAPPENING_POSTER_TEMPLATES, i)}
                  eyebrow="Open seat · Happenings"
                  title={v.name}
                  meta={meta}
                />
                <button
                  type="button"
                  className="mp-btn mp-btn--hot mp-btn--block bb-hm-rsvp-pulse"
                  style={{ marginTop: "0.65rem" }}
                  onClick={() => reserveSeat(v)}
                >
                  Save me a seat
                </button>
              </div>
            );
          })}
          </div>
          <Link href="/member/happenings/create" className="mp-link" style={{ display: "inline-block", marginTop: "0.5rem" }}>
            Hosting? Create a gathering →
          </Link>
          <Link href="/member/intros" className="mp-link" style={{ display: "inline-block" }}>
            Intros after you reserve →
          </Link>
        </section>
      </HappeningsChrome>
      </SpaceMood>
    </MemberShell>
  );
}

export default function SeatsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <SeatsContent />
    </Suspense>
  );
}
