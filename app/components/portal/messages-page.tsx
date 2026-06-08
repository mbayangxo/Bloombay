"use client";

import Link from "next/link";

export function MessagesPage() {
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
          Inbox
        </h1>

        <div className="rounded-3xl p-8 text-center bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "36px" }}>✉️</p>
          <p className="font-bold text-lg mt-3 mb-2" style={{ color: "#111" }}>
            No messages yet
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
            When you connect with Bloomies, join clubs, or enter a plan room, your real conversations will show here.
            We don&apos;t fill this with fake chats.
          </p>
          <Link
            href="/member/match"
            className="inline-block mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
            style={{ background: "#FF1F7D" }}
          >
            Go to Connect →
          </Link>
        </div>
      </div>
    </div>
  );
}
