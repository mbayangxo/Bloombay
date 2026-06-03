"use client";

import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "@/app/components/portal/time-wrapper";

const MY_PLANS = [
  { id: 1, title: "Girls Dinner · Carbone", date: "Tonight 7PM", who: "Aminah + 2 others", tag: "TONIGHT", status: "confirmed", type: "event" },
  { id: 2, title: "Pilates + Matcha Morning", date: "Sunday 9AM", who: "Sofia and you", tag: "SUNDAY", status: "confirmed", type: "event" },
  { id: 3, title: "MoMA + Froyo After", date: "Saturday 2PM", who: "Girl Creatives · 6 women", tag: "SATURDAY", status: "pending", type: "event" },
];

const PLAN_ROOMS = [
  { id: 1, name: "Morocco October", members: 7, last: "Zara: I booked my flight!!!", time: "8h" },
  { id: 2, name: "Afrobeats Night", members: 4, last: "Who's coordinating outfits?", time: "2h" },
  { id: 3, name: "Sunday Walk Circle", members: 8, last: "Meet at Grand Army Plaza", time: "1d" },
];

type Plan = typeof MY_PLANS[0];

function TagBadge({ tag, status }: { tag: string; status: string }) {
  const isTonight = tag === "TONIGHT";
  const isPending = status === "pending";
  return (
    <span
      className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
      style={{
        background: isTonight
          ? "var(--bb-pink)"
          : isPending
          ? "rgba(0,0,0,0.07)"
          : "rgba(255,31,125,0.1)",
        color: isTonight ? "white" : isPending ? "#999" : "var(--bb-pink)",
      }}
    >
      {tag}
    </span>
  );
}

function TicketCard({
  plan,
  selected,
  onClick,
  cardBg,
  headingColor,
  textMuted,
  borderCol,
}: {
  plan: Plan;
  selected: boolean;
  onClick: () => void;
  cardBg: string;
  headingColor: string;
  textMuted: string;
  borderCol: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.99]"
      style={{
        background: cardBg,
        boxShadow: selected
          ? "0 4px 20px rgba(255,31,125,0.15)"
          : "0 2px 10px rgba(0,0,0,0.06)",
        border: selected ? "1.5px solid var(--bb-pink)" : `1.5px solid ${borderCol}`,
      }}
    >
      {/* Ticket top strip */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            plan.status === "confirmed"
              ? "linear-gradient(90deg, var(--bb-pink), #FF69B4)"
              : "linear-gradient(90deg, #ccc, #ddd)",
        }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-bold text-sm leading-snug" style={{ color: headingColor, fontFamily: "var(--font-playfair)" }}>
            {plan.title}
          </p>
          <TagBadge tag={plan.tag} status={plan.status} />
        </div>
        <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--bb-pink)" }}>{plan.date}</p>
        <p className="text-xs" style={{ color: textMuted }}>{plan.who}</p>
      </div>
    </button>
  );
}

