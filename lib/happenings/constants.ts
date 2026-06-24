import type { Filter, CategoryFilter } from "./types";

export const PINK   = "#FF1F7D";
export const DARK   = "#1C1B1C";
export const CREAM  = "#F6F1EB";
export const NAV_BG = "#F6F1EB";

export const AV_COLORS = ["#FF1F7D","#FF5BAD","#E8006A","#C80060","#A8004C","#FF85C0","#FF3D94"];

export const POSTER_IMGS = [
  "/happenings/posters/01_Girls_Night.png",
  "/happenings/posters/02_Save_The_Date_Aperitivo.png",
  "/happenings/posters/03_Vinyl_Night_Jazz.png",
  "/happenings/posters/04_Italian_Dinner_Society.png",
  "/happenings/posters/05_Film_Club.png",
  "/happenings/posters/06_Dance_All_Night.png",
  "/happenings/posters/07_Sunday_Brunch_Club.png",
  "/happenings/posters/08_Rooftop_Sessions.png",
  "/happenings/posters/09_Bagels_And_Books.png",
  "/happenings/posters/10_Ladies_First_Road_Trip.png",
];

export const TICKET_IMGS = [
  "/tickets templates/Ticket_Dinner_Society.png",
  "/tickets templates/Ticket_Girls_Night.png",
  "/tickets templates/Ticket_Museum_Exhibition.png",
  "/tickets templates/Ticket_NYC_Marrakech.png",
];

export const CLUB_IMGS = [
  "/club gatherings,casual gatherings templates/Event_Book_Society.png",
  "/club gatherings,casual gatherings templates/Event_Dinner_Society.png",
  "/club gatherings,casual gatherings templates/Event_Museum_Girls.png",
  "/club gatherings,casual gatherings templates/Event_Sunday_Walk.png",
];

