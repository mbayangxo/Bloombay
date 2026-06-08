"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GirlCalendarMonth } from "@/app/components/member/girl-calendar-month";

type PlansTab = "plans" | "calendar";

export function PlansHub() {
  const searchParams = useSearchParams();
  const tab: PlansTab = searchParams.get("tab") === "calendar" ? "calendar" : "plans";

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 md:px-10 md:pt-8 max-w-2xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
          ✦ YOUR PLANS
        </p>
        <h1
          className="font-black leading-none"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(34px,6vw,48px)",
            color: "#111",
            lineHeight: 0.92,
          }}
        >
          Plans.
        </h1>
        <p className="text-sm italic mt-1 mb-5" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
          Tickets, plan rooms, and your calendar — only what you save.
        </p>

        <div className="flex gap-2 mb-6">
          <Link
            href="/member/plans"
            className="px-4 py-2 rounded-full text-xs font-bold transition-all"
            style={
              tab === "plans"
                ? { background: "#FF1F7D", color: "white" }
                : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }
            }
          >
            My plans
          </Link>
          <Link
            href="/member/plans?tab=calendar"
            className="px-4 py-2 rounded-full text-xs font-bold transition-all"
            style={
              tab === "calendar"
                ? { background: "#111", color: "white" }
                : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }
            }
          >
            Calendar
          </Link>
        </div>
      </div>

      {tab === "plans" ? (
        <div className="px-5 md:px-10 flex flex-col items-center justify-center max-w-2xl mx-auto" style={{ minHeight: "36vh" }}>
          <div className="text-center rounded-3xl p-8 w-full bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "36px" }}>🎫</p>
            <p className="font-black mt-3" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "#111" }}>
              No plans yet
            </p>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "#888" }}>
              When you RSVP to a real happening or accept an invitation, your ticket and plan room will show up here.
              No placeholder rooms until then.
            </p>
            <Link
              href="/member/happenings"
              className="inline-block mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Browse happenings →
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-5 md:px-10 max-w-2xl mx-auto">
          <GirlCalendarMonth dayPath="/member/plans/day" />
        </div>
      )}
    </div>
  );
}
