"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Mock unread counts — replace with real data when API is ready
const UNREAD_MESSAGES = 3;
const UNREAD_PINGS    = 7;

export function PortalIcons({ initial = "M" }: { initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setTod(getTimeOfDay(now.getHours()));
    setDay(now.getDate());
    setMonth(MONTHS[now.getMonth()]);

    // Trigger shake animation on mount if there are notifications
    if (UNREAD_MESSAGES > 0 || UNREAD_PINGS > 0) {
      const t = setTimeout(() => {
        setShaking(UNREAD_MESSAGES > 0 ? "messages" : "ping");
        setTimeout(() => {
          setShaking(UNREAD_PINGS > 0 ? "ping" : null);
          setTimeout(() => setShaking(null), 700);
        }, 800);
      }, 600);
      return () => clearTimeout(t);
    }
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const iconBg = isNight
    ? "rgba(255,255,255,0.08)"
    : "rgba(255,31,125,0.08)";
  const stroke = "#FF1F7D";

  return (
    <div className="flex items-center gap-2.5 md:gap-3">

      {/* Chat */}
      <Link href="/member/messages" aria-label="Chat"
        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all active:scale-95 relative ${shaking === "messages" ? "bb-notify-shake" : ""} ${UNREAD_MESSAGES > 0 ? "bb-notify-glow" : ""}`}
        style={{ background: iconBg }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        {UNREAD_MESSAGES > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-white px-1"
            style={{ background: "#FF1F7D", boxShadow: "0 0 0 2px white" }}>
            {UNREAD_MESSAGES}
          </span>
        )}
      </Link>

      {/* Ping / bell */}
      <Link href="/member/notifications" aria-label="Ping"
        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all active:scale-95 relative ${shaking === "ping" ? "bb-notify-shake" : ""} ${UNREAD_PINGS > 0 ? "bb-notify-glow" : ""}`}
        style={{ background: iconBg }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {UNREAD_PINGS > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-white px-1"
            style={{ background: "#FF1F7D", boxShadow: "0 0 0 2px white" }}>
            {UNREAD_PINGS}
          </span>
        )}
      </Link>

      {/* Planner */}
      <Link href="/member/plans" aria-label="Planner"
        className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: iconBg }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </Link>

      {/* Calendar — live date */}
      <Link href="/member/plans" aria-label="Calendar"
        className="w-10 h-10 md:w-11 md:h-11 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 gap-0"
        style={{ background: iconBg }}>
        <span className="text-[8px] md:text-[9px] font-bold tracking-widest leading-none" style={{ color: stroke }}>
          {month ?? "···"}
        </span>
        <span className="text-base md:text-lg font-black leading-tight" style={{ color: stroke, fontFamily: "var(--font-playfair)" }}>
          {day ?? "·"}
        </span>
      </Link>

      {/* Avatar */}
      <Link href="/member/lounge" aria-label="Apartment">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-base md:text-lg font-bold text-white"
          style={{ background: "#FF1F7D", boxShadow: "0 2px 10px rgba(255,31,125,0.38)" }}>
          {initial}
        </div>
      </Link>
    </div>
  );
}
