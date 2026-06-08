/** Member discover hub — seats, happenings, clubs, requests, favorites */

import { CLUBS } from "@/app/member/clubs/club-data";
import { GATHERINGS, INVITATIONS, SEATS_VENUES } from "@/lib/member-portal-data";

export const DISCOVER_OPEN_SEATS = SEATS_VENUES.slice(0, 4).map((s) => ({
  id: s.id,
  title: s.name,
  meta: `${s.area} · ${s.capacity}`,
  href: "/member/happenings/seats",
}));

export const DISCOVER_HAPPENINGS = GATHERINGS.slice(0, 5).map((g) => ({
  id: g.id,
  title: g.title,
  meta: `${g.date} · ${g.neighborhood}`,
  href: `/member/happenings/gatherings/${g.id}`,
}));

export const DISCOVER_NEW_CLUBS = CLUBS.slice(0, 6).map((c) => ({
  id: c.id,
  title: c.name,
  meta: `${c.category} · ${c.members.toLocaleString()} members`,
  href: `/member/clubs/${c.id}`,
}));

export const DISCOVER_BLOOM_REQUESTS = [
  { id: "br1", title: "Maya wants to connect", meta: "Met at rooftop dinner", href: "/member/bloom-request" },
  { id: "br2", title: "Priya sent a Bloom request", meta: "Book club · mutual friends", href: "/member/bloom-request" },
];

export const DISCOVER_CITY_FAVORITES = [
  { id: "cf1", title: "The Rose Room", meta: "Girl favorite · West Village · 40 seats", href: "/member/maps" },
  { id: "cf2", title: "Sunday Supper Club", meta: "Nolita · reservations open", href: "/member/eats" },
  { id: "cf3", title: "Pier A sunset walk", meta: "Solo-friendly · tonight", href: "/member/happenings?tab=solo" },
];

export const DISCOVER_ACTIONS = [
  { label: "Reserve a seat", href: "/member/happenings/seats" },
  { label: "Join a club", href: "/member/clubs" },
  { label: "RSVP happening", href: "/member/happenings" },
  { label: "Accept invite", href: "/member/mailbox" },
] as const;

export const INVITATIONS_PREVIEW = INVITATIONS.slice(0, 3);
