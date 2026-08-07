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

function splitCountdown(targetIso: string) {
  const diffMs = new Date(targetIso).getTime() - Date.now();
  if (diffMs <= 0) return null;
  const totalSecs = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    mins: Math.floor((totalSecs % 3600) / 60),
  };
}

function CountdownCard({ targetIso, accent }: { targetIso: string; accent: string }) {
  const [t, setT] = useState<ReturnType<typeof splitCountdown>>(null);

  useEffect(() => {
    setT(splitCountdown(targetIso));
    const id = setInterval(() => setT(splitCountdown(targetIso)), 30_000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!t) return null;

  return (
    <div className="rounded-3xl p-5" style={{ background: "#161016" }}>
      <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jost)" }}>COUNTDOWN</p>
      <div className="flex gap-2 mb-2">
        {[{ v: t.days, l: "DAYS" }, { v: t.hours, l: "HRS" }, { v: t.mins, l: "MIN" }].map(box => (
          <div key={box.l} className="flex-1 text-center">
            <p className="text-2xl font-bold tabular-nums" style={{ color: accent, fontFamily: "var(--font-jost)" }}>
              {String(box.v).padStart(2, "0")}
            </p>
            <p className="text-[8px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>{box.l}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>until our night</p>
    </div>
  );
}

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
    { id: "attendees", label: "PEOPLE" },
    { id: "orders", label: "ORDERS" },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.push("/member/plans")}
            className="text-sm font-semibold"
            style={{ color: accent, fontFamily: "var(--font-jost)" }}
          >
            ← Plans
          </button>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: accent, fontFamily: "var(--font-jost)" }}>
            ✦ PLAN ROOM
          </p>
        </div>

        <h1
          className="text-4xl font-bold mb-3 leading-[0.98]"
          style={{ fontFamily: "var(--font-fraunces)", fontWeight: 700, color: "#111" }}
        >
          Let&apos;s make it{" "}
          <span style={{ color: accent, fontStyle: "italic", fontWeight: 600 }}>iconic</span>.
        </h1>

        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6" style={{ background: "rgba(0,0,0,0.05)" }}>
          <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#999" }}>PLAN FOR</span>
          <span className="text-sm font-bold" style={{ color: "#111", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{gathering.title}</span>
        </div>

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

            <CountdownCard targetIso={gathering.starts_at} accent={accent} />

            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <GatheringVoiceNotes gatheringId={gathering.id} myUserId={myUserId ?? ""} />
            </div>

            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <OutfitCheck gatheringId={gathering.id} myUserId={myUserId ?? ""} />
            </div>

            <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#bbb" }}>WHO&apos;S COMING</p>
              <div className="mt-2">
                <AttendeeAvatars gatheringId={gathering.id} accent={accent} max={20} />
              </div>
            </div>

            <Link
              href={chatHref}
              className="rounded-3xl p-5 flex items-center gap-3"
              style={{ background: `${accent}0C`, border: `1px solid ${accent}25`, textDecoration: "none" }}
            >
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#111" }}>Plan Chat</p>
                <p className="text-xs" style={{ color: "#888" }}>Say something, Bloomie…</p>
              </div>
              <span style={{ color: accent }}>→</span>
            </Link>
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
