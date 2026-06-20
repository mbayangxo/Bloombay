"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getYandeNudge } from "@/lib/yande-recommendations";
import { readYandeMemberState } from "@/lib/yande-member-state";
import { isNewInTown } from "@/lib/new-in-town";

/** Yande stays quiet — one line like a friend texting, not a dashboard widget. */
export function YandeConciergeStrip({ variant = "strip" }: { variant?: "strip" | "text" }) {
  const [line, setLine] = useState<string | null>(null);
  const [href, setHref] = useState("/member/happenings");

  useEffect(() => {
    function refresh() {
      const state = readYandeMemberState();
      const nudge = getYandeNudge(state);
      if (isNewInTown()) {
        setLine("I saved you a welcome seat. Walk in when you're ready.");
        setHref("/member/happenings/seats");
      } else if (state.clubsJoinedCount === 0) {
        setLine("You haven't chosen a club yet. I saved three that match your energy.");
        setHref("/member/clubs/discover");
      } else {
        setLine(nudge.message.slice(0, 140) + (nudge.message.length > 140 ? "…" : ""));
        setHref(nudge.href);
      }
    }
    refresh();
    window.addEventListener("bb-discovery-updated", refresh);
    window.addEventListener("bb-calendar-updated", refresh);
    return () => {
      window.removeEventListener("bb-discovery-updated", refresh);
      window.removeEventListener("bb-calendar-updated", refresh);
    };
  }, []);

  if (!line) return null;

  if (variant === "text") {
    return (
      <aside className="bb-yande-text" aria-label="Yande">
        <p className="bb-yande-text__from">Yande · now</p>
        <p className="bb-yande-text__body">&ldquo;{line}&rdquo;</p>
        <Link href={href} className="bb-yande-text__link">
          Reply →
        </Link>
      </aside>
    );
  }

  return (
    <aside className="mp-yande-strip" aria-label="Yande concierge">
      <span className="mp-yande-strip__mark" aria-hidden>
        ✦
      </span>
      <p className="mp-yande-strip__text">{line}</p>
      <Link href={href} className="mp-yande-strip__link">
        Go →
      </Link>
    </aside>
  );
}
