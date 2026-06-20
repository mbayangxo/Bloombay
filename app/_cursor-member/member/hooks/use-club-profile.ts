"use client";

import { useEffect, useState } from "react";
import { getStoredJoinSettings } from "@/lib/club-host-store";
import { getClubBranding } from "@/lib/club-owner-store";
import {
  getClubProfile,
  mergeClubBranding,
  mergeStoredJoinSettings,
  type ClubProfile,
} from "@/lib/club-world-data";

export function useClubProfile(id: string): ClubProfile | undefined {
  const base = getClubProfile(id);
  const [club, setClub] = useState<ClubProfile | undefined>(base);

  useEffect(() => {
    const profile = getClubProfile(id);
    if (!profile) {
      setClub(undefined);
      return;
    }
    const merged = mergeStoredJoinSettings(profile, getStoredJoinSettings(id));
    setClub(mergeClubBranding(merged, getClubBranding(id)));
  }, [id]);

  return club;
}
