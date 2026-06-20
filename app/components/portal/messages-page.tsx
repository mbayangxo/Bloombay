"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function MessagesPage() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get("plan");

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
          MESSAGES
        </p>
        <h1
          className="text-3xl font-bold italic mb-6"
          style={{ fontFamily: "var(--font-playfair)", color: "#111" }}
        >
          {planSlug ? "Plan group chat" : "Chats"}
        </h1>

        <div className="rounded-3xl p-8 text-center bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "36px" }}>{planSlug ? "💬" : "✉️"}</p>
          <p className="font-bold text-lg mt-3 mb-2" style={{ color: "#111" }}>
            {planSlug ? "Your plan chat is ready" : "No messages yet"}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
            {planSlug
              ? `When the host opens the room for "${planSlug}", your group thread will live here alongside your other chats.`
              : "When you join clubs, RSVP to happenings, or enter a plan room, your real conversations will show here. We don't fill this with fake chats."}
          </p>
          {planSlug ? (
            <Link
              href="/member/plans?tab=rooms"
              className="inline-block mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Back to plan rooms →
            </Link>
          ) : (
            <Link
              href="/member/clubs"
              className="inline-block mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Browse clubs →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
