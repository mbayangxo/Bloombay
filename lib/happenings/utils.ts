import type { Event } from "@/lib/actions/events";
import { inferEventType } from "@/lib/events/infer-event-type";
import type { EventCardData } from "@/app/components/portal/event-card-templates";
import type { Filter, CategoryFilter } from "./types";

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

export function matchesFilter(ev: Event, filter: Filter): boolean {
  if (filter === "All" || filter === "Events") return true;
  if (filter === "Dinners") return ev.event_type === "dinner" || ev.event_type === "brunch";
  if (filter === "Parties") return ev.event_type === "party" || ev.event_type === "rooftop" || ev.event_type === "social";
  if (filter === "Gatherings") return ev.event_type === "gathering" || ev.event_type === "casual" || ev.event_type === "walk";
  if (filter === "Club Gatherings") return ev.event_type === "club" || ev.event_type === "club_event";
  if (filter === "Invitations") return ev.event_type === "invitation" || ev.event_type === "private";
  if (filter === "Open Seats") return ev.event_type === "open_seat";
  if (filter === "Tables") return ev.event_type === "table" || ev.event_type === "reservation";
  if (filter === "Confetti") return ev.event_type === "confetti" || ev.event_type === "spontaneous";
  return true;
}

export function matchesCategoryFilter(ev: Event, cat: CategoryFilter): boolean {
  if (cat === "all") return true;
  const t = ((ev.event_type ?? "") + " " + ev.title).toLowerCase();
  if (cat === "arts")   return /museum|gallery|art|exhibition|creative|design|craft/.test(t);
  if (cat === "eat")    return /brunch|dinner|lunch|meal|food|restaurant|dining|tasting|breakfast|supper|feast/.test(t);
  if (cat === "music")  return /concert|music|show|performance|vinyl|jazz|festival|dj|band|live/.test(t);
  if (cat === "books")  return /book|reading|writing|literary|poetry|bagels|literature/.test(t);
  if (cat === "active") return /walk|run|hike|outdoor|fitness|yoga|sports|trip|road|cycling|bike/.test(t);
  if (cat === "drinks") return /wine|cocktail|bar|drinking|aperitivo|happy hour|rosé|spirits|champagne|prosecco/.test(t);
  if (cat === "film")   return /film|movie|cinema|screening|documentary|watch/.test(t);
  if (cat === "dance")  return /dance|dancing|club|nightlife|party|rave/.test(t);
  return true;
}

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function fmtShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
