"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import {
  gatheringToPoster,
  gatheringPriceLabel,
  type DbGathering,
} from "@/lib/happenings/gathering-to-poster";

type HapFilter = "All" | "Tonight" | "This Week" | "Free";

function isTonight(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + 7);
  return d >= now && d <= end;
}

export function HappeningsPage() {
  const [gatherings, setGatherings] = useState<DbGathering[]>([]);
  const [loading, setLoading] = useState(true);
  const [hapFilter, setHapFilter] = useState<HapFilter>("All");
  const [source, setSource] = useState<string>("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/member/gatherings");
      if (res.ok) {
        const json = await res.json();
        setGatherings(json.gatherings ?? []);
        setSource(json.source ?? "");
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return gatherings.filter((g) => {
      if (hapFilter === "Tonight") return isTonight(g.starts_at);
      if (hapFilter === "This Week") return isThisWeek(g.starts_at);
      if (hapFilter === "Free") return !g.price_cents || g.price_cents <= 0;
      return true;
    });
  }, [gatherings, hapFilter]);

  const posters = filtered.map((g) => gatheringToPoster(g));

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 pb-4 md:px-10 md:pt-8 md:max-w-[1280px] md:mx-auto">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
          ✦ NYC · HAPPENINGS
        </p>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1
              className="font-black leading-none"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(34px,6vw,48px)",
                color: "#111",
                lineHeight: 0.92,
              }}
            >
              What&apos;s<br />
              happening.
            </h1>
            <p className="text-sm italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
              Real plans from real women — no filler listings.
            </p>
          </div>
          <Link
            href="/member/happenings/create"
            className="px-4 py-2 rounded-full text-xs font-bold text-white"
            style={{ background: "#111" }}
          >
            + Create
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0">
          {(["All", "Tonight", "This Week", "Free"] as HapFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setHapFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={
                hapFilter === f
                  ? { background: "#FF1F7D", color: "white" }
                  : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-10 md:max-w-[1280px] md:mx-auto">
        {loading ? (
          <p className="text-sm py-12 text-center" style={{ color: "#bbb" }}>
            Loading happenings…
          </p>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl p-10 text-center bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <p className="text-lg font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
              No happenings yet
            </p>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "#888" }}>
              {gatherings.length === 0
                ? "BloomBay only shows real gatherings — create the first one, or check back when Club Mamas post."
                : "Nothing matches this filter. Try another or create something new."}
            </p>
            <Link
              href="/member/happenings/create"
              className="inline-block px-6 py-3 rounded-full text-sm font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Create a happening →
            </Link>
            {source === "demo" ? (
              <p className="text-xs mt-4" style={{ color: "#bbb" }}>
                Run migration 018_happening_posters.sql in Supabase to enable poster fields.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            {filtered.map((g) => {
              const poster = gatheringToPoster(g);
              return (
                <div key={g.id} className="flex flex-col gap-2">
                  <PosterRenderer data={poster} />
                  <p className="text-[11px] font-semibold px-1" style={{ color: "#888" }}>
                    {gatheringPriceLabel(g)} · {poster.seatsLeft ?? 0} seats
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-8 pb-10 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "#FF1F7D" }}>
            CONFETTI ✿
          </p>
          <h2 className="font-black leading-none mb-3" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.35rem", color: "#111" }}>
            Celebrations coming soon
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#888" }}>
            Birthday dinners, promotions, and milestones will show here when members create them — not placeholder cards.
          </p>
          <Link href="/member/happenings/create" className="text-sm font-bold" style={{ color: "#FF1F7D" }}>
            Plan something special →
          </Link>
        </div>
      </div>
    </div>
  );
}
