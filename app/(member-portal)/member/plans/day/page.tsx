"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CalendarDayStudio } from "@/app/components/member/calendar-day-studio";

function PlansDayContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  return <CalendarDayStudio dateParam={date} calendarHref="/member/plans?tab=calendar" />;
}

export default function PlansDayPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <Suspense fallback={null}>
        <PlansDayContent />
      </Suspense>
    </div>
  );
}
