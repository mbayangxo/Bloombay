"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getYandeNudge, getYandeSuggestions, type YandeNudge, type YandeSuggestion } from "@/lib/yande-recommendations";
import { readYandeMemberState } from "@/lib/yande-member-state";

const DEFAULT_NUDGE: YandeNudge = {
  kicker: "From Yande",
  title: "Your Daily Bloom",
  preface: "A little nudge from Yande",
  message: "Explore BloomBay — clubs, Seats, and your inner circle are ready when you are.",
  cta: "Open Happenings",
  href: "/member/happenings",
};

export function YandeDailyBloom({
  variant = "velvet",
  square = false,
}: {
  variant?: "velvet" | "ivory";
  square?: boolean;
}) {
  const [nudge, setNudge] = useState<YandeNudge>(DEFAULT_NUDGE);
  const [suggestions, setSuggestions] = useState<YandeSuggestion[]>([]);

  useEffect(() => {
    const state = readYandeMemberState();
    setNudge(getYandeNudge(state));
    setSuggestions(getYandeSuggestions(state));
  }, []);

  return (
    <article
      className={`yande-daily-bloom${variant === "ivory" ? " yande-daily-bloom--ivory" : ""}${square ? " yande-daily-bloom--square" : ""}`}
    >
      <div className="yande-daily-bloom__inner">
        <span className="yande-daily-bloom__icon" aria-hidden>
          <Image src="/bloom-assets/bloombay%20objects/bloom-bouquet.svg" alt="" width={square ? 28 : 22} height={square ? 28 : 22} unoptimized />
        </span>
        <p className="yande-daily-bloom__kicker">{nudge.kicker}</p>
        <h2 className="yande-daily-bloom__title">{nudge.title}</h2>
        {!square && nudge.preface ? <p className="yande-daily-bloom__preface">{nudge.preface}</p> : null}
        <p className="yande-daily-bloom__message">{nudge.message}</p>
        <Link href={nudge.href} className="yande-daily-bloom__cta">
          {nudge.cta}
        </Link>
        {!square && suggestions.length > 0 ? (
          <div className="yande-daily-bloom__suggestions">
            {suggestions.map((s) => (
              <Link key={s.href} href={s.href} className="yande-daily-bloom__chip">
                {s.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
