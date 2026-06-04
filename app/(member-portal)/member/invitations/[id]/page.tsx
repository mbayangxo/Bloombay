"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Shared invitation data ─────────────────────────────────────────────────────

export const INVITATION_DATA: Record<string, {
  id: string;
  tag: string;
  tagColor: string;
  event: string;
  from: string;
  fromFull: string;
  fromInitial: string;
  fromColor: string;
  venue: string;
  time: string;
  seatsRemaining: number;
  price: string;
  type: string;
  note: string;
  guests: { name: string; initial: string; color: string }[];
  sentAt: string;
}> = {
  "1": {
    id: "1",
    tag: "TONIGHT",
    tagColor: "#FF1F7D",
    event: "Girls Dinner · Carbone",
    from: "Aminah",
    fromFull: "Aminah M.",
    fromInitial: "Am",
    fromColor: "#FF69B4",
    venue: "Carbone · 181 Thompson St, SoHo",
    time: "Tonight · 7:30 PM",
    seatsRemaining: 2,
    price: "Individual pay",
    type: "dinner",
    note: "I saved you a seat. I hope you can make it — it's going to be one of those nights.",
    guests: [
      { name: "Aminah", initial: "Am", color: "#FF69B4" },
      { name: "Sofia", initial: "S", color: "#FF1F7D" },
      { name: "Kezia", initial: "K", color: "#C084FC" },
    ],
    sentAt: "2 hours ago",
  },
  "2": {
    id: "2",
    tag: "SUNDAY",
    tagColor: "#83C5A0",
    event: "Pilates + Matcha Morning",
    from: "Sofia",
    fromFull: "Sofia K.",
    fromInitial: "S",
    fromColor: "#FF1F7D",
    venue: "Studio Bloom · Williamsburg",
    time: "Sunday · 9:00 AM",
    seatsRemaining: 3,
    price: "$20",
    type: "wellness",
    note: "Come move with us. You'll start Sunday right — I promise.",
    guests: [
      { name: "Sofia", initial: "S", color: "#FF1F7D" },
      { name: "Maya", initial: "Ma", color: "#FF69B4" },
      { name: "Jade", initial: "J", color: "#FF1F7D" },
    ],
    sentAt: "Yesterday",
  },
  "3": {
    id: "3",
    tag: "SATURDAY",
    tagColor: "#EC4899",
    event: "MoMA + Froyo After",
    from: "Girl Creatives",
    fromFull: "Girl Creatives Club",
    fromInitial: "GC",
    fromColor: "#EC4899",
    venue: "MoMA · 11 W 53rd St, Midtown",
    time: "Saturday · 2:00 PM",
    seatsRemaining: 5,
    price: "$1 deposit hold",
    type: "culture",
    note: "We're going as a group. Art, conversation, froyo after. You'd fit right in.",
    guests: [
      { name: "Yemi", initial: "Y", color: "#EC4899" },
      { name: "Amara", initial: "A", color: "#FF69B4" },
      { name: "Nadia", initial: "N", color: "#FF1F7D" },
    ],
    sentAt: "3 days ago",
  },
};

// ── Invitation Detail Page ─────────────────────────────────────────────────────

