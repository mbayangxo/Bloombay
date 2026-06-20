/**
 * Introductions (Intros) — organized around moments women actually live —
 * not feature categories.
 */

export type ConnectMoment = {
  id: string;
  emoji: string;
  scene: string;
  living: string;
  cast: string;
  cta: string;
  href: string;
  tone?: "pulse" | "warm" | "travel" | "seat";
};

export const CONNECT_MOMENTS: ConnectMoment[] = [
  {
    id: "travel-morocco",
    emoji: "✈️",
    scene: "Looking for Morocco in October?",
    living: "7 women in Wander Women are planning a trip.",
    cast: "Amina is building the itinerary. Sofia already booked flights.",
    cta: "Join the conversation",
    href: "/member/clubs/wander-women/world",
    tone: "travel",
  },
  {
    id: "brunch-sunday",
    emoji: "🥂",
    scene: "Brunch this Sunday in SoHo?",
    living: "4 women saved seats at Sunday Supper Club.",
    cast: "Chloé is hosting the table — two spots still whisper-open.",
    cta: "See the table in Happenings",
    href: "/member/happenings/gatherings/g1",
    tone: "warm",
  },
  {
    id: "just-moved",
    emoji: "🔑",
    scene: "I just moved — need a girl mate?",
    living: "6 women asked on Girlmates this week.",
    cast: "Roommates in Williamsburg · broker questions in Bushwick · summer subleases.",
    cta: "Open Girlmates",
    href: "/member/intros/girl-mates",
    tone: "warm",
  },
  {
    id: "museum-seat",
    emoji: "🎭",
    scene: "Reserve a seat with Amina at Museum Girls?",
    living: "You both lingered on Culture Crawl and Sunday Walk.",
    cast: "Yande thinks you'd like the same gallery night — seat open Friday.",
    cta: "Hold the seat",
    href: "/member/happenings/seats",
    tone: "seat",
  },
  {
    id: "founders-coffee",
    emoji: "💡",
    scene: "Building something and want founder friends?",
    living: "12 women are in Founders in the Making tonight.",
    cast: "Office hours at 6 · bring one hard question.",
    cta: "Enter the club",
    href: "/member/clubs/founders-in-the-making",
    tone: "warm",
  },
  {
    id: "moms-hood",
    emoji: "🌸",
    scene: "Moms nearby — same block, same rhythm?",
    living: "5 mothers in Wellness Circle matched your neighborhood.",
    cast: "Morning walks + school-drop coffee — no performance.",
    cta: "Bloom with moms nearby",
    href: "/member/intros/bloom-requests",
    tone: "pulse",
  },
];

export const CONNECT_OPENING = {
  tagline: "Between you and her",
  scene: "A text you were hoping to get.",
  whisper: "Moments, not menus — who is already moving toward you?",
};
