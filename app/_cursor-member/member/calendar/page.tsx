"use client";

import { Suspense } from "react";
import { MemberShell } from "../components/member-shell";
import { GirlCalendarMonth } from "@/app/components/member/girl-calendar-month";

export default function MemberCalendarPage() {
  return (
    <MemberShell hideHeader flush fullWidth>
      <div className="bb-cal-page">
        <p className="bb-page-kicker">Girl Calendar · your plans</p>
        <Suspense fallback={<div className="bb-cal-month">Loading…</div>}>
          <GirlCalendarMonth />
        </Suspense>
      </div>
    </MemberShell>
  );
}
