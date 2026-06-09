"use client";

import { usePathname } from "next/navigation";
import { PortalIcons } from "./portal-icons";
import { shouldHideBottomNav } from "@/lib/member-nav";

/** Global top-right utility icons on all member pages except home (home header has its own). */
export function PortalFixedIcons({ initial = "M" }: { initial?: string }) {
  const pathname = usePathname();
  if (pathname === "/member/home" || shouldHideBottomNav(pathname)) return null;

  return (
    <div className="bb-portal-fixed-icons fixed z-50 flex items-center" style={{ top: "14px", right: "20px" }}>
      <PortalIcons initial={initial} />
    </div>
  );
}
