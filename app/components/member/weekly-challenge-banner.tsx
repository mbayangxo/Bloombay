"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getChallengeProgress, getWeeklyChallenge } from "@/lib/weekly-challenge";

export function WeeklyChallengeBanner() {
  const challenge = getWeeklyChallenge();
  const [progress, setProgress] = useState({ done: 0, target: 1, complete: false });

  useEffect(() => {
    function refresh() {
      setProgress(getChallengeProgress());
    }
    refresh();
    window.addEventListener("bb-calendar-updated", refresh);
    window.addEventListener("bb-events-updated", refresh);
    return () => {
      window.removeEventListener("bb-calendar-updated", refresh);
      window.removeEventListener("bb-events-updated", refresh);
    };
  }, []);

  return (
    <aside className={`mp-challenge${progress.complete ? " mp-challenge--done" : ""}`}>
      <p className="mp-challenge__kicker">{challenge.weekLabel} · Girl Challenge</p>
      <h3 className="mp-challenge__title">{challenge.title}</h3>
      <p className="mp-challenge__desc">{challenge.description}</p>
      {progress.complete ? (
        <p className="mp-challenge__done">You showed up — badge on your Wall this week ✓</p>
      ) : (
        <Link href={challenge.href} className="mp-btn mp-btn--hot mp-btn--sm">
          {challenge.cta}
        </Link>
      )}
    </aside>
  );
}
