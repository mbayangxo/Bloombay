"use client";

import { HomeMockupBoard } from "@/app/components/member/home-mockup-board";

export function HomeScrapbookBoard({
  firstName,
  userId,
}: {
  firstName: string;
  userId?: string | null;
}) {
  return <HomeMockupBoard firstName={firstName} userId={userId} />;
}
