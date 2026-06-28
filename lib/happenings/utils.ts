import type { Event } from "@/lib/actions/events";
import { inferEventType } from "@/lib/events/infer-event-type";
import type { EventCardData } from "@/app/components/portal/event-card-templates";

export function toCardData(ev: Event): EventCardData {
  const d = new Date(ev.starts_at);
  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return {
    id: ev.id,
    type: inferEventType(ev),
    title: ev.title,
    host: ev.host_name ?? undefined,
    location: ev.venue ?? ev.neighborhood ?? ev.city,
    date: dateStr,
    time: timeStr,
    spotsLeft: ev.spots_left ?? undefined,
    going: ev.attending_count,
    accentColor: ev.accent_color ?? undefined,
    href: `/member/happenings/${ev.slug ?? ev.id}`,
  };
}

export function getPageBg(): string {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "linear-gradient(170deg, #FF1F7D 0%, #FF69A8 45%, #FFB3D4 100%)";
  if (h >= 12 && h < 17) return "linear-gradient(170deg, #E8006A 0%, #FF4499 45%, #FF9CC8 100%)";
  if (h >= 17 && h < 21) return "linear-gradient(170deg, #C0004A 0%, #E8006A 45%, #FF4499 100%)";
  return "linear-gradient(170deg, #3A0018 0%, #720034 45%, #C0004A 100%)";
}

export function getNavBg(): string {
  const h = new Date().getHours();
  if (h >= 21 || h < 5) return "rgba(58,0,24,0.96)";
  return "rgba(232,0,106,0.96)";
}

export function getBadge(ev: Event): string {
  if (ev.badge) return ev.badge;
  const dt = new Date(ev.starts_at);
  const now = new Date();
  const diffH = (dt.getTime() - now.getTime()) / 36e5;
  if (diffH <= 0 && diffH > -6) return "TONIGHT";
  if (diffH > 0 && diffH <= 10) return "TONIGHT";
  if (diffH > 0 && diffH <= 60) return "THIS WEEKEND";
  return "";
}

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function fmtShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export { matchesTypeFilter as matchesFilter, matchesCategoryFilter } from "@/lib/events/search";