export default function InvitationDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "1";
  const invite = INVITATION_DATA[id] ?? INVITATION_DATA["1"];

  const [rsvp, setRsvp] = useState<"accepted" | "declined" | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0508" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 20%, ${invite.fromColor}18 0%, transparent 65%)` }} />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-5 pt-14 pb-5 md:pt-10">
        <Link href="/member/messages?filter=invitations"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(255,31,125,0.65)" }}>
          ✦ INVITATION
        </p>
        <div className="w-10" />
      </div>

      {/* Ticket card */}
      <div className="flex-1 flex flex-col items-center px-5 pb-28">
        <div className="w-full max-w-sm">

          {/* Glow behind card */}
          <div className="absolute w-72 h-72 rounded-full pointer-events-none" style={{ background: `${invite.fromColor}14`, filter: "blur(40px)", transform: "translateX(-50%) translateY(-20%)", left: "50%" }} />

          {/* The ticket */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1A0A12 0%, #120508 60%, #0D030A 100%)",
              border: `1px solid ${invite.fromColor}25`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${invite.fromColor}10`,
            }}>

            {/* Color line */}
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${invite.fromColor}50, transparent)` }} />

            {/* Ticket header */}
            <div className="px-7 pt-6 pb-4">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: `${invite.fromColor}66` }}>BLOOMBAY</p>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${invite.tagColor}22`, color: invite.tagColor, border: `1px solid ${invite.tagColor}40` }}>
                  {invite.tag}
                </span>
              </div>

              {/* Event name — big */}
              <h2 className="leading-none mb-1"
                style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(24px,7vw,32px)", color: "rgba(255,238,220,0.95)" }}>
                {invite.event}
              </h2>
              <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                {invite.venue}
              </p>
            </div>

            {/* Perforation */}
            <div className="mx-7 flex items-center gap-1.5">
              <div className="flex-1 border-t border-dashed" style={{ borderColor: `${invite.fromColor}18` }} />
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: "#0A0508", border: `1px solid ${invite.fromColor}20` }} />
              <div className="flex-1 border-t border-dashed" style={{ borderColor: `${invite.fromColor}18` }} />
            </div>

            {/* Ticket details */}
            <div className="px-7 py-5">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.22)" }}>TIME</p>
                  <p className="text-sm font-bold" style={{ color: "rgba(255,238,220,0.9)" }}>{invite.time}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.22)" }}>PRICE</p>
                  <p className="text-sm font-bold" style={{ color: "rgba(255,238,220,0.9)" }}>{invite.price}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.22)" }}>SEATS LEFT</p>
                  <p className="text-sm font-bold" style={{ color: invite.fromColor }}>{invite.seatsRemaining} remaining</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.22)" }}>TYPE</p>
                  <p className="text-sm font-bold capitalize" style={{ color: "rgba(255,238,220,0.9)" }}>{invite.type}</p>
                </div>
              </div>

              {/* Who's going */}
              <div className="mb-5">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.22)" }}>WHO&apos;S GOING</p>
                <div className="flex items-center gap-2">
                  {invite.guests.map(g => (
                    <div key={g.name} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}BB)`, boxShadow: `0 2px 8px ${g.color}44` }}>
                        {g.initial}
                      </div>
                      <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{g.name}</p>
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.06)", border: `1px dashed ${invite.fromColor}44` }}>
                      <span style={{ color: invite.fromColor, fontSize: "14px" }}>+</span>
                    </div>
                    <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>You?</p>
                  </div>
                </div>
              </div>

              {/* Note from sender */}
              <div className="rounded-2xl px-4 py-4 mb-2"
                style={{ background: `${invite.fromColor}0D`, border: `1px solid ${invite.fromColor}22` }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${invite.fromColor}, ${invite.fromColor}BB)` }}>
                    {invite.fromInitial}
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "rgba(255,238,220,0.9)" }}>{invite.fromFull}</p>
                    <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.28)" }}>{invite.sentAt}</p>
                  </div>
                </div>
                <p className="text-[11px] italic leading-relaxed"
                  style={{ fontFamily: "var(--font-instrument)", color: "rgba(255,255,255,0.6)" }}>
                  &ldquo;{invite.note}&rdquo;
                </p>
              </div>
            </div>

            {/* Second perforation */}
            <div className="mx-7 flex items-center gap-1.5">
              <div className="flex-1 border-t border-dashed" style={{ borderColor: `${invite.fromColor}18` }} />
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: "#0A0508", border: `1px solid ${invite.fromColor}20` }} />
              <div className="flex-1 border-t border-dashed" style={{ borderColor: `${invite.fromColor}18` }} />
            </div>

            {/* RSVP footer */}
            <div className="px-7 py-5">
              {rsvp === null ? (
                <>
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-center mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>
                    YOUR RSVP
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setRsvp("accepted")}
                      className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.97]"
                      style={{ background: invite.fromColor, color: "white", boxShadow: `0 4px 16px ${invite.fromColor}44` }}>
                      I&apos;m in ✓
                    </button>
                    <button onClick={() => setRsvp("declined")}
                      className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Can&apos;t make it
                    </button>
                  </div>
                </>
              ) : rsvp === "accepted" ? (
                <div className="text-center py-2">
                  <p className="text-2xl mb-2">🎟</p>
                  <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.9)", fontSize: "18px" }}>
                    You&apos;re going.
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                    Saved to your calendar · {invite.time}
                  </p>
                  <Link href="/member/calendar"
                    className="inline-block mt-3 px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                    style={{ background: `${invite.fromColor}22`, color: invite.fromColor, border: `1px solid ${invite.fromColor}44` }}>
                    View in Calendar →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs italic" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)" }}>
                    {invite.fromFull.split(" ")[0]} will understand. Next time.
                  </p>
                </div>
              )}
            </div>

            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${invite.fromColor}20, transparent)` }} />
            <div className="px-7 py-4 flex items-center justify-between">
              <p className="text-[9px] tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.12)" }}>BLOOMBAY INVITATION</p>
              <span style={{ color: `${invite.fromColor}30`, fontSize: "16px" }}>✦</span>
            </div>
          </div>

          {/* View full event */}
          <Link href={`/member/happenings/${invite.id}`}
            className="flex items-center justify-center gap-2 mt-4 py-3 rounded-2xl text-xs font-semibold transition-all active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
            View full event details →
          </Link>
        </div>
      </div>
    </div>
  );
}
