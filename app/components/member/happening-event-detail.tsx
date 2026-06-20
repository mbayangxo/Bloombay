"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MemberShell } from "@/app/member/components/member-shell";
import { getMemberHappeningById } from "@/lib/bloombay-events-member";
import { getHappeningPresent } from "@/lib/happening-present";
import {
  canAccessPlanRoom,
  ensureEventQrCode,
  getRsvp,
  hasRsvp,
  rsvpToEvent,
} from "@/lib/event-rsvp-store";
import { addToGirlCalendar, isOnCalendar } from "@/lib/member-calendar-store";
import { BloomTicket } from "@/app/components/bloom-artifacts";
import { splitTitleHighlight } from "@/lib/bloom-artifact-types";

export function HappeningEventDetail({ id }: { id: string }) {
  const router = useRouter();
  const [rsvped, setRsvped] = useState(false);
  const [paid, setPaid] = useState(false);
  const [onCal, setOnCal] = useState(false);
  const [depositStep, setDepositStep] = useState(false);
  const [busy, setBusy] = useState(false);
  const name =
    typeof window !== "undefined" ? sessionStorage.getItem("gf_name")?.split(" ")[0] ?? "You" : "You";

  const g = useMemo(() => getMemberHappeningById(id), [id]);
  const present = useMemo(
    () => (g ? getHappeningPresent(id, g) : null),
    [g, id]
  );

  useEffect(() => {
    function load() {
      setRsvped(hasRsvp(id, "member-self"));
      setPaid(!!getRsvp(id, "member-self")?.paidDeposit);
      setOnCal(isOnCalendar(id));
    }
    load();
    window.addEventListener("bb-events-updated", load);
    return () => window.removeEventListener("bb-events-updated", load);
  }, [id]);

  if (!g || !present) {
    return (
      <MemberShell backHref="/member/happenings" backLabel="Happenings">
        <p style={{ padding: "2rem" }}>Event not found.</p>
      </MemberShell>
    );
  }

  const { highlight } = splitTitleHighlight(g.title);
  const seatFee = g.ticket;
  const deposit = g.deposit;
  const requiresPayment = deposit > 0 || seatFee > 0;
  const total = g.total || seatFee + deposit + (present.venueFee ?? 0) + (present.experienceFee ?? 0);
  const planHref = `/member/plan/${id}`;

  async function finalizeRsvp(markPaid: boolean) {
    setBusy(true);
    try {
      await rsvpToEvent(id, name, "member-self", { paidDeposit: markPaid });
      setRsvped(true);
      setPaid(markPaid || !requiresPayment);
      await addToGirlCalendar({
        sourceId: id,
        title: g!.title,
        when: `${g!.date} · ${g!.time}`,
        place: `${g!.venue} · ${g!.neighborhood}`,
        href: `/member/happenings/gatherings/${id}`,
        kind: "happening",
        remind: true,
      });
      setOnCal(true);
      setDepositStep(false);
      router.push(planHref);
    } catch (e) {
      alert(e instanceof Error ? e.message : "RSVP failed");
    } finally {
      setBusy(false);
    }
  }

  function handleRsvpClick() {
    if (rsvped && canAccessPlanRoom(id, "member-self")) {
      router.push(planHref);
      return;
    }
    if (requiresPayment && !depositStep) {
      setDepositStep(true);
      return;
    }
    void finalizeRsvp(requiresPayment);
  }

  return (
    <MemberShell backHref="/member/happenings?tab=invitations" backLabel="Happenings" showNav={false}>
      <div className="bb-happening-event">
        <header className="bb-happening-event__top">
          <Link href="/member/happenings" className="bb-happening-event__back" aria-label="Back">
            ←
          </Link>
          <span className="bb-happening-event__brand">BloomBay</span>
          <span className="bb-happening-event__top-actions" aria-hidden>
            ↗ ♡
          </span>
        </header>

        <section className="bb-happening-event__collage" aria-label="Event invitation">
          <div className="bb-happening-event__ticket">
            <p className="bb-happening-event__ticket-admit">ADMIT ONE · HER</p>
            <h1 className="bb-happening-event__ticket-title">
              {present.title}
              {present.titleAccent ? (
                <span className="bb-happening-event__ticket-accent"> {present.titleAccent}</span>
              ) : null}
            </h1>
            <p className="bb-happening-event__ticket-sub">{present.subtitle}</p>
            <ul className="bb-happening-event__ticket-meta">
              <li>
                <span>Date</span>
                <strong>{g.date}</strong>
              </li>
              <li>
                <span>Time</span>
                <strong>{g.time}</strong>
              </li>
              <li>
                <span>Table</span>
                <strong>{present.seatLabel}</strong>
              </li>
            </ul>
            <div className="bb-happening-event__barcode" aria-hidden />
          </div>
          <div className="bb-happening-event__photo" role="img" aria-label="Women at dinner" />
          <div className="bb-happening-event__clip-note">
            <p>{present.pinnedNote}</p>
            <span className="bb-wax-seal bb-wax-seal--sm" aria-hidden>
              BB
            </span>
          </div>
          <p className="bb-happening-event__curated-pill">
            {present.curatedLine} · GOOD FOOD · BETTER COMPANY ✦
          </p>
        </section>

        <section className="bb-happening-event__seat-card">
          <div className="bb-happening-event__seat-main">
            <p className="bb-happening-event__seat-kicker">YOUR SEAT</p>
            <p className="bb-happening-event__seat-num">TABLE {present.seatLabel}</p>
            <p className="bb-happening-event__seat-sub">
              {g.attendees.length + g.extra} women · {present.sectionLabel}
            </p>
          </div>
          <div className="bb-happening-event__rsvp-status">
            <p className="bb-happening-event__seat-kicker">RSVP STATUS</p>
            {rsvped ? (
              <span className="bb-happening-event__confirmed">CONFIRMED ✓</span>
            ) : (
              <span className="bb-happening-event__pending">NOT YET</span>
            )}
            {rsvped && paid ? <p className="bb-happening-event__paid">Paid in full ✦</p> : null}
          </div>
        </section>

        {requiresPayment ? (
          <section className="bb-happening-event__pricing">
            <div>
              <span>Deposit</span>
              <strong>${deposit}</strong>
              <small>Secures your seat</small>
            </div>
            <div>
              <span>Ticket</span>
              <strong>${seatFee}</strong>
              <small>Non-refundable</small>
            </div>
            {g.minSpend > 0 ? (
              <div>
                <span>Min. spend</span>
                <strong>${g.minSpend}</strong>
                <small>At the dinner</small>
              </div>
            ) : null}
            <div>
              <span>Total</span>
              <strong>${total}</strong>
              <small>{rsvped && paid ? "Paid" : "Due at RSVP"}</small>
            </div>
          </section>
        ) : (
          <p className="bb-happening-event__free-note">Free gathering — RSVP to unlock the Plan Room.</p>
        )}

        <section className="bb-happening-event__social">
          <div className="bb-happening-event__with">
            <p>Who you&apos;ll be with</p>
            <div className="bb-happening-event__avatars">
              {g.attendees.map((a) => (
                <span key={a} className="bb-happening-event__avatar">
                  {a}
                </span>
              ))}
              {g.extra > 0 ? <span className="bb-happening-event__avatar bb-happening-event__avatar--more">+{g.extra}</span> : null}
            </div>
          </div>
          <div className="bb-happening-event__chemistry">
            <p>Your table</p>
            <strong>
              {g.attendees.length + g.extra > 0 ? `${g.attendees.length + g.extra} Bloomies` : "Open seats"}
            </strong>
            <span>{present.trustLine}</span>
          </div>
        </section>

        <section className="bb-happening-event__story">
          <p className="bb-happening-event__eyebrow">{present.eyebrow}</p>
          <div className="bb-happening-event__tags">
            {present.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="bb-happening-event__vibe">{present.vibeNote}</p>
          {present.vibeFull ? <p className="bb-happening-event__vibe-full">{present.vibeFull}</p> : null}
          <p className="bb-happening-event__quote">{present.scrapQuote}</p>
        </section>

        {rsvped ? (
          <div className="bb-happening-event__ticket-wrap">
            <BloomTicket
              className="bb-ticket--inline"
              title={g.title}
              titleHighlight={highlight}
              admit="ADMIT ONE · HER"
              meta={[
                { label: "Date", value: g.date },
                { label: "Table", value: present.seatLabel },
                { label: "Venue", value: g.venue },
              ]}
              code={ensureEventQrCode(id)}
            />
          </div>
        ) : null}

        <footer className="bb-happening-event__actions">
          {depositStep && requiresPayment && !rsvped ? (
            <div className="bb-happening-event__deposit-panel">
              <p className="bb-happening-event__deposit-title">Secure your seat</p>
              <p className="bb-happening-event__deposit-copy">
                Pay ${deposit} deposit now{seatFee > 0 ? ` · $${seatFee} ticket at the door` : ""}.
              </p>
              <button
                type="button"
                className="bb-btn bb-btn--hot bb-btn--block"
                disabled={busy}
                onClick={() => void finalizeRsvp(true)}
              >
                {busy ? "Processing…" : `Pay $${deposit} deposit & RSVP`}
              </button>
              <button
                type="button"
                className="bb-btn bb-btn--ghost bb-btn--block"
                onClick={() => setDepositStep(false)}
              >
                Back
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="bb-btn bb-btn--hot bb-btn--block"
                disabled={busy}
                onClick={handleRsvpClick}
              >
                {busy
                  ? "One moment…"
                  : rsvped
                    ? "Open Plan Room →"
                    : requiresPayment
                      ? `RSVP · $${deposit} deposit`
                      : "RSVP — free"}
              </button>
              {!rsvped ? (
                <p className="bb-happening-event__rsvp-hint">
                  Tap to see the full event, pay if required, then enter the Plan Room with everyone going.
                </p>
              ) : null}
            </>
          )}
          <Link href="/member/intros" className="bb-btn bb-btn--outline-pink bb-btn--block">
            Invite a Bloomie
          </Link>
          {rsvped ? (
            <Link href={planHref} className="bb-btn bb-btn--outline-pink bb-btn--block">
              Plan Room · see the host&apos;s plan
            </Link>
          ) : null}
          <button
            type="button"
            className="bb-btn bb-btn--ghost bb-btn--block"
            disabled={onCal}
            onClick={async () => {
              await addToGirlCalendar({
                sourceId: id,
                title: g.title,
                when: `${g.date} · ${g.time}`,
                place: `${g.venue} · ${g.neighborhood}`,
                href: `/member/happenings/gatherings/${id}`,
                kind: "happening",
                remind: true,
              });
              setOnCal(true);
            }}
          >
            {onCal ? "On Girl Calendar ✓" : "Save for later"}
          </button>
        </footer>
      </div>
    </MemberShell>
  );
}
