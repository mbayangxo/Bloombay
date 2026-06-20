"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import {
  gatheringToPoster,
  gatheringPriceLabel,
  type DbGathering,
} from "@/lib/happenings/gathering-to-poster";
import {
  gatheringPlanFromDb,
  getGatheringPlan,
  saveGatheringPlan,
  type GatheringCommitment,
} from "@/lib/member-gathering-plans";
import { HappeningRsvpConfirmation } from "./happening-rsvp-confirmation";

type RsvpPhase = "choose" | "confirm" | "done";

export function HappeningDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [gathering, setGathering] = useState<DbGathering | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [phase, setPhase] = useState<RsvpPhase>("choose");
  const [existing, setExisting] = useState<GatheringCommitment | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/member/gatherings/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const json = await res.json();
        const g = json.gathering ?? null;
        setGathering(g);
        if (g) {
          const saved = getGatheringPlan(g.id);
          if (saved) {
            setExisting(saved.commitment);
            if (saved.commitment === "going") setPhase("done");
          }
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FDFAF5" }}>
        <p className="text-sm" style={{ color: "#888" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (!gathering) {
    return (
      <div className="min-h-screen px-5 pt-16" style={{ background: "#FDFAF5" }}>
        <p className="font-bold text-lg mb-2" style={{ color: "#111" }}>
          Happening not found
        </p>
        <Link href="/member/happenings" style={{ color: "#FF1F7D" }}>
          ← Back to Happenings
        </Link>
      </div>
    );
  }

  const poster = gatheringToPoster(gathering);
  const price = gatheringPriceLabel(gathering);
  const savedPlan = getGatheringPlan(gathering.id);

  async function commitRsvp(commitment: GatheringCommitment) {
    setRsvpBusy(true);

    if (commitment === "going") {
      const res = await fetch("/api/irl/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gatheringId: gathering!.id }),
      });
      setRsvpBusy(false);
      if (!res.ok) return;

      const plan = gatheringPlanFromDb(gathering!, "going");
      saveGatheringPlan(plan);
      setExisting("going");
      setPhase("confirm");
      return;
    }

    const plan = gatheringPlanFromDb(gathering!, "debating");
    saveGatheringPlan(plan);
    setExisting("debating");
    setRsvpBusy(false);
  }

  if (phase === "confirm") {
    const confirmPlan =
      getGatheringPlan(gathering.id) ?? gatheringPlanFromDb(gathering, "going");
    return (
      <HappeningRsvpConfirmation
        plan={confirmPlan}
        poster={poster}
        onDone={() => setPhase("done")}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold mb-6"
          style={{ color: "#FF1F7D" }}
        >
          ← Happenings
        </button>

        <div className="mb-6">
          <PosterRenderer data={{ ...poster, ctaLabel: undefined, href: undefined }} />
        </div>

        <div className="rounded-3xl p-5 bg-white mb-4" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: poster.accentColor }}>
            {poster.category}
          </p>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
            {gathering.title}
          </h1>
          <p className="text-sm mb-1" style={{ color: "#666" }}>
            {poster.location}
          </p>
          <p className="text-sm font-semibold" style={{ color: "#111" }}>
            {poster.date} · {poster.time}
          </p>
          <p className="text-sm mt-3 font-bold" style={{ color: poster.accentColor }}>
            {price} · {(gathering.spots_left ?? gathering.capacity) ?? 0} seats left
          </p>
          {gathering.description ? (
            <p className="text-sm mt-4 leading-relaxed" style={{ color: "#666" }}>
              {gathering.description}
            </p>
          ) : null}
        </div>

        {existing === "going" ? (
          <div className="flex flex-col gap-2.5">
            <div
              className="w-full py-4 rounded-2xl text-center font-bold"
              style={{ background: "#FFF9E6", color: "#b45309" }}
            >
              You&apos;re going ✓ — ticket in Plans
            </div>
            <Link
              href={savedPlan?.planRoomHref ?? `/member/plan/${gathering.slug}`}
              className="w-full py-4 rounded-2xl font-bold text-white text-center"
              style={{ background: poster.accentColor ?? "#FF1F7D" }}
            >
              Open plan room →
            </Link>
            <Link
              href="/member/plans"
              className="w-full py-3.5 rounded-2xl font-bold text-center"
              style={{ background: "rgba(0,0,0,0.06)", color: "#444" }}
            >
              View in Plans
            </Link>
          </div>
        ) : existing === "debating" ? (
          <div className="flex flex-col gap-2.5">
            <div
              className="w-full py-4 rounded-2xl text-center font-bold text-sm leading-snug px-4"
              style={{ background: "#f5f0ff", color: "#6b4c9a" }}
            >
              Still debating — we saved your interest. Tap below when you&apos;re ready to go.
            </div>
            <button
              type="button"
              disabled={rsvpBusy}
              onClick={() => void commitRsvp("going")}
              className="w-full py-4 rounded-2xl font-bold text-white disabled:opacity-50"
              style={{ background: poster.accentColor ?? "#FF1F7D" }}
            >
              {rsvpBusy ? "Saving…" : "I would love to go →"}
            </button>
            <Link href="/member/plans" className="text-center text-sm font-semibold" style={{ color: "#FF1F7D" }}>
              View in Plans
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold tracking-widest uppercase text-center mb-1" style={{ color: "#bbb" }}>
              How are you feeling?
            </p>
            <button
              type="button"
              disabled={rsvpBusy}
              onClick={() => void commitRsvp("going")}
              className="w-full py-4 rounded-2xl font-bold text-white disabled:opacity-50"
              style={{ background: poster.accentColor ?? "#FF1F7D" }}
            >
              {rsvpBusy ? "Saving…" : "I would love to go"}
            </button>
            <button
              type="button"
              disabled={rsvpBusy}
              onClick={() => void commitRsvp("debating")}
              className="w-full py-4 rounded-2xl font-bold disabled:opacity-50"
              style={{ background: "white", color: "#444", border: "1.5px solid #E8E8E8" }}
            >
              Still debating, but I&apos;d like to go
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
