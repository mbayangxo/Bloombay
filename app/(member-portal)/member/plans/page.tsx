"use client";

interface PlanRoom {
  id: number;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  unread: number;
  members: number;
  date: string;
}

const PLAN_ROOMS: PlanRoom[] = [
  { id: 1, name: "Morocco October",    emoji: "🇲🇦", bg: "#1A0E0A", accent: "#FF69B4", unread: 7,  members: 14, date: "Oct 2026" },
  { id: 2, name: "Afrobeats Night",    emoji: "🎵",  bg: "#0F0818", accent: "#FF1F7D", unread: 3,  members: 8,  date: "Jun 14"  },
  { id: 3, name: "Sunday Walk Circle", emoji: "🌿",  bg: "#0A120F", accent: "#83C5A0", unread: 0,  members: 6,  date: "Jun 8"   },
];

function PlanRoomCard({ room }: { room: PlanRoom }) {
  return (
    <div
      className="flex-shrink-0 rounded-2xl overflow-hidden relative active:scale-[0.96] transition-transform cursor-pointer"
      style={{ width: "108px", background: room.bg, boxShadow: "0 4px 18px rgba(0,0,0,0.22)" }}
    >
      {/* Cover */}
      <div className="flex items-center justify-center relative" style={{ height: "88px" }}>
        <span style={{ fontSize: "34px" }}>{room.emoji}</span>
        {room.unread > 0 && (
          <div
            className="absolute top-2 right-2 min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1.5"
            style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.55)" }}
          >
            <span className="text-[10px] font-black text-white leading-none">{room.unread}</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="px-3 pb-3 pt-1.5">
        <p className="text-[11px] font-bold leading-tight text-white truncate">{room.name}</p>
        <p className="text-[9px] mt-0.5 font-medium" style={{ color: room.accent }}>
          {room.members} women · {room.date}
        </p>
      </div>
    </div>
  );
}

export default function PlansPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-6 md:px-10 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ YOUR PLANS</p>
        <h1
          className="font-black leading-none"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.02em" }}
        >
          Plans.
        </h1>
        <p className="text-sm italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
          Your tickets, invitations & plan rooms.
        </p>
      </div>

      {/* Plan Rooms — horizontal scroll */}
      <div className="mb-8">
        <div className="px-5 md:px-10 flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(0,0,0,0.35)" }}>
            PLAN ROOMS
          </p>
          <p className="text-[10px] font-semibold" style={{ color: "#FF1F7D" }}>
            {PLAN_ROOMS.length} rooms
          </p>
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ paddingLeft: "20px", paddingRight: "20px", scrollbarWidth: "none" }}
        >
          {PLAN_ROOMS.map(room => (
            <PlanRoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Tickets / empty state */}
      <div className="px-5 md:px-10 flex flex-col items-center justify-center" style={{ minHeight: "28vh" }}>
        <div className="text-center">
          <p style={{ fontSize: "40px" }}>🎫</p>
          <p className="font-black mt-3" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "#111" }}>
            No upcoming tickets yet.
          </p>
          <p className="text-sm italic mt-2" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>
            RSVP to an event and your ticket will appear here.
          </p>
        </div>
      </div>

    </div>
  );
}
