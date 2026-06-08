"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CityAtmosphere } from "@/lib/city-atmosphere";
import {
  listCalendarEntries,
  syncCalendarFromServer,
  type CalendarEntry,
} from "@/lib/member-calendar-store";
import { getYandeNudge } from "@/lib/yande-recommendations";
import { readYandeMemberState } from "@/lib/yande-member-state";
import type { HomeGlanceMedia } from "@/lib/media/types";
import { getHomePolaroidPhoto } from "@/lib/home-scrapbook-store";
import { SCRAPBOOK } from "@/lib/scrapbook-assets";
import { HomePolaroidPhoto } from "./home-polaroid-photo";
import { ScrapbookLayer } from "./scrapbook-layer";

function weekDays(now = new Date()) {
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function daysWithEvents(entries: CalendarEntry[], days: Date[]) {
  const marked = new Set<string>();
  if (entries.length === 0) return marked;
  marked.add(new Date().toDateString());
  entries.forEach((_, i) => {
    const slot = days[Math.min(i + 2, days.length - 1)];
    if (slot) marked.add(slot.toDateString());
  });
  return marked;
}

function greetingCaps(greeting: string) {
  return greeting.replace(/\.$/, "").toUpperCase() + ",";
}

export function HomeScrapbookCanvas({
  greeting,
  name,
  atmosphere,
  userId,
}: {
  greeting: string;
  name: string;
  atmosphere: CityAtmosphere;
  userId?: string | null;
}) {
  const displayName = name.trim() || "there";
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [yandeLine, setYandeLine] = useState<string | null>(null);
  const [yandeHref, setYandeHref] = useState("/member/happenings");
  const [polaroidDefault, setPolaroidDefault] = useState<string | null>(null);
  const [happeningCount, setHappeningCount] = useState(0);

  const days = useMemo(() => weekDays(), []);
  const eventDays = useMemo(() => daysWithEvents(entries, days), [entries, days]);
  const inviteCount = entries.length;

  useEffect(() => {
    async function loadCalendar() {
      const rows = await syncCalendarFromServer();
      setEntries(rows.length ? rows : listCalendarEntries());
    }
    void loadCalendar();
    const onCal = () => setEntries(listCalendarEntries());
    window.addEventListener("bb-calendar-updated", onCal);
    return () => window.removeEventListener("bb-calendar-updated", onCal);
  }, []);

  useEffect(() => {
    function refreshYande() {
      const state = readYandeMemberState();
      const nudge = getYandeNudge(state);
      if (happeningCount === 0 && state.clubsJoinedCount === 0) {
        setYandeLine("Your board is yours — add a photo, save a seat, or explore clubs when you're ready.");
        setYandeHref("/member/clubs");
      } else if (entries.length > 0) {
        setYandeLine(`You have ${entries.length} thing${entries.length === 1 ? "" : "s"} on your calendar this week.`);
        setYandeHref("/member/plans?tab=calendar");
      } else {
        setYandeLine(nudge.message.slice(0, 100) + (nudge.message.length > 100 ? "…" : ""));
        setYandeHref(nudge.href);
      }
    }
    refreshYande();
    window.addEventListener("bb-discovery-updated", refreshYande);
    window.addEventListener("bb-calendar-updated", refreshYande);
    return () => {
      window.removeEventListener("bb-discovery-updated", refreshYande);
      window.removeEventListener("bb-calendar-updated", refreshYande);
    };
  }, [entries.length, happeningCount]);

  useEffect(() => {
    void fetch("/api/member/gatherings")
      .then((r) => (r.ok ? r.json() : { gatherings: [] }))
      .then((j) => setHappeningCount((j.gatherings ?? []).length))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    void (async () => {
      if (getHomePolaroidPhoto()) return;
      const res = await fetch("/api/home/glance");
      if (!res.ok) return;
      const data = (await res.json()) as HomeGlanceMedia;
      const url =
        data.avatarUrl ??
        data.profilePhotos[0]?.image_url ??
        data.memories[0]?.image_url ??
        null;
      if (url) setPolaroidDefault(url);
    })();
  }, []);

  return (
    <section className="bb-home-canvas" aria-label="Your BloomBay board">
      {/* Masking tape accents */}
      <ScrapbookLayer
        src={SCRAPBOOK.tapeCream1}
        className="bb-home-layer--tape bb-home-layer--tape-a"
        rotate="12deg"
        zIndex={8}
      />
      <ScrapbookLayer
        src={SCRAPBOOK.tapeGrid1}
        className="bb-home-layer--tape bb-home-layer--tape-b"
        rotate="-14deg"
        zIndex={8}
      />
      <ScrapbookLayer
        src={SCRAPBOOK.tapePink}
        className="bb-home-layer--tape bb-home-layer--tape-c"
        rotate="6deg"
        zIndex={7}
      />
      <ScrapbookLayer
        src={SCRAPBOOK.tapeCream2}
        className="bb-home-layer--tape bb-home-layer--tape-d"
        rotate="-8deg"
        zIndex={8}
      />
      <ScrapbookLayer
        src={SCRAPBOOK.tapeGrid2}
        className="bb-home-layer--tape bb-home-layer--tape-e"
        rotate="10deg"
        zIndex={7}
      />

      {/* Hero paper */}
      <ScrapbookLayer
        src={SCRAPBOOK.heroPaper}
        className="bb-home-layer--hero"
        rotate="-3deg"
        zIndex={2}
      >
        <p className="bb-home-hero__caps">{greetingCaps(greeting)}</p>
        <p className="bb-home-hero__greeting">{greeting}</p>
        <p className="bb-home-hero__name">{displayName}.</p>
        <p className="bb-home-hero__belong">
          you <em>belong</em> here
        </p>
      </ScrapbookLayer>

      {/* Polaroid — photo sits behind frame PNG hole */}
      <ScrapbookLayer
        src={SCRAPBOOK.polaroid}
        className="bb-home-layer--polaroid"
        rotate="4deg"
        zIndex={4}
        underlay={<HomePolaroidPhoto defaultUrl={polaroidDefault} userId={userId} />}
      >
        <figcaption className="bb-home-polaroid__cap">
          <span className="bb-home-polaroid__temp">{atmosphere.tempF}°</span>
          <span>soft life, strong mind ♡</span>
          <span className="bb-home-polaroid__borough">{atmosphere.boroughLabel}</span>
        </figcaption>
      </ScrapbookLayer>

      {/* Pink sticky — Yande */}
      {yandeLine ? (
        <ScrapbookLayer
          src={SCRAPBOOK.pinkSticky}
          className="bb-home-layer--sticky"
          rotate="2deg"
          zIndex={5}
        >
          <p className="bb-home-sticky__body">this is your week ♡</p>
          <p className="bb-home-sticky__yande">&ldquo;{yandeLine}&rdquo;</p>
          <Link href={yandeHref} className="bb-home-sticky__link">
            Reply →
          </Link>
        </ScrapbookLayer>
      ) : null}

      {/* Calendar strip */}
      <ScrapbookLayer
        src={SCRAPBOOK.calendarStrip}
        className="bb-home-layer--calendar"
        rotate="-2deg"
        zIndex={3}
      >
        <ol className="bb-home-cal__days">
          {days.map((day) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const has = eventDays.has(day.toDateString());
            return (
              <li
                key={day.toISOString()}
                className={`bb-home-cal__day${isToday ? " bb-home-cal__day--today" : ""}${has ? " bb-home-cal__day--dot" : ""}`}
              >
                <span className="bb-home-cal__dow">
                  {day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                </span>
                <span className="bb-home-cal__num">{day.getDate()}</span>
              </li>
            );
          })}
        </ol>
        <Link href="/member/plans?tab=calendar" className="bb-home-cal__open">
          Open calendar →
        </Link>
      </ScrapbookLayer>

      {/* Invitation envelope */}
      <Link
        href={inviteCount > 0 ? "/member/plans" : "/member/happenings"}
        className="bb-home-layer-link bb-home-layer-link--envelope"
      >
        <ScrapbookLayer
          src={SCRAPBOOK.invitationEnvelope}
          className="bb-home-layer--envelope"
          rotate="-4deg"
          zIndex={6}
        >
          <p className="bb-home-env__lead">{inviteCount > 0 ? "You have" : "Your"}</p>
          <p className="bb-home-env__count">
            {inviteCount > 0
              ? `${inviteCount} PLAN${inviteCount === 1 ? "" : "S"}`
              : "PLANS"}
          </p>
          <p className="bb-home-env__tail">
            {inviteCount > 0 ? "on your calendar" : "start in Happenings →"}
          </p>
        </ScrapbookLayer>
      </Link>

      {/* Flower sticker */}
      <ScrapbookLayer
        src={SCRAPBOOK.flower}
        className="bb-home-layer--flower"
        rotate="-8deg"
        zIndex={9}
      />

      {/* Calendar event whisper — first saved entry */}
      {entries[0] ? (
        <Link
          href={entries[0].href}
          className="bb-home-layer bb-home-layer--event-whisper"
          style={{ transform: "rotate(-5deg)", zIndex: 6 }}
        >
          <span className="bb-home-event-whisper__when">{entries[0].when}</span>
          <strong>{entries[0].title}</strong>
        </Link>
      ) : null}
    </section>
  );
}
