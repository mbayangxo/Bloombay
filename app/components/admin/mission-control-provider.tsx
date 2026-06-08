"use client";

import { createContext, useContext } from "react";
import type { UserRole } from "@/lib/auth/roles";
import { mcPath, type StaffBase } from "@/lib/mc-paths";

type McContext = { role: UserRole; staffBase: StaffBase };

const MissionControlContext = createContext<McContext | null>(null);

export function MissionControlProvider({
  role,
  staffBase = "/admin",
  children,
}: {
  role: UserRole;
  staffBase?: StaffBase;
  children: React.ReactNode;
}) {
  return (
    <MissionControlContext.Provider value={{ role, staffBase }}>
      {children}
    </MissionControlContext.Provider>
  );
}

export function useMissionControlRole(): UserRole {
  const ctx = useContext(MissionControlContext);
  if (!ctx) throw new Error("useMissionControlRole must be used within MissionControlProvider");
  return ctx.role;
}

export function useStaffBase(): StaffBase {
  const ctx = useContext(MissionControlContext);
  if (!ctx) throw new Error("useStaffBase must be used within MissionControlProvider");
  return ctx.staffBase;
}

export function useMcPath(): (href: string) => string {
  const base = useStaffBase();
  return (href: string) => mcPath(href, base);
}
