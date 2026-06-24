// PROTOTYPE-ONLY — replace with real DB queries before launch

export const LIVE_FEED = [
  { action: "joined",  who: "Amara K.", club: "SUPPER CLUB",    time: "now",  color: "#c9504a" },
  { action: "posted",  who: "Temi A.",  club: "MUSEUM GIRLS",   time: "2m",   color: "#6b4fa0" },
  { action: "joined",  who: "Kemi B.",  club: "BOOK GIRLS",     time: "5m",   color: "#3e7c6b" },
  { action: "shared",  who: "Ife O.",   club: "RUN CLUB",       time: "8m",   color: "#e07b39" },
  { action: "joined",  who: "Nadia S.", club: "SOFT LIFE CLUB", time: "12m",  color: "#c96b9e" },
  { action: "posted",  who: "Zara M.",  club: "MUSEUM GIRLS",   time: "15m",  color: "#6b4fa0" },
  { action: "joined",  who: "Chisom E.", club: "SUPPER CLUB",   time: "18m",  color: "#c9504a" },
];

export const HOT_CLUBS = [
  { name: "WALK & TALK CLUB", fire: 58, grad: "linear-gradient(135deg,#2D6A4F,#1A3D2C)", href: "/member/clubs/walk-and-talk" },
  { name: "SUPPER CLUB NYC",  fire: 47, grad: "linear-gradient(135deg,#c9504a,#7a1c2e)", href: "/member/clubs/supper-club-nyc" },
  { name: "MUSEUM GIRLS",     fire: 42, grad: "linear-gradient(135deg,#6b4fa0,#2d1a5e)", href: "/member/clubs/museum-girls" },
  { name: "SOFT LIFE CLUB",   fire: 38, grad: "linear-gradient(135deg,#c96b9e,#7a2250)", href: "/member/clubs/soft-life-club" },
  { name: "APERITIVO GIRLS",  fire: 31, grad: "linear-gradient(135deg,#e07040,#8a3810)", href: "/member/clubs/aperitivo-girls" },
  { name: "BOOK SOCIETY",     fire: 29, grad: "linear-gradient(135deg,#b5451b,#6a2210)", href: "/member/clubs/book-society" },
];

// Spotlight: hardcoded event text + fake attendee avatars
export const SPOTLIGHT_MOCK = {
  text: "Museum Girls are going to The Met this weekend ♡",
  avatarLetters: ["A", "M", "J", "L"],
  extraCount: 28,
};
