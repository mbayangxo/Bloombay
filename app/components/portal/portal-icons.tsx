"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Mock unread counts — replace with real data when API is ready
const UNREAD_MESSAGES = 3;
const UNREAD_MAILBOX  = 2;
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

    if (UNREAD_MESSAGES > 0 || UNREAD_MAILBOX > 0 || UNREAD_PINGS > 0) {
      const t = setTimeout(() => {
        setShaking(UNREAD_MESSAGES > 0 ? "messages" : "mailbox");
        setTimeout(() => {
          setShaking(UNREAD_MAILBOX > 0 ? "mailbox" : UNREAD_PINGS > 0 ? "ping" : null);
          setTimeout(() => {
            setShaking(UNREAD_PINGS > 0 ? "ping" : null);
            setTimeout(() => setShaking(null), 700);
          }, 800);
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
    <div className="flex items-center gap-2 md:gap-2.5">

      {/* Chat — direct messages */}
      <Link href="/member/messages" aria-label="Messages"
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

      {/* Mailbox — group chats & announcements */}
      <Link href="/member/mailbox" aria-label="Mailbox"
        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all active:scale-95 relative ${shaking === "mailbox" ? "bb-notify-shake" : ""} ${UNREAD_MAILBOX > 0 ? "bb-notify-glow" : ""}`}
        style={{ background: iconBg }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        {UNREAD_MAILBOX > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-white px-1"
            style={{ background: "#FF1F7D", boxShadow: "0 0 0 2px white" }}>
            {UNREAD_MAILBOX}
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

      {/* Calendar — live date, links to plans */}
      <Link href="/member/plans" aria-label="Plans"
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
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-base font-bold text-white"
          style={{ background: "#FF1F7D", boxShadow: "0 2px 10px rgba(255,31,125,0.38)" }}>
          {initial}
        </div>
      </Link>
    </div>
  );
}
