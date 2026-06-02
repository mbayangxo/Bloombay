"use client";

export default function PlansPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-6 md:px-10 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ YOUR PLANS</p>
        <h1 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          Plans.
        </h1>
        <p className="text-sm italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
          Your tickets, invitations & plan rooms.
        </p>
      </div>

      <div className="px-5 md:px-10 flex flex-col items-center justify-center" style={{ minHeight: "40vh" }}>
        <div className="text-center">
          <p style={{ fontSize: "40px" }}>🎫</p>
          <p className="font-black mt-3" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "#111" }}>
            No upcoming plans yet.
          </p>
          <p className="text-sm italic mt-2" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>
            RSVP to an event or accept a confetti invitation<br />and your ticket will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
