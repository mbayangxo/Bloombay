import { HappeningPosterObject } from "./happening-poster-object";
import { SeatTicketObject } from "./seat-ticket-object";
import { HAPPENING_POSTER_TEMPLATES, SEAT_TICKET_TEMPLATES, templateAt } from "@/lib/member-ui-templates";
import type { MemberPlanItem } from "@/lib/member-plans";

export function PlansDesk({ plans }: { plans: MemberPlanItem[] }) {
  return (
    <div className="bb-physical-desk">
      <p className="bb-plans-room__whisper">Your desk — tickets, confirmations, memories.</p>
      <div className="bb-physical-desk__scatter">
        {plans.map((p, i) => {
          const useTicket = i % 2 === 1;
          const meta = [p.when, p.place].filter(Boolean).join(" · ");

          if (useTicket) {
            return (
              <SeatTicketObject
                key={p.rsvpId}
                src={templateAt(SEAT_TICKET_TEMPLATES, i)}
                title={p.title}
                meta={meta}
                code={`RSVP-${p.eventId.toUpperCase()}`}
                href={p.href}
                tilt={[-4, 3, -1.5, 2.5][i % 4]}
                pinned
              />
            );
          }

          return (
            <HappeningPosterObject
              key={p.rsvpId}
              src={templateAt(HAPPENING_POSTER_TEMPLATES, i)}
              eyebrow="Confirmed"
              title={p.title}
              meta={meta}
              href={p.href}
              tilt={[-4, 3, -1.5, 2.5][i % 4]}
              pinned
            />
          );
        })}
      </div>
    </div>
  );
}
