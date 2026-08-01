"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import type { PosterTemplateData } from "@/lib/poster-templates/types";
import type { GatheringPlan } from "@/lib/member-gathering-plans";
import { gatheringPricing, formatCents, type DbGathering } from "@/lib/happenings/gathering-to-poster";
import { AttendeeAvatars } from "@/app/components/portal/happening/attendee-avatars";
import { ChemistryPreview } from "@/app/components/portal/happening/chemistry-preview";
import { SeatTicketStub } from "@/app/components/portal/happening/seat-ticket-stub";

export function HappeningRsvpConfirmation({
  plan,
  poster,
  gathering,
  onDone,
}: {
  plan: GatheringPlan;
  poster: PosterTemplateData;
  gathering?: DbGathering;
  onDone: () => void;
}) {
  const router = useRouter();
  const accent = poster.accentColor ?? "#FF1F7D";
  const [mySeat, setMySeat] = useState<{ seat_number: number | null; table_number: number | null } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/gatherings/${encodeURIComponent(plan.gatheringId)}/attendees`)
      .then(r => r.json())
      .then(d => { if (alive) setMySeat(d.mySeat ?? null); })
      .catch(() => {});
    return () => { alive = false; };
  }, [plan.gatheringId]);

  function enterPlanRoom() {
    onDone();
    router.push(plan.planRoomHref);
  }

  function copyInvite() {
    const link = typeof window !== "undefined" ? `${window.location.origin}/member/happenings/${plan.slug}` : "";
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const pricing = gathering ? gatheringPricing(gathering) : null;

  return (
    <div className="min-h-screen pb-24 flex flex-col" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 max-w-md mx-auto flex-1 flex flex-col w-full">
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: accent }}>
          ✦ CONFIRMED
        </p>
        <h1
          className="text-3xl font-bold italic mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "#111" }}
        >
          You&apos;re going.
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#888" }}>
          Your ticket is in Plans. The plan room is unlocked for this happening.
        </p>

        <div className="mx-auto w-full max-w-[200px] mb-6">
          <PosterRenderer data={{ ...poster, ctaLabel: "Your ticket", href: undefined }} />
        </div>

        <div
          className="rounded-2xl p-4 mb-4 bg-white"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          <p className="font-bold text-base mb-1" style={{ color: "#111" }}>
            {plan.title}
          </p>
          <p className="text-sm" style={{ color: "#666" }}>
            {plan.when}
          </p>
          <p className="text-sm" style={{ color: "#666" }}>
            {plan.place}
          </p>
        </div>

        <div className="mb-4">
          <SeatTicketStub
            seatNumber={mySeat?.seat_number ?? null}
            tableNumber={mySeat?.table_number ?? null}
            tableSize={gathering?.table_size ?? 8}
            accent={accent}
          />
        </div>

        {pricing && pricing.totalCents > 0 && (
          <div className="rounded-2xl p-4 mb-4 bg-white flex items-center justify-between" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>
              {pricing.hasDeposit ? "PAID TODAY" : "TOTAL"}
            </span>
            <span className="text-lg font-bold" style={{ color: accent, fontFamily: "var(--font-playfair)" }}>
              {formatCents(pricing.hasDeposit ? pricing.depositCents : pricing.totalCents)}
            </span>
          </div>
        )}

        <div className="rounded-2xl p-4 mb-6 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#bbb" }}>WHO YOU&apos;LL BE WITH</p>
          <AttendeeAvatars gatheringId={plan.gatheringId} accent={accent} />
          <div className="mt-3">
            <ChemistryPreview gatheringId={plan.gatheringId} accent={accent} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={copyInvite}
            className="w-full py-3.5 rounded-2xl font-bold text-center"
            style={{ background: copied ? "#22C55E" : "rgba(0,0,0,0.06)", color: copied ? "white" : "#444" }}
          >
            {copied ? "Link copied ✓" : "Invite a Bloomie"}
          </button>
        </div>

        <div className="flex flex-col gap-2.5 mt-4">
          <button
            type="button"
            onClick={enterPlanRoom}
            className="w-full py-4 rounded-2xl font-bold text-white"
            style={{ background: accent }}
          >
            Enter plan room →
          </button>
          <Link
            href="/member/plans"
            className="w-full py-3.5 rounded-2xl font-bold text-center"
            style={{ background: "rgba(0,0,0,0.06)", color: "#444" }}
          >
            View ticket in Plans
          </Link>
          <Link
            href={plan.chatHref}
            className="w-full py-3.5 rounded-2xl font-bold text-center"
            style={{ border: "1.5px solid #FFE0EE", color: accent }}
          >
            Go to Chats
          </Link>
        </div>
      </div>
    </div>
  );
}
