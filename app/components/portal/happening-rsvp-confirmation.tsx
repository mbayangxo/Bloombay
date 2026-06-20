"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import type { PosterTemplateData } from "@/lib/poster-templates/types";
import type { GatheringPlan } from "@/lib/member-gathering-plans";

export function HappeningRsvpConfirmation({
  plan,
  poster,
  onDone,
}: {
  plan: GatheringPlan;
  poster: PosterTemplateData;
  onDone: () => void;
}) {
  const router = useRouter();

  function enterPlanRoom() {
    onDone();
    router.push(plan.planRoomHref);
  }

  return (
    <div className="min-h-screen pb-24 flex flex-col" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 max-w-md mx-auto flex-1 flex flex-col">
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>
          ✦ CONFIRMED
        </p>
        <h1
          className="text-3xl font-bold italic mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "#111" }}
        >
          You&apos;re going.
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#888" }}>
          Your ticket is in Plans. Plan room and group chat are unlocked for this happening.
        </p>

        <div className="mx-auto w-full max-w-[200px] mb-6">
          <PosterRenderer data={{ ...poster, ctaLabel: "Your ticket", href: undefined }} />
        </div>

        <div
          className="rounded-2xl p-4 mb-6 bg-white"
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

        <div className="flex flex-col gap-2.5 mt-auto">
          <button
            type="button"
            onClick={enterPlanRoom}
            className="w-full py-4 rounded-2xl font-bold text-white"
            style={{ background: poster.accentColor ?? "#FF1F7D" }}
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
            style={{ border: "1.5px solid #FFE0EE", color: "#FF1F7D" }}
          >
            Open plan group chat
          </Link>
        </div>
      </div>
    </div>
  );
}
