"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MemberShell } from "../../components/member-shell";
import { CalendarDayStudio } from "@/app/components/member/calendar-day-studio";

function CalendarDayContent() {
  const date = useSearchParams().get("date");
  return <CalendarDayStudio dateParam={date} />;
}

export default function CalendarDayPage() {
  return (
    <MemberShell hideHeader flush fullWidth>
      <Suspense fallback={<div className="bb-cal-page">Loading your day…</div>}>
        <CalendarDayContent />
      </Suspense>
    </MemberShell>
  );
}
