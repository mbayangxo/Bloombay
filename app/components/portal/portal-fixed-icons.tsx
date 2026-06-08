"use client";

import { usePathname } from "next/navigation";
import { PortalIcons } from "./portal-icons";

/** Global top-right icons — hidden on home (home has its own scrapbook header). */
export function PortalFixedIcons({ initial = "M" }: { initial?: string }) {
  const pathname = usePathname();
  if (pathname === "/member/home") return null;

  return (
    <div className="bb-portal-fixed-icons fixed z-50 flex items-center" style={{ top: "14px", right: "20px" }}>
      <PortalIcons initial={initial} />
    </div>
  );
}
