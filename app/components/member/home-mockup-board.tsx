"use client";

import { useHomeMockupData } from "@/app/hooks/use-home-mockup-data";
import { HomeScrapbookCollage } from "./home-scrapbook-collage";

/** Single overlapping scrapbook canvas — mobile + desktop spreads. */
export function HomeMockupBoard({ userId }: { firstName?: string; userId?: string | null }) {
  const data = useHomeMockupData(userId);
  return <HomeScrapbookCollage data={data} />;
}
