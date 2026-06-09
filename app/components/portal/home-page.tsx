"use client";

import { HomeScrapbookBoard } from "./home-scrapbook-board";
import { HomeScrapbookHeader } from "./home-scrapbook-header";

/** Member home — separate mobile + desktop scrapbook layouts. */
export function HomePage({
  firstName = "there",
  initial = "M",
  userId = null,
}: {
  firstName?: string;
  initial?: string;
  userId?: string | null;
}) {
  return (
    <div className="bb-home-page min-h-screen pb-[calc(3.25rem+env(safe-area-inset-bottom,0px))] lg:pb-12 mp-home-scroll">
      <HomeScrapbookHeader initial={initial} />
      <HomeScrapbookBoard firstName={firstName} userId={userId} />
    </div>
  );
}
