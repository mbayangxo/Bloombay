"use client";

import { useEffect, useState, useTransition } from "react";
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
import { isGatheringSaved, toggleGatheringSave } from "@/lib/actions/member-saves";
import { giveGatheringGift, takeBackGatheringGift, getGatheringFlowersForUser } from "@/lib/actions/happenings";
import { FlowerButton } from "@/app/components/shared/flower-button";
import type { GiftKind } from "@/lib/bloom-gifts";
import { unitsForKind } from "@/lib/bloom-gifts";
import { BloomNotesBoard } from "@/app/components/portal/bloom-notes-board";
import { HappeningRsvpConfirmation } from "./happening-rsvp-confirmation";
import { RoomBriefCard } from "@/app/components/portal/room-brief-card";
import { BloomCardsDeck } from "@/app/components/portal/bloom-cards-deck";
import { useGatheringAnalytics } from "@/app/components/portal/host-event-analytics";

type RsvpPhase = "choose" | "confirm" | "done";

export function HappeningDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [gathering, setGathering] = useState<DbGathering | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [phase, setPhase] = useState<RsvpPhase>("choose");
  const [existing, setExisting] = useState<GatheringCommitment | null>(null);
  const [gemSaved, setGemSaved] = useState(false);
  const [savePending, startSaveTransition] = useTransition();
  const [flowerUnits, setFlowerUnits] = useState(0);
  const [myGiftKind, setMyGiftKind] = useState<GiftKind | null>(null);
  const [canEngage, setCanEngage] = useState(false);

  useGatheringAnalytics(gathering?.id);

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
          setGemSaved(await isGatheringSaved(g.id));
          const flowers = await getGatheringFlowersForUser([g.id]);
          const fl = flowers[g.id] ?? { units: 0, count: 0, gave: false, myKind: null };
          setFlowerUnits(fl.units ?? fl.count ?? 0);
          setMyGiftKind(fl.myKind ?? null);
          const eng = await fetch(`/api/happenings/can-engage?gatheringId=${encodeURIComponent(g.id)}`);
          if (eng.ok) {
            const ej = await eng.json();
            setCanEngage(!!ej.allowed);
          }
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  // Refresh engage gate after RSVP going
  useEffect(() => {
    if (!gathering || existing !== "going") return;
    setCanEngage(true);
  }, [gathering, existing]);

  function onToggleGem() {
    if (!gathering) return;
    const next = !gemSaved;
    setGemSaved(next);
    startSaveTransition(async () => {
      const result = await toggleGatheringSave(gathering.id);
      if (result.error) setGemSaved(!next);
      else setGemSaved(result.saved);
    });
  }

  async function onGiveGift(kind: GiftKind) {
    if (!gathering) return;
    const prevUnits = flowerUnits;
    const prevKind = myGiftKind;
    const prevGave = prevKind ? unitsForKind(prevKind) : 0;
    const nextUnits = unitsForKind(kind);

    if (prevKind === kind) {
      setMyGiftKind(null);
      setFlowerUnits(Math.max(0, prevUnits - prevGave));
    } else {
      setMyGiftKind(kind);
      setFlowerUnits(Math.max(0, prevUnits - prevGave + nextUnits));
    }

    const result = await giveGatheringGift(gathering.id, kind);
    if (result.gave) {
      setMyGiftKind(result.kind);
    } else {
      setMyGiftKind(null);
      setFlowerUnits(Math.max(0, prevUnits - prevGave));
    }
  }

  async function onTakeBackGift() {
    if (!gathering) return;
    const prevUnits = flowerUnits;
    const prevKind = myGiftKind;
    const prevGave = prevKind ? unitsForKind(prevKind) : 0;
    setMyGiftKind(null);
    setFlowerUnits(Math.max(0, prevUnits - prevGave));
    await takeBackGatheringGift(gathering.id);
  }

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
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold"
            style={{ color: "#FF1F7D" }}
          >
            ← Happenings
          </button>
          <div className="flex items-center gap-2">
            <FlowerButton
              size="sm"
              units={flowerUnits}
              myKind={myGiftKind}
              onGive={onGiveGift}
              onTakeBack={onTakeBackGift}
              disabled={!canEngage}
            />
            <Link
              href="/member/gems"
              className="text-[11px] font-bold tracking-wide"
              style={{ color: "#888", textDecoration: "none" }}
            >
              My gems
            </Link>
            <button
              type="button"
              onClick={onToggleGem}
              disabled={savePending}
              aria-label={gemSaved ? "Remove from My gems" : "Save to My gems"}
              className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50"
              style={{
                background: gemSaved ? "rgba(255,31,125,0.1)" : "white",
                border: `1.5px solid ${gemSaved ? "#FF1F7D" : "#E8E8E8"}`,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={gemSaved ? "#FF1F7D" : "none"}
                stroke="#FF1F7D"
                strokeWidth="2.2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <PosterRenderer data={{ ...poster, ctaLabel: undefined, href: undefined }} />
        </div>

        <RoomBriefCard gatheringId={gathering.id} />

        <div className="rounded-3xl p-5 bg-white mb-4" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <BloomCardsDeck context="attendee" />
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

        <BloomNotesBoard
          placeSlug={`happening-${gathering.slug}`}
          placeName={gathering.title}
          gatheringId={gathering.id}
          brand={poster.accentColor ?? "#FF1F7D"}
          accent="#FF69B4"
          seeAllHref={null}
        />

        {existing === "going" ? (
          <div className="flex flex-col gap-2.5">
            <div
              className="w-full py-4 rounded-2xl text-center font-bold"
              style={{ background: "rgba(255,31,125,0.07)", color: "#FF1F7D" }}
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
              style={{ background: "rgba(255,31,125,0.06)", color: "#FF1F7D" }}
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
