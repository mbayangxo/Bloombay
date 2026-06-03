"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";

export function PortalIcons({ initial = "M" }: { initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState("JAN");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
    const now = new Date();
    setDay(now.getDate());
    setMonth(now.toLocaleDateString("en-US", { month: "short" }).toUpperCase());
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const iconBg = isNight
    ? "rgba(255,255,255,0.08)"
    : "rgba(255,31,125,0.08)";
  const stroke = "#FF1F7D";

  return (
    <div className="flex items-center gap-2 md:gap-2.5">

      {/* Chat — direct group conversations */}
      <Link href="/member/messages" aria-label="Chat"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: iconBg }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </Link>

      {/* Ping / bell */}
      <Link href="/member/notifications" aria-label="Ping"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all active:scale-95 relative"
        style={{ background: iconBg }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2.5 h-2.5 rounded-full border-2"
          style={{ background: "#FF1F7D", borderColor: "transparent" }}/>
      </Link>

      {/* Planner */}
      <Link href="/member/plans" aria-label="Planner"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: iconBg }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </Link>

      {/* Calendar — dynamic date */}
      <Link href="/member/plans" aria-label="Calendar"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 gap-0"
        style={{ background: iconBg }}>
        <span className="text-[7px] md:text-[8px] font-bold tracking-widest leading-none" style={{ color: stroke }}>{month}</span>
        <span className="text-sm md:text-base font-black leading-tight" style={{ color: stroke, fontFamily: "var(--font-playfair)" }}>{day}</span>
      </Link>

      {/* Avatar */}
      <Link href="/member/lounge" aria-label="Apartment">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-bold text-white"
          style={{ background: "#FF1F7D", boxShadow: "0 2px 10px rgba(255,31,125,0.38)" }}>
          {initial}
        </div>
      </Link>
    </div>
  );
}
