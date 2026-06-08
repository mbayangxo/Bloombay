"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MemberShell } from "@/app/member/components/member-shell";
import { getMemberHappeningById } from "@/lib/bloombay-events-member";
import { getPlanRoomData, type PlanRoomData } from "@/lib/plan-room-data";

const TABS = ["plan", "people", "details", "orders"] as const;
type Tab = (typeof TABS)[number];

export function PlanRoomView({ eventId, plan }: { eventId: string; plan: PlanRoomData }) {
  const [tab, setTab] = useState<Tab>("plan");
  const g = useMemo(() => getMemberHappeningById(eventId), [eventId]);

  return (
    <MemberShell backHref={`/member/happenings/gatherings/${eventId}`} backLabel="Event" showNav={false}>
      <div className="bb-plan-room">
        <header className="bb-plan-room__header">
          <p className="bb-plan-room__room-label">Plan room ✦</p>
          <h1 className="bb-plan-room__iconic">
            {plan.iconicLine}{" "}
            <em className="bb-plan-room__iconic-accent">{plan.iconicAccent}</em>
          </h1>
          <p className="bb-plan-room__plan-for">
            <span>Plan for</span> {plan.planFor}
          </p>
          <p className="bb-plan-room__meta">{plan.dateLine}</p>
          <div className="bb-plan-room__scrap" aria-hidden>
            <div className="bb-plan-room__polaroid">
              <div className="bb-plan-room__polaroid-img" />
              <p>{plan.polaroidCaption}</p>
            </div>
            <div className="bb-plan-room__sticky">
              <span className="bb-plan-room__sticky-label">{plan.stickyNote}</span>
              <span className="bb-plan-room__wave" aria-hidden />
            </div>
          </div>
        </header>

        <nav className="bb-plan-room__tabs" aria-label="Plan room sections">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`bb-plan-room__tab${tab === t ? " bb-plan-room__tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "plan" ? "Plan" : t === "people" ? "People" : t === "details" ? "Details" : "Orders"}
            </button>
          ))}
        </nav>

        <div className="bb-plan-room__body">
          {tab === "plan" && (
            <>
              <section className="bb-plan-room__plan-card">
                <span className="bb-plan-room__ribbon">The plan</span>
                <ul className="bb-plan-room__steps">
                  {plan.planSteps.map((step) => (
                    <li key={step.label}>
                      <span aria-hidden>{step.icon}</span>
                      {step.label}
                    </li>
                  ))}
                </ul>
                {plan.dressCode ? <p className="bb-plan-room__dress">{plan.dressCode}</p> : null}
                {plan.voiceNote ? (
                  <div className="bb-plan-room__voice-inline">
                    <span>Voice note from {plan.voiceNote.from}</span>
                    <span className="bb-plan-room__voice-dur">{plan.voiceNote.duration}</span>
                  </div>
                ) : null}
                <div className="bb-plan-room__outfit">
                  <strong>Outfit check</strong>
                  <p>{plan.outfitCheckBlurb}</p>
                  <div className="bb-plan-room__outfit-avatars">
                    {plan.attendees.slice(0, 4).map((a) => (
                      <span key={a.id}>{a.name[0]}</span>
                    ))}
                    <span>+4</span>
                  </div>
                </div>
              </section>
              {plan.countdown ? (
                <aside className="bb-plan-room__countdown">
                  <span>{String(plan.countdown.days).padStart(2, "0")} days</span>
                  <span>{String(plan.countdown.hours).padStart(2, "0")} hrs</span>
                  <span>{String(plan.countdown.minutes).padStart(2, "0")} min</span>
                  <p>until our night</p>
                </aside>
              ) : null}
              <section className="bb-plan-room__chat">
                <h2>Plan chat</h2>
                <ul>
                  {plan.chat.map((m) => (
                    <li
                      key={m.id}
                      className={m.mine ? "bb-plan-room__chat-bubble--mine" : "bb-plan-room__chat-bubble"}
                    >
                      {!m.mine ? <span className="bb-plan-room__chat-from">{m.from}</span> : null}
                      <p>{m.text}</p>
                      {m.reaction ? <span className="bb-plan-room__chat-react">{m.reaction}</span> : null}
                    </li>
                  ))}
                </ul>
                <div className="bb-plan-room__chat-input">
                  <button type="button" aria-label="Add">
                    +
                  </button>
                  <input type="text" placeholder="Say something, Bloomie…" readOnly />
                  <span aria-hidden>✦</span>
                </div>
              </section>
            </>
          )}

          {tab === "people" && (
            <section className="bb-plan-room__people">
              <h2>Who&apos;s coming</h2>
              <div className="bb-plan-room__attendee-grid">
                {plan.attendees.map((a) => (
                  <div key={a.id} className="bb-plan-room__attendee">
                    <span className="bb-plan-room__attendee-avatar">{a.name[0]}</span>
                    <span className="bb-plan-room__attendee-name">
                      {a.name}
                      {a.badge ? ` (${a.badge})` : ""}
                    </span>
                    <span className={`bb-plan-room__attendee-status bb-plan-room__attendee-status--${a.status}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
              <ul className="bb-plan-room__voice-list">
                {plan.voiceNotes.map((v) => (
                  <li key={v.id}>
                    <span>{v.from}</span>
                    <span className="bb-plan-room__wave-sm" aria-hidden />
                    <span>{v.duration}</span>
                    <button type="button">▶</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "details" && g && (
            <section className="bb-plan-room__details">
              <h2>Event details</h2>
              <dl>
                <div>
                  <dt>When</dt>
                  <dd>
                    {g.date} · {g.time}
                  </dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>
                    {g.venue} · {g.neighborhood}
                  </dd>
                </div>
                <div>
                  <dt>Table</dt>
                  <dd>{g.table}</dd>
                </div>
                <div>
                  <dt>Host plan</dt>
                  <dd>{g.subtitle}</dd>
                </div>
              </dl>
              <Link href={`/member/happenings/gatherings/${eventId}`} className="mp-link">
                View ticket & receipt →
              </Link>
            </section>
          )}

          {tab === "orders" && (
            <section className="bb-plan-room__orders">
              <h2>Advance order</h2>
              <p>{plan.advanceOrderBlurb}</p>
              <div className="bb-plan-room__order-thumbs">
                <span aria-hidden>🍸</span>
                <span aria-hidden>🥗</span>
                <span aria-hidden>🍰</span>
              </div>
              <button type="button" className="bb-btn bb-btn--hot">
                Order now →
              </button>
            </section>
          )}
        </div>
      </div>
    </MemberShell>
  );
}
