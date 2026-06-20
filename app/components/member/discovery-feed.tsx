"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MoodFilterBar } from "./mood-filter-bar";
import { rankSuggestions, discoveryHeadline, type DiscoveryPick } from "@/lib/discovery-rank";
import { readYandeMemberState } from "@/lib/yande-member-state";
import { getDiscoveryMood } from "@/lib/discovery-mood-store";
import type { DiscoveryMoodId } from "@/lib/discovery-mood";
import {
  addToGirlCalendar,
  connectShareHref,
  isOnCalendar,
} from "@/lib/member-calendar-store";
import type { MemberHappeningEvent } from "@/lib/bloombay-events-member";
import {
  BloomInvitation,
  BloomRequestNote,
  BloomTicket,
  ClubPoster,
  EventPoster,
} from "@/app/components/bloom-artifacts";
import { artifactKindFromContent, splitTitleHighlight } from "@/lib/bloom-artifact-types";

function calendarKind(
  kind: DiscoveryPick["kind"]
): "happening" | "seat" | "partner" | "gem" | "solo" {
  if (kind === "connect" || kind === "club") return "happening";
  return kind;
}

function DiscoveryArtifact({ pick, saved }: { pick: DiscoveryPick; saved: boolean }) {
  const kind = artifactKindFromContent({ kind: pick.kind, title: pick.title, tags: [pick.tag] });
  const { lead, highlight } = splitTitleHighlight(pick.title);

  if (kind === "club") {
    return (
      <ClubPoster
        name={pick.title}
        category={pick.tag}
        tagline={pick.meta}
        meta={pick.when}
        href={pick.href}
        coverStyle={{ background: "linear-gradient(160deg, var(--bb-barbie-soft), var(--bb-hot))" }}
      />
    );
  }

  if (kind === "ticket" || (pick.kind === "seat" && saved)) {
    return (
      <BloomTicket
        size="compact"
        title={pick.title}
        titleHighlight={highlight}
        meta={[
          { label: "When", value: pick.when },
          { label: "Where", value: pick.neighborhood || pick.meta },
          { label: "Status", value: saved ? "Reserved" : "Open" },
        ]}
        code={`BB-${pick.sourceId.slice(0, 8).toUpperCase()}`}
      />
    );
  }

  if (kind === "invitation" || pick.kind === "connect") {
    if (pick.kind === "connect") {
      return (
        <BloomRequestNote
          size="compact"
          overline={pick.tag}
          headline={lead}
          headlineAccent={highlight || "nearby"}
          tagline={pick.meta}
          body="Yande matched you — bloom or save to calendar."
          href={pick.href}
        />
      );
    }
    return (
      <BloomInvitation
        size="compact"
        eventName={pick.title}
        meta={`${pick.when} · ${pick.meta}`}
        when={pick.when}
        href={pick.href}
      />
    );
  }

  return (
    <EventPoster
      size="compact"
      eyebrow={pick.tag}
      title={lead}
      titleHighlight={highlight}
      meta={`${pick.when} · ${pick.neighborhood || pick.meta}`}
      tags={[pick.kind]}
      href={pick.href}
      coverStyle={{ background: "linear-gradient(135deg, #ff0055 0%, #1a0514 100%)" }}
    />
  );
}

export function DiscoveryFeed({ live = [] }: { live?: MemberHappeningEvent[] }) {
  const [picks, setPicks] = useState<DiscoveryPick[]>([]);
  const [mood, setMood] = useState<DiscoveryMoodId | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const refresh = useCallback(() => {
    const ctx = readYandeMemberState();
    const m = getDiscoveryMood();
    setMood(m);
    const ranked = rankSuggestions(
      { city: ctx.city, neighborhood: ctx.neighborhood },
      m,
      live,
      8
    );
    setPicks(ranked);
    const map: Record<string, boolean> = {};
    for (const p of ranked) map[p.sourceId] = isOnCalendar(p.sourceId);
    setSaved(map);
  }, [live]);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-discovery-updated", refresh);
    window.addEventListener("bb-calendar-updated", refresh);
    return () => {
      window.removeEventListener("bb-discovery-updated", refresh);
      window.removeEventListener("bb-calendar-updated", refresh);
    };
  }, [refresh]);

  async function savePick(p: DiscoveryPick) {
    try {
      await addToGirlCalendar({
        sourceId: p.sourceId,
        title: p.title,
        when: p.when,
        place: p.neighborhood || p.meta,
        href: p.href,
        kind: calendarKind(p.kind),
        remind: true,
      });
      setSaved((s) => ({ ...s, [p.sourceId]: true }));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not save to calendar");
    }
  }

  const headline = discoveryHeadline(mood, picks[0] ?? null);

  return (
    <section className="mp-discovery" aria-label="Personalized picks">
      <MoodFilterBar onChange={() => refresh()} />
      <div className="mp-discovery__head">
        <h2 className="mp-discovery__title">{headline}</h2>
        <Link href="/member/calendar" className="mp-btn mp-btn--outline mp-btn--sm mp-discovery__cal">
          Girl Calendar →
        </Link>
      </div>
      <ul className="bb-discovery-artifacts bb-artifact-board">
        {picks.map((p) => (
          <li key={p.id}>
            <DiscoveryArtifact pick={p} saved={!!saved[p.sourceId]} />
            <div className="mp-discovery-card__actions" style={{ marginTop: "0.65rem" }}>
              <button
                type="button"
                className="mp-btn mp-btn--sm mp-btn--outline"
                disabled={saved[p.sourceId]}
                onClick={() => savePick(p)}
              >
                {saved[p.sourceId] ? "On calendar ✓" : "Add to calendar"}
              </button>
              <Link
                href={connectShareHref(p.title, p.when, p.href)}
                className="mp-btn mp-btn--sm mp-btn--ink"
              >
                Share
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