export const CSS = `
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes fabPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
.sign-s1 { transform-origin: center center; animation: swayS1 3.2s ease-in-out infinite; }
.sign-s2 { transform-origin: center center; animation: swayS2 2.9s ease-in-out 0.5s infinite; }
.sign-s3 { transform-origin: center center; animation: swayS3 3.5s ease-in-out 0.2s infinite; }
.sign-s4 { transform-origin: center center; animation: swayS4 2.7s ease-in-out 0.8s infinite; }
.sign-s5 { transform-origin: center center; animation: swayS5 3.1s ease-in-out 0.3s infinite; }
.sign-s6 { transform-origin: center center; animation: swayS6 2.8s ease-in-out 0.7s infinite; }
.sign-s7 { transform-origin: center center; animation: swayS7 3.3s ease-in-out 0.1s infinite; }
@keyframes swayS1 { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(-4.5deg) translateY(1px); } }
@keyframes swayS2 { 0%,100% { transform: rotate(2.5deg); } 50% { transform: rotate(4.5deg) translateY(1px); } }
@keyframes swayS3 { 0%,100% { transform: rotate(-1.5deg); } 50% { transform: rotate(-3.5deg) translateY(1px); } }
@keyframes swayS4 { 0%,100% { transform: rotate(1deg); } 50% { transform: rotate(3deg) translateY(1px); } }
@keyframes swayS5 { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(-5.5deg) translateY(1px); } }
@keyframes swayS6 { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(4.5deg) translateY(1px); } }
@keyframes swayS7 { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(-3deg) translateY(1px); } }
.type-scroll::-webkit-scrollbar { display: none; }
.filter-scroll::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

export const TYPE_CARDS = [
  {
    label: "Parties",
    emoji: "✦",
    bg: "#FFF0F8",
    color: "#FF1F7D",
    border: "1px solid rgba(255,31,125,0.18)",
    glow: "0 4px 16px rgba(255,31,125,0.1)",
    font: "var(--font-jost)",
    weight: 900,
    size: 11,
    spacing: "0.14em",
    sub: "Tonight",
    subColor: "rgba(255,31,125,0.45)",
  },
  {
    label: "Dinners",
    emoji: "🕯",
    bg: "#FFF5F8",
    color: "#C80060",
    border: "1px solid rgba(200,0,96,0.15)",
    glow: "0 4px 16px rgba(200,0,96,0.08)",
    font: "var(--font-playfair)",
    weight: 900,
    size: 13,
    spacing: "0.01em",
    sub: "& Brunches",
    subColor: "rgba(200,0,96,0.45)",
  },
  {
    label: "Gatherings",
    emoji: "☀",
    bg: "#FFF0F5",
    color: "#E8006A",
    border: "1px solid rgba(232,0,106,0.15)",
    glow: "0 4px 16px rgba(232,0,106,0.08)",
    font: "var(--font-caveat)",
    weight: 700,
    size: 15,
    spacing: "0em",
    sub: "casual & fun",
    subColor: "rgba(232,0,106,0.45)",
  },
  {
    label: "Club Gatherings",
    emoji: "◆",
    bg: "#FFECF4",
    color: "#B8005A",
    border: "1px solid rgba(184,0,90,0.15)",
    glow: "0 4px 16px rgba(184,0,90,0.08)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.12em",
    sub: "Members only",
    subColor: "rgba(184,0,90,0.45)",
  },
  {
    label: "Invitations",
    emoji: "💌",
    bg: "#FFF0F8",
    color: "#FF1F7D",
    border: "1px solid rgba(255,31,125,0.18)",
    glow: "0 4px 16px rgba(255,31,125,0.1)",
    font: "var(--font-playfair)",
    weight: 400,
    size: 14,
    spacing: "0em",
    sub: "You're invited",
    subColor: "rgba(255,31,125,0.45)",
  },
  {
    label: "Open Seats",
    emoji: "🪑",
    bg: "#FFF5FA",
    color: "#CC0058",
    border: "1px solid rgba(204,0,88,0.15)",
    glow: "0 4px 16px rgba(204,0,88,0.08)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.1em",
    sub: "Last spots",
    subColor: "rgba(204,0,88,0.45)",
  },
  {
    label: "Tables",
    emoji: "🥂",
    bg: "#F5F8FF",
    color: "#3A5BBF",
    border: "1px solid rgba(58,91,191,0.2)",
    glow: "0 4px 16px rgba(58,91,191,0.1)",
    font: "var(--font-playfair)",
    weight: 400,
    size: 15,
    spacing: "0em",
    sub: "reserve your seat",
    subColor: "rgba(58,91,191,0.5)",
  },
  {
    label: "Confetti",
    emoji: "🎊",
    bg: "#FFFBEC",
    color: "#B87A00",
    border: "1px solid rgba(184,122,0,0.2)",
    glow: "0 4px 16px rgba(184,122,0,0.1)",
    font: "var(--font-caveat)",
    weight: 700,
    size: 16,
    spacing: "0em",
    sub: "spontaneous joy",
    subColor: "rgba(184,122,0,0.5)",
  },
  {
    label: "Events",
    emoji: "🎭",
    bg: "#FFEEF6",
    color: "#A8004C",
    border: "1px solid rgba(168,0,76,0.15)",
    glow: "0 4px 16px rgba(168,0,76,0.08)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.1em",
    sub: "Experiences",
    subColor: "rgba(168,0,76,0.45)",
  },
];

export const FILTERS: Filter[] = ["All", "Parties", "Dinners", "Gatherings", "Club Gatherings", "Invitations", "Open Seats", "Tables", "Confetti", "Events"];

export const CATEGORY_CHIPS: { id: CategoryFilter; emoji: string; label: string }[] = [
  { id: "arts",   emoji: "🎨", label: "Arts"   },
  { id: "eat",    emoji: "🍽️", label: "Eat"    },
  { id: "music",  emoji: "🎵", label: "Music"  },
  { id: "books",  emoji: "📚", label: "Books"  },
  { id: "active", emoji: "🏃", label: "Active" },
  { id: "drinks", emoji: "🍷", label: "Drinks" },
  { id: "film",   emoji: "🎬", label: "Film"   },
  { id: "dance",  emoji: "💃", label: "Dance"  },
];

export const SCENE_CATS = [
  { label: "EAT",        sub: "tables for one or ten",    color: "#FF1F7D", icon: "🍽",  pct: 88, href: "/member/city/eat" },
  { label: "GO",         sub: "places to be seen",        color: "#E07040", icon: "🗺",  pct: 76, href: "/member/city/go" },
  { label: "SOLO",       sub: "her solo scene",           color: "#5070C8", icon: "🎧",  pct: 83, href: "/member/city/solo" },
  { label: "GIRL GEMS",  sub: "curated by Bloomies",      color: "#C040A8", icon: "💎",  pct: 70, href: "/member/city/gems" },
  { label: "TRENDING",   sub: "what's hot right now",     color: "#E040B0", icon: "✦",   pct: 79, href: "/member/city/trending" },
];
