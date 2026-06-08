"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MemberShell } from "../components/member-shell";
import { HappeningsChrome } from "../components/happenings-chrome";
import { useLiveHappenings } from "@/app/hooks/use-live-happenings";
import { CITY_ALONE, CITY_HAPPENING_FEED } from "@/lib/member-portal-data";
import { HappeningsInvitations } from "@/app/components/member/happenings-invitations";
import { BULLETIN_POSTS } from "@/lib/member-bulletin-data";
import { SpaceMood } from "@/app/components/member/space-mood";
import { YandeConciergeStrip } from "@/app/components/member/yande-concierge-strip";
import { WeeklyChallengeBanner } from "@/app/components/member/weekly-challenge-banner";
import { BloomNotice, WallNote } from "@/app/components/bloom-artifacts";
import { HappeningPosterObject } from "@/app/components/member/happening-poster-object";
import { HAPPENING_POSTER_TEMPLATES, templateAt } from "@/lib/member-ui-templates";
import { happeningsMomentLine } from "@/lib/happening-moments";
import { getCityAtmosphere } from "@/lib/city-atmosphere";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import { GATHERINGS } from "@/lib/member-portal-data";

function HappeningsContent() {
  const tab = useSearchParams().get("tab") ?? "invitations";
  const gatherings = useLiveHappenings();
  const moment = happeningsMomentLine(tab);
  const city = getCityAtmosphere();

  return (
    <MemberShell compactHeader flush fullWidth>
      <SpaceMood mood="happenings" showIntro={false}>
        <HappeningsChrome invitationsFocus={tab === "invitations"}>
          <div className="mp-page-body bb-happenings-parlor">
            {tab === "invitations" && <HappeningsInvitations gatherings={gatherings} />}

            {tab !== "invitations" && (
              <>
                <div className="bb-happening-moment">
                  <p className="bb-happening-moment__line">{moment.line}</p>
                  <p className="bb-happening-moment__whisper">
                    {city.neighborhood}, {city.city} · {city.sky}
                  </p>
                </div>
                <YandeConciergeStrip variant="text" />
                <WeeklyChallengeBanner />
              </>
            )}
            {tab === "city" && (
              <>
                <p className="mp-section__title">Tonight in the city</p>
                <div className="bb-physical-wall">
                  <div className="bb-physical-wall__row">
                  {CITY_HAPPENING_FEED.map((item, i) => (
                    <HappeningPosterObject
                      key={item.title}
                      index={i}
                      src={templateAt(HAPPENING_POSTER_TEMPLATES, i)}
                      eyebrow="Tonight in the city"
                      title={item.title}
                      meta={`${item.when} · ${item.where}`}
                      href="/member/tonight"
                    />
                  ))}
                  </div>
                </div>
                <Link href="/member/maps" className="mp-link">
                  Open maps & girl-favorite eats →
                </Link>
              </>
            )}

            {tab === "solo" && (
              <>
                <p className="mp-section__title">Solo — still in the city</p>
                <div className="bb-artifact-board bb-artifact-board--dense">
                  {CITY_ALONE.map((item) => (
                    <WallNote
                      key={item.title}
                      topic="Solo note"
                      title={item.title}
                      body={item.hint}
                      footer="Your pace"
                      variant="ivory"
                      tilt={-1}
                      className="bb-artifact--compact"
                    />
                  ))}
                </div>
              </>
            )}

            {tab === "bulletin" && (
              <>
                <p className="mp-section__title">Bulletin scraps</p>
                <div className="bb-artifact-board bb-artifact-board--dense">
                  <BloomNotice
                    eyebrow="BloomBay · bulletin"
                    headline="Ask the city"
                    body="Quick scraps — long threads live in the Lobby."
                    footer="The Wall"
                    official
                  />
                  {BULLETIN_POSTS.map((post) => (
                    <WallNote
                      key={post.id}
                      topic={post.tag}
                      title={post.q}
                      body="Pinned question from the city board."
                      footer={`${post.author} · ${post.replies} replies`}
                      variant="yellow"
                      className="bb-artifact--compact"
                    />
                  ))}
                </div>
                <Link href="/member/room?space=bulletin" className="mp-btn mp-btn--hot mp-btn--block" style={{ textAlign: "center" }}>
                  Post in the Lobby
                </Link>
              </>
            )}

            {tab === "gatherings" && (
              <>
                {gatherings.length === 0 ? (
                  <BbEmptyState
                    {...bloomEmptyProps("events", {
                      label: "See tonight's table",
                      href: `/member/happenings/gatherings/${GATHERINGS[0]?.id ?? "g1"}`,
                    })}
                  />
                ) : (
                  <div className="bb-physical-wall">
                    <div className="bb-physical-wall__row">
                    {gatherings.map((g, i) => (
                      <HappeningPosterObject
                        key={g.id}
                        index={i}
                        src={templateAt(HAPPENING_POSTER_TEMPLATES, i)}
                        eyebrow={
                          g.kind === "blueday"
                            ? "Blue Day · all members"
                            : "You're invited · admit one · her"
                        }
                        title={g.title}
                        meta={`${g.date} · ${g.time} · ${g.neighborhood}`}
                        href={`/member/happenings/gatherings/${g.id}`}
                      />
                    ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </HappeningsChrome>
      </SpaceMood>
    </MemberShell>
  );
}

export default function HappeningsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <HappeningsContent />
    </Suspense>
  );
}
