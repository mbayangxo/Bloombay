"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GirlCalendarMonth } from "@/app/components/member/girl-calendar-month";
import { listGatheringPlans, type GatheringPlan } from "@/lib/member-gathering-plans";

type PlansTab = "plans" | "calendar" | "rooms";

export function PlansHub() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: PlansTab =
    tabParam === "calendar" ? "calendar" : tabParam === "rooms" ? "rooms" : "plans";
  const highlightSlug = searchParams.get("ticket");

  const [plans, setPlans] = useState<GatheringPlan[]>([]);

  useEffect(() => {
    function load() {
      setPlans(listGatheringPlans());
    }
    load();
    window.addEventListener("bb-gathering-plans-updated", load);
    return () => window.removeEventListener("bb-gathering-plans-updated", load);
  }, []);

  const going = plans.filter((p) => p.commitment === "going");
  const debating = plans.filter((p) => p.commitment === "debating");

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

        <div className="flex gap-2 mb-6 overflow-x-auto pb-0.5">
          <Link
            href="/member/plans"
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
            style={
              tab === "plans"
                ? { background: "#FF1F7D", color: "white" }
                : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }
            }
          >
            Tickets
          </Link>
          <Link
            href="/member/plans?tab=rooms"
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
            style={
              tab === "rooms"
                ? { background: "#111", color: "white" }
                : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }
            }
          >
            Plan rooms
          </Link>
          <Link
            href="/member/plans?tab=calendar"
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
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

      {tab === "calendar" ? (
        <div className="px-5 md:px-10 max-w-2xl mx-auto">
          <GirlCalendarMonth dayPath="/member/plans/day" />
        </div>
      ) : tab === "rooms" ? (
        <div className="px-5 md:px-10 max-w-2xl mx-auto flex flex-col gap-3">
          {going.length === 0 ? (
            <div className="text-center rounded-3xl p-8 bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <p className="font-bold" style={{ color: "#111" }}>
                No plan rooms yet
              </p>
              <p className="text-sm mt-2" style={{ color: "#888" }}>
                When you RSVP &ldquo;I would love to go,&rdquo; your planner unlocks here.
              </p>
            </div>
          ) : (
            going.map((p) => (
              <Link
                key={p.id}
                href={p.planRoomHref}
                className="rounded-2xl p-4 bg-white flex items-center justify-between gap-3"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textDecoration: "none" }}
              >
                <div>
                  <p className="font-bold text-sm" style={{ color: "#111" }}>
                    {p.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#888" }}>
                    {p.when}
                  </p>
                </div>
                <span className="text-xs font-bold" style={{ color: "#FF1F7D" }}>
                  Enter →
                </span>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="px-5 md:px-10 max-w-2xl mx-auto flex flex-col gap-3">
          {plans.length === 0 ? (
            <div className="text-center rounded-3xl p-8 bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "36px" }}>🎫</p>
              <p className="font-black mt-3" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "#111" }}>
                No plans yet
              </p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "#888" }}>
                When you RSVP to a real happening, your ticket and plan room will show up here.
              </p>
              <Link
                href="/member/happenings"
                className="inline-block mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
                style={{ background: "#FF1F7D" }}
              >
                Browse happenings →
              </Link>
            </div>
          ) : (
            <>
              {going.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl p-4 bg-white"
                  style={{
                    boxShadow: highlightSlug === p.slug ? "0 0 0 2px #FF1F7D" : "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <p className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>
                    Ticket · Confirmed
                  </p>
                  <p className="font-bold" style={{ color: "#111" }}>
                    {p.title}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#888" }}>
                    {p.when} · {p.place}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                      href={p.planRoomHref}
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ background: "#111" }}
                    >
                      Plan room
                    </Link>
                    <Link
                      href={p.chatHref}
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ border: "1.5px solid #FFE0EE", color: "#FF1F7D" }}
                    >
                      Group chat
                    </Link>
                  </div>
                </div>
              ))}
              {debating.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl p-4 bg-white"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                >
                  <p className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9b7ec8" }}>
                    Still debating
                  </p>
                  <p className="font-bold" style={{ color: "#111" }}>
                    {p.title}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#888" }}>
                    {p.when}
                  </p>
                  <Link
                    href={`/member/happenings/${p.slug}`}
                    className="inline-block mt-3 text-xs font-bold"
                    style={{ color: "#FF1F7D" }}
                  >
                    Ready to go? Confirm →
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
