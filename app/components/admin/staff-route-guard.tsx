"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canMissionControl, capabilityForStaffPath } from "@/lib/auth/mission-control";
import { useMissionControlRole } from "./mission-control-provider";

export function StaffRouteGuard({
  portal,
  children,
}: {
  portal: "founder" | "admin";
  children: React.ReactNode;
}) {
  const role = useMissionControlRole();
  const pathname = usePathname();
  const router = useRouter();
  const home = portal === "founder" ? "/founder/dashboard" : "/admin/dashboard";

  useEffect(() => {
    const cap = capabilityForStaffPath(pathname, portal);
    if (cap && !canMissionControl(role, cap)) {
      router.replace(home);
    }
  }, [pathname, role, router, home, portal]);

  return children;
}
