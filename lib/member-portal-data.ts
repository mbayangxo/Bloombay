/** Member portal UI seed data */

export const DAILY_BLOOM = {
  label: "Daily bloom",
  quote: "You don't need company to have the best time — but your girls make it unforgettable.",
};

export const CITY_HAPPENINGS = [
  {
    id: "g1",
    title: "Rooftop Sunset Dinner",
    when: "Tonight · 7:30 PM",
    spots: "6 spots left",
    gradient: "linear-gradient(135deg, #ffb7ce, #ff2d8a)",
  },
  {
    id: "g2",
    title: "Pilates Morning Flow",
    when: "Tomorrow · 9:00 AM",
    spots: "8 spots left",
    gradient: "linear-gradient(135deg, #ffb7ce, #ff2d8a)",
  },
];

export const UPCOMING = [
  {
    id: "u1",
    title: "Pottery Making",
    when: "Sun, May 25 · 2:00 PM",
    place: "Williamsburg",
    href: "/member/happenings/gatherings/g1",
  },
  {
    id: "u2",
    title: "Brunch Club",
    when: "Sat, May 24 · 11:00 AM",
    place: "Soho",
    href: "/member/happenings/gatherings/g2",
  },
];

export const HAPPENING_TABS = [
  { id: "invitations", label: "Invitations", href: "/member/happenings?tab=invitations" },
  { id: "gatherings", label: "Gatherings", href: "/member/happenings?tab=gatherings" },
  { id: "city", label: "In the city", href: "/member/happenings?tab=city" },
  { id: "solo", label: "Solo", href: "/member/happenings?tab=solo" },
  { id: "seats", label: "Seats", href: "/member/happenings/seats" },
  { id: "confetti", label: "Confetti", href: "/member/happenings?tab=invitations#confetti" },
  { id: "maps", label: "Maps & Eats", href: "/member/maps" },
  { id: "bulletin", label: "Bulletin", href: "/member/bulletin" },
] as const;

export const CITY_HAPPENING_FEED = [
  { title: "Rooftop Sunset", when: "Tonight · 7:30 PM", where: "Williamsburg" },
  { title: "Girls dinner · SoHo", when: "8:00 PM", where: "Sant Ambroeus" },
  { title: "Pilates flow", when: "Tomorrow · 9 AM", where: "Chelsea" },
];

export const CITY_ALONE = [
  { title: "Morning walk + coffee", hint: "West Village · self-guided" },
  { title: "Museum afternoon", hint: "The Met · solo reset" },
  { title: "Journal at the park", hint: "Central Park · no RSVP needed" },
];

export const INVITATIONS = [
  {
    id: "inv1",
    gatheringId: "g1",
    title: "Rooftop Dinner",
    host: "Amanda R.",
    when: "Sat, May 24 · 7:00 PM",
    place: "Williamsburg",
    joined: 5,
    status: "new" as const,
  },
  {
    id: "inv2",
    gatheringId: "g2",
    title: "Birthday Reset",
    host: "Lexi",
    when: "Today",
    place: "Chelsea",
    joined: 15,
    status: "open" as const,
  },
] as const;

export function invitationGatheringHref(inv: (typeof INVITATIONS)[number]): string {
  return `/member/happenings/gatherings/${inv.gatheringId}`;
}

export const GATHERINGS = [
  {
    id: "g1",
    title: "Saturday in Soho",
    subtitle: "An intimate dinner for women who romanticize their lives",
    date: "May 24",
    time: "8:00 PM",
    table: "07",
    venue: "Sant Ambroeus",
    neighborhood: "SoHo",
    deposit: 25,
    ticket: 65,
    minSpend: 80,
    total: 170,
    chemistry: 94,
    attendees: ["S", "M", "K", "P", "A", "J"],
    extra: 2,
  },
  {
    id: "g2",
    title: "Wine & Girl Talk",
    subtitle: "Soft evening, deep conversation",
    date: "May 25",
    time: "7:30 PM",
    table: "12",
    venue: "Café Lume",
    neighborhood: "Williamsburg",
    deposit: 0,
    ticket: 0,
    minSpend: 0,
    total: 0,
    chemistry: 88,
    attendees: ["L", "N", "R"],
    extra: 0,
  },
];

export const SEATS_VENUES = [
  { id: "s1", name: "Sant Ambroeus", area: "SoHo", capacity: "Inside · 4", spotsLeft: 4, saved: true },
  { id: "s2", name: "Café Lume", area: "Williamsburg", capacity: "Patio · 6", spotsLeft: 6, saved: false },
  { id: "s3", name: "The Loft House", area: "Brooklyn", capacity: "Private room · 12", spotsLeft: 12, saved: false },
];

export const CELEBRATE_POSTS = [
  { id: "c1", title: "Birthday Reset", host: "Lexi", likes: 15, comments: 8, when: "Today" },
  { id: "c2", title: "Night In | Soft Girl Recharge", host: "Brie", likes: 8, comments: 4, when: "Tomorrow" },
];

export const LOUNGE_SPACES = [
  { id: "tonight", title: "Tonight", sub: "What's on in your city", tone: "linear-gradient(160deg,#ff2d8a,#121212)", href: "/member/tonight" },
  { id: "living", title: "Living room", sub: "Your pulse & invites", tone: "linear-gradient(160deg,#ffb7ce,#ff2d8a)", href: "/member/lounge" },
  { id: "maps", title: "Maps & eats", sub: "Girl favorites", tone: "linear-gradient(160deg,#121212,#ff2d8a)", href: "/member/maps" },
  { id: "bulletin", title: "Bulletin", sub: "Questions & city notes", tone: "linear-gradient(160deg,#ffe4ec,#ffb7ce)", href: "/member/bulletin" },
  { id: "mailbox", title: "Mailbox", sub: "Messages & pings", tone: "linear-gradient(160deg,#ff2d8a,#ffb7ce)", href: "/member/mailbox" },
];

export const CHECKIN_SPOTS = [
  { id: "cafe-lune", name: "Café Lune", hood: "West Village" },
  { id: "soho-park", name: "Soho Park", hood: "Soho" },
  { id: "amano", name: "Amano Cafe", hood: "Chelsea" },
  { id: "met", name: "The Met", hood: "Upper East" },
];

export const CLUB_INTERESTS = [
  "Book club",
  "Wellness",
  "Travel",
  "Founders",
  "Dinner",
  "Faith",
  "Creative",
  "Mothers",
];

export const ONBOARDING_QUESTIONS = [
  "What brought you to BloomBay?",
  "Are you here for clubs, gatherings, or both?",
  "How often do you want to meet IRL?",
];
