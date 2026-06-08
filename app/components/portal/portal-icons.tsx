"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";
import { PinIcon } from "./pin-icon";

export function PortalIcons({ initial = "M" }: { initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";
  const iconBg = isNight
    ? (isEvening ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.07)")
    : "rgba(255,31,125,0.09)";
  const stroke = "#FF1F7D";
  const sz = 11; // icon stroke size

  return (
    <div className="flex items-center gap-2">

      {/* Mail — inbox / messages */}
      <Link href="/member/messages" aria-label="Messages"
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: iconBg }}>
        <svg width={sz+2} height={sz+2} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </Link>

      {/* Chat — direct conversations */}
      <Link href="/member/messages" aria-label="Chat"
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: iconBg }}>
        <svg width={sz+2} height={sz+2} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </Link>

      {/* Pin drops */}
      <Link href="/member/pin-drops" aria-label="Pin drops"
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: iconBg }}>
        <PinIcon size={sz + 2} stroke={stroke} />
      </Link>

      {/* Plans — tickets, plan rooms, calendar */}
      <Link href="/member/plans" aria-label="Plans"
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: iconBg }}>
        <svg width={sz+2} height={sz+2} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </Link>

      {/* Avatar */}
      <Link href="/member/lounge" aria-label="Apartment">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "#FF1F7D", boxShadow: "0 2px 10px rgba(255,31,125,0.38)" }}>
          {initial}
        </div>
      </Link>
    </div>
  );
}
