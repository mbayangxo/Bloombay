"use client";

import { useState } from "react";

type CityTab = "eat" | "go" | "solo" | "trending";

const TAB_LABELS: { key: CityTab; label: string }[] = [
  { key: "eat", label: "Eat" },
  { key: "go", label: "Go" },
  { key: "solo", label: "Solo" },
  { key: "trending", label: "Trending" },
];

const EMPTY_COPY: Record<CityTab, { title: string; body: string }> = {
  eat: {
    title: "No restaurant picks yet",
    body: "When Bloomies submit real spots they love, women's picks will show here — not placeholder restaurants.",
  },
  go: {
    title: "No places to go yet",
    body: "Museums, parks, and experiences land here once members share what they actually did in the city.",
  },
  solo: {
    title: "No solo spots yet",
    body: "Solo-friendly picks come from real women on BloomBay. We're not seeding fake cafés or parks.",
  },
  trending: {
    title: "Nothing trending yet",
    body: "Trending dishes, neighborhoods, and stats appear when enough real saves and visits exist.",
  },
};

function CityEmpty({ tab }: { tab: CityTab }) {
  const copy = EMPTY_COPY[tab];
  return (
    <div
      className="rounded-3xl p-8 text-center bg-white mx-5 md:mx-10"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
    >
      <p style={{ fontSize: "36px" }}>🗽</p>
      <p
        className="font-black mt-3 mb-2"
        style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "#111" }}
      >
        {copy.title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
        {copy.body}
      </p>
    </div>
  );
}

export function CityPage() {
  const [tab, setTab] = useState<CityTab>("eat");

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 md:px-10 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
          ✦ THE CITY
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
          NYC picks.
        </h1>
        <p className="text-sm italic mt-1 mb-5" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
          Where women eat, go, and go solo — only real submissions.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {TAB_LABELS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={
                tab === t.key
                  ? { background: "#FF1F7D", color: "white" }
                  : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 max-w-2xl mx-auto">
        <CityEmpty tab={tab} />
      </div>
    </div>
  );
}
