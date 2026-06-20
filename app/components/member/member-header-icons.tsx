"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  countUnreadMailbox,
  countUnreadNotifications,
} from "@/lib/member-notifications";
import { countMemberPlans } from "@/lib/member-plans";
import { countCalendarEntries } from "@/lib/member-calendar-store";
import { syncMailboxFromServer } from "@/lib/member-mailbox";

function Badge({ count, petite }: { count: number; petite?: boolean }) {
  if (count <= 0) return null;
  if (petite) {
    return (
      <span
        className="bb-header-icons__badge bb-header-icons__badge--rose"
        aria-label={`${count} new`}
      />
    );
  }
  return (
    <span className="bb-header-icons__badge">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function RoseGemIcon({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="bb-rose-gem__shape" aria-hidden />
      <span className="bb-rose-gem__icon">{children}</span>
    </>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h16v16H4z" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function IconPlans() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  );
}

function IconPing() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MemberHeaderIcons({
  className,
  petite = false,
}: {
  className?: string;
  /** Tiny rose chips — compact header on Happenings & maps */
  petite?: boolean;
}) {
  const [mailbox, setMailbox] = useState(0);
  const [calendar, setCalendar] = useState(0);
  const [plans, setPlans] = useState(0);
  const [pings, setPings] = useState(0);

  useEffect(() => {
    function refresh() {
      setMailbox(countUnreadMailbox());
      setCalendar(countCalendarEntries());
      setPlans(countMemberPlans());
      setPings(countUnreadNotifications());
    }
    refresh();
    void syncMailboxFromServer().then(refresh);
    window.addEventListener("bb-member-mail-updated", refresh);
    window.addEventListener("bb-events-updated", refresh);
    window.addEventListener("bb-calendar-updated", refresh);
    const t = setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener("bb-member-mail-updated", refresh);
      window.removeEventListener("bb-events-updated", refresh);
      window.removeEventListener("bb-calendar-updated", refresh);
      clearInterval(t);
    };
  }, []);

  const btnClass = petite ? "bb-rose-gem bb-header-icons__btn" : "mp-icon-btn bb-header-icons__btn";

  return (
    <div className={`bb-header-icons${petite ? " bb-header-icons--petite" : ""}${className ? ` ${className}` : ""}`}>
      <Link href="/member/mailbox" className={btnClass} aria-label="Mailbox" title="Mailbox">
        {petite ? (
          <RoseGemIcon>
            <IconMail />
          </RoseGemIcon>
        ) : (
          <IconMail />
        )}
        <Badge count={mailbox} petite={petite} />
      </Link>
      <Link href="/member/calendar" className={btnClass} aria-label="Girl Calendar" title="Girl Calendar">
        {petite ? (
          <RoseGemIcon>
            <IconCalendar />
          </RoseGemIcon>
        ) : (
          <IconCalendar />
        )}
        <Badge count={calendar} petite={petite} />
      </Link>
      <Link href="/member/plans" className={btnClass} aria-label="Plans" title="Plans">
        {petite ? (
          <RoseGemIcon>
            <IconPlans />
          </RoseGemIcon>
        ) : (
          <IconPlans />
        )}
        <Badge count={plans} petite={petite} />
      </Link>
      <Link href="/member/notifications" className={btnClass} aria-label="Ping" title="Ping">
        {petite ? (
          <RoseGemIcon>
            <IconPing />
          </RoseGemIcon>
        ) : (
          <IconPing />
        )}
        <Badge count={pings} petite={petite} />
      </Link>
    </div>
  );
}
