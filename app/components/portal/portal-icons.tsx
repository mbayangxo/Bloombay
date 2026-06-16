"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";
import { usePathname } from "next/navigation";

const PENDING_INVITATIONS = 3;

export function PortalIcons({ initial = "M" }: { initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const pathname = usePathname();
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  useEffect(() => {
    setVisited(prev => {
      const next = new Set(prev);
      if (pathname.startsWith("/member/messages"))      next.add("messages");
      if (pathname.startsWith("/member/notifications"))  next.add("notifications");
      if (pathname.startsWith("/member/plans"))          next.add("plans");
      return next;
    });
  }, [pathname]);

  const isNight   = tod === "evening" || tod === "night";

  function iconStyle(href: string): React.CSSProperties {
    const active = pathname.startsWith(href);
    if (active) {
      return {
        background: "rgba(255,31,125,0.14)",
        border: "1.5px solid rgba(255,31,125,0.55)",
        boxShadow: "0 0 0 3px rgba(255,31,125,0.08), 0 2px 10px rgba(255,31,125,0.2)",
      };
    }
    return {
      background: isNight ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)",
      border: "1.5px solid rgba(255,31,125,0.18)",
      boxShadow: "0 1px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
    };
  }

  function strokeColor(href: string): string {
    return pathname.startsWith(href) ? "#FF1F7D" : "#FF69B4";
  }

  const sz = 15;

  return (
    <>
      <div className="hidden md:flex items-center gap-1.5">

        {/* Mail */}
        <Link href="/member/messages" aria-label="Mailbox"
          className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all active:scale-95"
          style={{
            ...iconStyle("/member/messages"),
            animation: !pathname.startsWith("/member/messages") ? "mailboxShake 6s ease-in-out 2s infinite" : undefined,
          }}>
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={strokeColor("/member/messages")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {!pathname.startsWith("/member/messages") && !visited.has("messages") && (
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
              style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px white", lineHeight: 1 }}>
              {PENDING_INVITATIONS}
            </div>
          )}
        </Link>

        {/* Chat */}
        <Link href="/member/chat" aria-label="Chat"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={iconStyle("/member/chat")}>
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={strokeColor("/member/chat")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </Link>

        {/* Pings */}
        <Link href="/member/notifications" aria-label="Pings"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 relative"
          style={{
            ...iconStyle("/member/notifications"),
            animation: !pathname.startsWith("/member/notifications") ? "bellShake 5s ease-in-out 3s infinite" : undefined,
          }}>
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={strokeColor("/member/notifications")} strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {!pathname.startsWith("/member/notifications") && !visited.has("notifications") && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px white" }}/>
          )}
        </Link>

        {/* Calendar */}
        <Link href="/member/calendar" aria-label="Calendar"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={iconStyle("/member/calendar")}>
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={strokeColor("/member/calendar")} strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </Link>

        {/* Plans — glows + pulses when not active */}
        <Link href="/member/plans" aria-label="Plans"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 relative"
          style={{
            ...iconStyle("/member/plans"),
            animation: (!pathname.startsWith("/member/plans") && !visited.has("plans")) ? "plansPulse 2.8s ease-in-out 0.5s infinite" : undefined,
          }}>
          {!pathname.startsWith("/member/plans") && !visited.has("plans") && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px white" }} />
          )}
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={strokeColor("/member/plans")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
        </Link>

        {/* Avatar */}
        <Link href="/member/lounge" aria-label="Apartment">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", boxShadow: "0 2px 10px rgba(255,31,125,0.45), 0 0 0 2px rgba(255,31,125,0.2)" }}>
            {initial}
          </div>
        </Link>
      </div>

      <style>{`
        @keyframes mailboxShake {
          0%, 80%, 100% { transform: rotate(0deg); }
          83% { transform: rotate(-8deg); }
          86% { transform: rotate(7deg); }
          89% { transform: rotate(-5deg); }
          92% { transform: rotate(4deg); }
          95% { transform: rotate(-2deg); }
          98% { transform: rotate(0deg); }
        }
        @keyframes bellShake {
          0%, 70%, 100% { transform: rotate(0deg); }
          73% { transform: rotate(-18deg); }
          77% { transform: rotate(15deg); }
          81% { transform: rotate(-12deg); }
          85% { transform: rotate(9deg); }
          89% { transform: rotate(-5deg); }
          93% { transform: rotate(3deg); }
          97% { transform: rotate(0deg); }
        }
        @keyframes plansPulse {
          0%, 100% { box-shadow: 0 1px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(255,31,125,0.22), 0 0 18px rgba(255,31,125,0.4), inset 0 1px 0 rgba(255,255,255,0.4); }
        }
      `}</style>
    </>
  );
}
