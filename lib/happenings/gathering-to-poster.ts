import type { PosterTemplateData } from "@/lib/poster-templates/types";
import { getEventTypeMeta, getVariant } from "./event-type-templates";

export type DbGathering = {
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  area?: string | null;
  venue?: string | null;
  neighborhood?: string | null;
  capacity?: number;
  spots_left?: number;
  club_slug?: string | null;
  event_type?: string | null;
  poster_variant?: string | null;
  image_url?: string | null;
  description?: string | null;
  price_cents?: number | null;
  host_name?: string | null;
};

function formatDate(iso: string): { date: string; time: string; timeLabel: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { date, time, timeLabel: `${date} · ${time}` };
}

function priceLabel(cents: number | null | undefined): string {
  if (!cents || cents <= 0) return "Free";
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function gatheringToPoster(g: DbGathering): PosterTemplateData {
  const template = (g.event_type as PosterTemplateData["template"] | null) ?? "dinner";
  const meta = getEventTypeMeta(template);
  const variant = getVariant(template, g.poster_variant ?? "");
  const { date, time } = formatDate(g.starts_at);
  const location = [g.venue, g.neighborhood ?? g.area].filter(Boolean).join(" · ") || "NYC";

  return {
    id: g.slug,
    template,
    title: g.title,
    category: meta.categoryLabel,
    date,
    time,
    location,
    seatsLeft: g.spots_left ?? g.capacity,
    hostName: g.host_name ?? undefined,
    imageUrl: g.image_url ?? variant.stockImageUrl,
    accentColor: variant.accentColor,
    ctaLabel: "View happening",
    href: `/member/happenings/${g.slug}`,
  };
}

export function gatheringPriceLabel(g: DbGathering): string {
  return priceLabel(g.price_cents);
}