function PlanRoomRow({
  room,
  cardBg,
  headingColor,
  textMuted,
  borderCol,
}: {
  room: typeof PLAN_ROOMS[0];
  cardBg: string;
  headingColor: string;
  textMuted: string;
  borderCol: string;
}) {
  return (
    <button
      className="w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
      style={{ background: cardBg, border: `1px solid ${borderCol}` }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
        style={{ background: "var(--bb-pink)" }}
      >
        {room.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <p className="font-bold text-xs truncate" style={{ color: headingColor }}>{room.name}</p>
          <p className="text-[10px] flex-shrink-0" style={{ color: textMuted }}>{room.time}</p>
        </div>
        <p className="text-[11px] truncate" style={{ color: textMuted }}>{room.last}</p>
        <p className="text-[9px] mt-0.5" style={{ color: textMuted }}>{room.members} women</p>
      </div>
    </button>
  );
}

export default function PlansPage() {
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(MY_PLANS[0]?.id ?? null);

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";
  const headingColor = isNight ? "rgba(255,245,248,0.92)" : "#111111";
  const textMuted = isNight ? "rgba(255,190,210,0.45)" : "#888";
  const cardBg = isNight ? (isEvening ? "#1A0D10" : "#150A0C") : "white";
  const borderCol = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const bgColor = isNight ? "var(--pale-pink-bg)" : "#F9F4F7";

  const selectedPlan = MY_PLANS.find((p) => p.id === selectedPlanId) ?? null;

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────────── */}
      <div className="md:hidden min-h-screen pb-24" style={{ background: bgColor }}>
        {/* Header */}
        <div className="px-5 pt-12 pb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5" style={{ color: "var(--bb-pink)" }}>✦ BLOOMBAY</p>
            <h1
              className="text-3xl font-bold italic"
              style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
            >
              Your Plans
            </h1>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ background: "var(--bb-pink)" }}
          >
            Plan Room +
          </button>
        </div>

        {MY_PLANS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <p style={{ fontSize: "40px" }}>🎫</p>
            <p className="font-black mt-3" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: headingColor }}>
              No upcoming plans yet.
            </p>
            <p className="text-sm italic mt-2" style={{ fontFamily: "var(--font-instrument)", color: textMuted }}>
              RSVP to an event or accept an invitation<br />and your ticket will appear here.
            </p>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-3">
            {MY_PLANS.map((plan) => (
              <TicketCard
                key={plan.id}
                plan={plan}
                selected={selectedPlanId === plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                cardBg={cardBg}
                headingColor={headingColor}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            ))}
          </div>
        )}

        {/* Plan Rooms */}
        <div className="px-5 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: headingColor }}>PLAN ROOMS</p>
            <div className="flex-1 h-px" style={{ background: borderCol }} />
          </div>
          <div className="flex flex-col gap-2">
            {PLAN_ROOMS.map((room) => (
              <PlanRoomRow
                key={room.id}
                room={room}
                cardBg={cardBg}
                headingColor={headingColor}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP 3-PANEL ────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:flex-col" style={{ height: "100vh", background: bgColor }}>

        {/* Top bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 border-b"
          style={{ height: "64px", borderColor: borderCol, background: cardBg }}
        >
          <p
            className="font-bold italic text-lg tracking-tight"
            style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
          >
            YOUR PLANS
          </p>
          <div style={{ marginRight: "256px" }}>
            <button
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: "var(--bb-pink)" }}
            >
              Plan Room +
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left panel — MY_PLANS ticket cards */}
          <div
            className="flex-shrink-0 flex flex-col gap-2.5 p-3 overflow-y-auto border-r"
            style={{ width: "260px", borderColor: borderCol, background: cardBg }}
          >
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 pt-1 pb-0.5" style={{ color: textMuted }}>
              UPCOMING · {MY_PLANS.length}
            </p>
            {MY_PLANS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <p style={{ fontSize: "28px" }}>🎫</p>
                <p className="text-xs mt-2" style={{ color: textMuted }}>No upcoming plans yet</p>
              </div>
            ) : (
              MY_PLANS.map((plan) => (
                <TicketCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlanId === plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  cardBg={isNight ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}
                  headingColor={headingColor}
                  textMuted={textMuted}
                  borderCol={borderCol}
                />
              ))
            )}
          </div>

          {/* Center panel — selected plan detail */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-8" style={{ background: bgColor }}>
            {selectedPlan ? (
              <div className="w-full max-w-md">
                {/* Ticket card large */}
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: cardBg,
                    boxShadow: "0 8px 40px rgba(255,31,125,0.12)",
                    border: `1.5px solid ${borderCol}`,
                  }}
                >
                  {/* Top strip */}
                  <div
                    className="h-2 w-full"
                    style={{
                      background:
                        selectedPlan.status === "confirmed"
                          ? "linear-gradient(90deg, var(--bb-pink), #FF69B4)"
                          : "linear-gradient(90deg, #ccc, #ddd)",
                    }}
                  />
                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <TagBadge tag={selectedPlan.tag} status={selectedPlan.status} />
                        <h2
                          className="text-2xl font-bold italic mt-3 leading-tight"
                          style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
                        >
                          {selectedPlan.title}
                        </h2>
                      </div>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,31,125,0.08)" }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mb-8">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest w-16 flex-shrink-0" style={{ color: textMuted }}>When</span>
                        <span className="text-sm font-bold" style={{ color: "var(--bb-pink)" }}>{selectedPlan.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest w-16 flex-shrink-0" style={{ color: textMuted }}>Who</span>
                        <span className="text-sm font-semibold" style={{ color: headingColor }}>{selectedPlan.who}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest w-16 flex-shrink-0" style={{ color: textMuted }}>Status</span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                          style={{
                            background: selectedPlan.status === "confirmed" ? "rgba(255,31,125,0.1)" : "rgba(0,0,0,0.05)",
                            color: selectedPlan.status === "confirmed" ? "var(--bb-pink)" : "#999",
                          }}
                        >
                          {selectedPlan.status}
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                      style={{ background: "var(--bb-pink)" }}
                    >
                      View Event →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p style={{ fontSize: "48px" }}>🎫</p>
                <p className="font-bold mt-4 text-lg" style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                  No plans yet
                </p>
                <p className="text-sm mt-2 italic" style={{ fontFamily: "var(--font-instrument)", color: textMuted }}>
                  RSVP to an event and your ticket will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Right panel — Plan Rooms */}
          <div
            className="flex-shrink-0 flex flex-col gap-3 p-4 overflow-y-auto border-l"
            style={{ width: "240px", borderColor: borderCol, background: cardBg }}
          >
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase pt-1" style={{ color: textMuted }}>PLAN ROOMS</p>
            {PLAN_ROOMS.map((room) => (
              <PlanRoomRow
                key={room.id}
                room={room}
                cardBg={isNight ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"}
                headingColor={headingColor}
                textMuted={textMuted}
                borderCol={borderCol}
              />
            ))}
            <button
              className="w-full py-3 rounded-xl text-xs font-bold mt-1 transition-all"
              style={{ border: `1.5px dashed ${borderCol}`, color: textMuted }}
            >
              + New Plan Room
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
