"use client";

import Link from "next/link";
import { PinIcon } from "./pin-icon";

export function PinDropsPage() {
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/member/home"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <PinIcon size={18} />
            <h1
              className="text-3xl font-bold italic"
              style={{ fontFamily: "var(--font-playfair)", color: "#111" }}
            >
              Pin drops
            </h1>
          </div>
        </div>
        <div className="h-0.5 w-10 rounded-full mb-6" style={{ background: "#FF1F7D" }} />

        <div className="rounded-3xl p-8 text-center bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div
            className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(255,31,125,0.1)" }}
          >
            <PinIcon size={22} />
          </div>
          <p className="font-bold text-lg mb-2" style={{ color: "#111" }}>
            No pin drops yet
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
            When someone saves you a seat, witnesses you, or a club you follow posts something real, it lands here —
            not fake alerts.
          </p>
        </div>
      </div>
    </div>
  );
}
