"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DbGathering } from "@/lib/happenings/gathering-to-poster";
import { gatheringToPoster } from "@/lib/happenings/gathering-to-poster";
import { getGatheringPlan } from "@/lib/member-gathering-plans";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import { createClient } from "@/lib/supabase/client";
import { AttendeeAvatars } from "@/app/components/portal/happening/attendee-avatars";
import { ChemistryPreview } from "@/app/components/portal/happening/chemistry-preview";
import { OutfitCheck } from "@/app/components/portal/happening/outfit-check";
import { GatheringVoiceNotes } from "@/app/components/portal/happening/gathering-voice-notes";
import { PreorderAddons } from "@/app/components/portal/happening/preorder-addons";
import { HostMenuManager } from "@/app/components/portal/happening/host-menu-manager";

type PlanTab = "plan" | "attendees" | "orders";

export function HappeningPlanRoom({ gathering }: { gathering: DbGathering }) {
  const router = useRouter();
  const plan = getGatheringPlan(gathering.id);
  const poster = gatheringToPoster(gathering);
  const chatHref = plan?.chatHref ?? "/member/chat";
  const accent = poster.accentColor ?? "#FF1F7D";
  const [tab, setTab] = useState<PlanTab>("plan");
  const [myUserId, setMyUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setMyUserId(data.user?.id ?? null));
  }, []);

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

  const TABS: { id: PlanTab; label: string }[] = [
    { id: "plan", label: "PLAN" },
    { id: "attendees", label: "ATTENDEES" },
    { id: "orders", label: "ORDERS" },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => router.push("/member/plans")}
          className="text-sm font-semibold mb-6"
          style={{ color: accent }}
        >
          ← Plans
        </button>

        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: accent }}>
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

        {/* Tabs */}
        <div className="flex border-b mb-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="flex-1 pb-2.5 text-[10px] font-bold tracking-widest"
              style={{
                color: tab === t.id ? accent : "#bbb",
                borderBottom: tab === t.id ? `2px solid ${accent}` : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "plan" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>
                THE PLAN
              </p>
              <ul className="text-sm leading-relaxed space-y-2" style={{ color: "#444" }}>
                <li>✦ Meet at {gathering.venue ?? "the venue"} — look for BloomBay women at the host table.</li>
                <li>✦ Message the host directly for last-minute updates.</li>
                <li>✦ Your ticket stays in Plans — pull it up at the door if needed.</li>
              </ul>
              {gathering.dress_code && (
                <p className="text-sm mt-3 italic" style={{ color: accent }}>Dress code: {gathering.dress_code}</p>
              )}
              {gathering.description ? (
                <p className="text-sm mt-4 leading-relaxed" style={{ color: "#666" }}>
                  {gathering.description}
                </p>
              ) : null}
            </div>

            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <OutfitCheck gatheringId={gathering.id} myUserId={myUserId ?? ""} />
            </div>

            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <GatheringVoiceNotes gatheringId={gathering.id} myUserId={myUserId ?? ""} />
            </div>
          </div>
        )}

        {tab === "attendees" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <AttendeeAvatars gatheringId={gathering.id} accent={accent} max={20} />
            </div>
            <ChemistryPreview gatheringId={gathering.id} accent={accent} />
          </div>
        )}

        {tab === "orders" && (
          <div className="flex flex-col gap-4">
            {myUserId && gathering.host_id === myUserId && (
              <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <HostMenuManager gatheringId={gathering.id} accent={accent} />
              </div>
            )}
            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <PreorderAddons gatheringId={gathering.id} accent={accent} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5 mt-6">
          <Link
            href={chatHref}
            className="w-full py-4 rounded-2xl font-bold text-white text-center"
            style={{ background: accent }}
          >
            Go to Chats →
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
