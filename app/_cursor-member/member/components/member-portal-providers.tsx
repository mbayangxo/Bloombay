"use client";

import { DayNightTheme } from "@/app/components/member/day-night-theme";
import { SeasonalDecor } from "@/app/components/member/seasonal-decor";
import { MemberShellHost } from "./member-shell-context";

/** Theme, shell chrome, and decor once per member session — not per page. */
export function MemberPortalProviders({ children }: { children: React.ReactNode }) {
  return (
    <div className="mp-member-root flex h-dvh max-h-dvh flex-col overflow-hidden antialiased">
      <DayNightTheme />
      <SeasonalDecor />
      <MemberShellHost>{children}</MemberShellHost>
    </div>
  );
}
