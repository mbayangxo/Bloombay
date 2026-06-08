"use client";

import Link from "next/link";
import { ConfettiCard } from "@/app/components/bloom-artifacts/confetti-card";
import { CONFETTI_INVITATIONS } from "@/lib/confetti-data";
import { INVITATIONS, invitationGatheringHref } from "@/lib/member-portal-data";
import {
  HAPPENING_POSTER_TEMPLATES,
  SEAT_TICKET_TEMPLATES,
  templateAt,
} from "@/lib/member-ui-templates";
import { HappeningPosterObject } from "./happening-poster-object";
import { SeatTicketObject } from "./seat-ticket-object";

const CONFETTI_TILTS = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.4, -2, 0.8];

export function HappeningsInvitations({
  gatherings,
}: {
  gatherings: { id: string; title: string; date: string; time: string; neighborhood: string; kind: string }[];
}) {
  return (
    <div className="bb-happenings-invitations">
      <section id="confetti" className="bb-happenings-confetti">
        <p className="bb-eyebrow">Confetti for her</p>
        <p className="bb-accent-sm bb-happenings-confetti__intro">
          Celebrate the woman — open her invitation, join her night, or send a wish if you can&apos;t go.
        </p>
        <Link href={`/member/happenings/confetti/${CONFETTI_INVITATIONS[0]?.id ?? "cf-birthday-lexi"}`} className="bb-confetti-hero-tile">
          <span className="bb-confetti-hero-tile__sparkle" aria-hidden>
            ✦
          </span>
          <p className="bb-confetti-hero-tile__line">Celebrate her · open confetti</p>
          <p className="bb-confetti-hero-tile__sub">
            Birthdays, promotions, new keys, graduations — each celebration has its own stationery template.
          </p>
          <span className="bb-confetti-hero-tile__cta">Open an invitation →</span>
        </Link>
        <div className="bb-confetti-scatter" role="list" aria-label="Confetti invitations">
          {CONFETTI_INVITATIONS.map((c, i) => (
            <ConfettiCard key={c.id} confetti={c} tilt={CONFETTI_TILTS[i % CONFETTI_TILTS.length]} />
          ))}
        </div>
        <Link href="/member/happenings/create" className="mp-link" style={{ display: "inline-block", margin: "0 1rem" }}>
          Drop confetti · plan a celebration →
        </Link>
      </section>

      <section id="open-seats" className="bb-happenings-seats-strip">
        <p className="mp-section__title">Open seats</p>
        <p className="bb-caption" style={{ margin: "0 1rem 0.75rem", maxWidth: "36ch" }}>
          Tickets and tables — save a seat, then celebrate her separately in confetti above.
        </p>
        <div className="bb-physical-wall">
          <div className="bb-physical-wall__row">
          {gatherings.slice(0, 3).map((g, i) => (
            <SeatTicketObject
              key={g.id}
              index={i}
              src={templateAt(SEAT_TICKET_TEMPLATES, i)}
              title={g.title}
              meta={`${g.date} · ${g.time} · ${g.neighborhood}`}
              code={`SEAT-${g.id.toUpperCase()}`}
              href={`/member/happenings/gatherings/${g.id}`}
            />
          ))}
          </div>
        </div>
        <Link href="/member/happenings/seats" className="mp-btn mp-btn--outline mp-btn--sm" style={{ margin: "0 1rem" }}>
          All open seats →
        </Link>
      </section>

      <section id="envelopes" className="bb-happenings-envelopes">
        <p className="mp-section__title">Envelopes for you</p>
        <div className="bb-physical-wall">
          <div className="bb-physical-wall__row">
          {INVITATIONS.map((inv, i) => (
            <HappeningPosterObject
              key={inv.id}
              index={i}
              src={templateAt(HAPPENING_POSTER_TEMPLATES, i)}
              eyebrow={inv.status === "new" ? "Fresh envelope" : "You're invited"}
              title={inv.title}
              meta={`${inv.when} · ${inv.place} · Hosted by ${inv.host}`}
              href={invitationGatheringHref(inv)}
            />
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}
