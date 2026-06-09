"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DbGathering } from "@/lib/happenings/gathering-to-poster";
import { gatheringToPoster } from "@/lib/happenings/gathering-to-poster";
import { getGatheringPlan } from "@/lib/member-gathering-plans";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";

export function HappeningPlanRoom({ gathering }: { gathering: DbGathering }) {
  const router = useRouter();
  const plan = getGatheringPlan(gathering.id);
  const poster = gatheringToPoster(gathering);
  const chatHref = plan?.chatHref ?? `/member/messages?plan=${gathering.slug}`;

  if (!plan || plan.commitment !== "going") {
    return (
      <div className="min-h-screen px-5 pt-16" style={{ background: "#FDFAF5" }}>
        <p className="font-bold mb-2" style={{ color: "#111" }}>
          Plan room locked
        </p>
        <p className="text-sm mb-4" style={{ color: "#888" }}>
          RSVP with &ldquo;I would love to go&rdquo; to unlock the planner and group chat.
        </p>
        <Link href={`/member/happenings/${gathering.slug}`} style={{ color: "#FF1F7D" }}>
          ← Back to happening
        </Link>
      </div>
    );
  }

  const when = new Date(gathering.starts_at).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => router.push("/member/plans")}
          className="text-sm font-semibold mb-6"
          style={{ color: "#FF1F7D" }}
        >
          ← Plans
        </button>

        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>
          PLAN ROOM
        </p>
        <h1
          className="text-3xl font-bold italic mb-1"
          style={{ fontFamily: "var(--font-playfair)", color: "#111" }}
        >
          {gathering.title}
        </h1>
        <p className="text-sm mb-6" style={{ color: "#888" }}>
          {when} · {plan.place}
        </p>

        <div className="max-w-[180px] mb-6">
          <PosterRenderer data={{ ...poster, ctaLabel: undefined, href: undefined }} />
        </div>

        <div
          className="rounded-3xl p-5 bg-white mb-4"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>
            THE PLAN
          </p>
          <ul className="text-sm leading-relaxed space-y-2" style={{ color: "#444" }}>
            <li>✦ Meet at {gathering.venue ?? "the venue"} — look for BloomBay women at the host table.</li>
            <li>✦ Check the group chat for last-minute updates from the host.</li>
            <li>✦ Your ticket stays in Plans — pull it up at the door if needed.</li>
          </ul>
          {gathering.description ? (
            <p className="text-sm mt-4 leading-relaxed" style={{ color: "#666" }}>
              {gathering.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href={chatHref}
            className="w-full py-4 rounded-2xl font-bold text-white text-center"
            style={{ background: poster.accentColor ?? "#FF1F7D" }}
          >
            Open plan group chat →
          </Link>
          <Link
            href="/member/plans"
            className="w-full py-3.5 rounded-2xl font-bold text-center"
            style={{ background: "rgba(0,0,0,0.06)", color: "#444" }}
          >
            Back to Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
