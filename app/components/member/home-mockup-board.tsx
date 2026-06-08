"use client";

import { useHomeMockupData } from "@/app/hooks/use-home-mockup-data";
import { HomeMockupDesktop } from "./home-mockup-desktop";
import { HomeMockupMobile } from "./home-mockup-mobile";

/** Renders separate mobile + desktop scrapbook layouts (not one scaled layout). */
export function HomeMockupBoard({ userId }: { firstName?: string; userId?: string | null }) {
  const data = useHomeMockupData(userId);

  return (
    <>
      <div className="bb-home-layout bb-home-layout--mobile">
        <HomeMockupMobile data={data} />
      </div>
      <div className="bb-home-layout bb-home-layout--desktop">
        <HomeMockupDesktop data={data} />
      </div>
    </>
  );
}
