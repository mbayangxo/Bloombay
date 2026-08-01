"use client";

import { useEffect, useState } from "react";

function splitRemaining(targetIso: string): { days: number; hours: number; mins: number; secs: number; done: boolean } {
  const diffMs = new Date(targetIso).getTime() - Date.now();
  if (diffMs <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
  const totalSecs = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    mins: Math.floor((totalSecs % 3600) / 60),
    secs: totalSecs % 60,
    done: false,
  };
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 rounded-xl py-2 text-center" style={{ background: "rgba(255,31,125,0.06)" }}>
      <p className="text-lg font-bold tabular-nums" style={{ color: "#FF1F7D", fontFamily: "var(--font-jost)" }}>
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "#999" }}>{label}</p>
    </div>
  );
}

/** Real countdown to the gathering's rsvp_deadline (or its start time if no
 *  deadline is set) — client-only so SSR/CSR never mismatch on the clock. */
export function RsvpCountdown({ targetIso }: { targetIso: string }) {
  const [remaining, setRemaining] = useState<ReturnType<typeof splitRemaining> | null>(null);

  useEffect(() => {
    setRemaining(splitRemaining(targetIso));
    const id = setInterval(() => setRemaining(splitRemaining(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!remaining || remaining.done) return null;

  return (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#bbb" }}>
        RESERVE YOUR SEAT
      </p>
      <p className="text-[10px] mb-1.5" style={{ color: "#FF1F7D", fontWeight: 700 }}>ENDS IN</p>
      <div className="flex gap-1.5">
        <Box value={remaining.days} label="DAYS" />
        <Box value={remaining.hours} label="HRS" />
        <Box value={remaining.mins} label="MINS" />
        <Box value={remaining.secs} label="SECS" />
      </div>
    </div>
  );
}
