import { SESSION_PARTNER_SLUG } from "@/lib/partner-brand/store";
import type { BoomDrop, BoomDropKind } from "./types";

const STORAGE_KEY = "bb_partner_boom_drops";

function uid() {
  return `bd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAll(): BoomDrop[] {
  if (typeof window === "undefined") return seedDrops();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeds = seedDrops();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
      return seeds;
    }
    return JSON.parse(raw) as BoomDrop[];
  } catch {
    return seedDrops();
  }
}

function writeAll(drops: BoomDrop[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drops));
}

function seedDrops(): BoomDrop[] {
  const until = new Date();
  until.setDate(until.getDate() + 14);
  return [
    {
      id: "bd-seed-1",
      partnerSlug: SESSION_PARTNER_SLUG,
      title: "BloomBay brunch drop",
      caption: "Show your BloomBay app · 20% off saffron pasta + complimentary spritz",
      kind: "percent_off",
      buyItem: "Saffron pasta",
      percentOff: 20,
      validUntil: until.toISOString().slice(0, 10),
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function listDropsForPartner(slug: string, activeOnly = false): BoomDrop[] {
  const all = readAll().filter((d) => d.partnerSlug === slug);
  if (!activeOnly) return all;
  const today = new Date().toISOString().slice(0, 10);
  return all.filter(
    (d) => d.active && (!d.validUntil || d.validUntil >= today)
  );
}

export function saveDrop(
  drop: Omit<BoomDrop, "id" | "createdAt"> & { id?: string }
): BoomDrop {
  const all = readAll();
  const entry: BoomDrop = {
    id: drop.id ?? uid(),
    partnerSlug: drop.partnerSlug,
    title: drop.title.trim(),
    caption: drop.caption.trim(),
    kind: drop.kind,
    buyItem: drop.buyItem.trim(),
    getItem: drop.getItem?.trim(),
    percentOff: drop.percentOff,
    validUntil: drop.validUntil,
    active: drop.active,
    createdAt: drop.id ? all.find((d) => d.id === drop.id)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
  };
  const next = drop.id ? all.map((d) => (d.id === drop.id ? entry : d)) : [entry, ...all];
  writeAll(next);
  return entry;
}

export function deleteDrop(id: string) {
  writeAll(readAll().filter((d) => d.id !== id));
}

export function dropSummary(drop: BoomDrop): string {
  if (drop.kind === "percent_off") {
    return `${drop.percentOff ?? 0}% off ${drop.buyItem}`;
  }
  if (drop.kind === "bogo") {
    return `Buy ${drop.buyItem} · get ${drop.getItem ?? "one free"}`;
  }
  return `${drop.buyItem} + ${drop.getItem ?? "bonus item"} bundle`;
}

export function defaultCaption(kind: BoomDropKind, buyItem: string, getItem?: string, percentOff?: number): string {
  if (kind === "percent_off") {
    return `BloomBay exclusive · ${percentOff ?? 15}% off ${buyItem} this week`;
  }
  if (kind === "bogo") {
    return `Buy ${buyItem}, get ${getItem ?? "a second on us"} — show BloomBay at the door`;
  }
  return `Bundle: ${buyItem} + ${getItem ?? "chef's pick"} · members only`;
}
