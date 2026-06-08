"use client";

import { HomeScrapbookBoard } from "./home-scrapbook-board";
import { HomeScrapbookHeader } from "./home-scrapbook-header";

/** Member home — scrapbook collage mock-up only (no extra feed sections). */
export function HomePage({
  firstName = "there",
  userId = null,
}: {
  firstName?: string;
  initial?: string;
  userId?: string | null;
}) {
  return (
    <div className="min-h-screen pb-24 md:pb-12 mp-home-scroll bb-home-page">
      <HomeScrapbookHeader />
      <HomeScrapbookBoard firstName={firstName} userId={userId} />
    </div>
  );
}
