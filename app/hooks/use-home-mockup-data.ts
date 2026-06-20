"use client";

import { useEffect, useState } from "react";
import type { PortalClub } from "@/lib/clubs/types";

export type HomeGathering = {
  id: string;
  title: string;
  slug?: string;
  starts_at?: string;
  area?: string;
  neighborhood?: string;
};

export function formatGatheringWhen(iso?: string) {
  if (!iso) return "Soon";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Soon";
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  return `${day} · ${time}`;
}

export function formatMemberCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return n > 0 ? String(n) : "—";
}

export function useHomeMockupData(userId?: string | null) {
  const [clubs, setClubs] = useState<PortalClub[]>([]);
  const [gatherings, setGatherings] = useState<HomeGathering[]>([]);
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const [connectPhoto, setConnectPhoto] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/clubs")
      .then((r) => (r.ok ? r.json() : { clubs: [] }))
      .then((j) => setClubs(j.clubs ?? []))
      .catch(() => undefined);

    void fetch("/api/member/gatherings")
      .then((r) => (r.ok ? r.json() : { gatherings: [] }))
      .then((j) => setGatherings(j.gatherings ?? []))
      .catch(() => undefined);

    void fetch("/api/home/glance")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const photos = [
          data.avatarUrl,
          ...(data.profilePhotos ?? []).map((p: { image_url?: string }) => p.image_url),
          ...(data.memories ?? []).map((m: { image_url?: string }) => m.image_url),
        ].filter(Boolean) as string[];
        if (photos[0]) setHeroPhoto(photos[0]);
        if (photos[1]) setConnectPhoto(photos[1]);
        else if (photos[0]) setConnectPhoto(photos[0]);
      })
      .catch(() => undefined);
  }, []);

  const featured = clubs.slice(0, 5);
  const spotlightClub =
    clubs.find((c) => c.slug.includes("museum") || c.slug.includes("culture")) ?? clubs[0];
  const happenings = gatherings.slice(0, 5);

  return {
    userId,
    clubs,
    featured,
    spotlightClub,
    happenings,
    heroPhoto,
    connectPhoto,
  };
}

export type HomeMockupData = ReturnType<typeof useHomeMockupData>;
