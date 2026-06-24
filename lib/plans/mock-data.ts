// PROTOTYPE-ONLY — replace with real DB data before launch

import type { PlanRoom } from "./types";

export const PLAN_ROOMS: PlanRoom[] = [
  { id: 1, name: "Morocco October",     emoji: "🇲🇦", bg: "#1A0E0A", accent: "#FF69B4", unread: 7,  members: 14, date: "Oct 2026", venue: "Marrakech · Private Villa",       time: "Oct 10–17, 2026",   poster: "/happenings/posters/10_Ladies_First_Road_Trip.png" },
  { id: 2, name: "Afrobeats Night",     emoji: "🎵",  bg: "#0F0818", accent: "#FF1F7D", unread: 3,  members: 8,  date: "Jun 14",  venue: "SOB's, 204 Varick St",            time: "Sat Jun 14 · 10PM", poster: "/happenings/posters/06_Dance_All_Night.png",          eventId: 6 },
  { id: 3, name: "Sunday Walk Circle",  emoji: "🌿",  bg: "#0A120F", accent: "#FFB3D1", unread: 0,  members: 6,  date: "Jun 8",   venue: "Prospect Park, Grand Army Plaza", time: "Sun Jun 8 · 9AM",   poster: "/happenings/posters/09_Bagels_And_Books.png",         eventId: 4 },
  { id: 4, name: "Women in Lens",       emoji: "🎨",  bg: "#1A0A14", accent: "#FF1F7D", unread: 2,  members: 5,  date: "Tonight", venue: "The Parlor Gallery, Bushwick",    time: "Tonight · 7PM",     poster: "/happenings/posters/05_Film_Club.png",                eventId: 1 },
  { id: 5, name: "Wheel Throwing",      emoji: "🏺",  bg: "#0A1518", accent: "#FFB3D1", unread: 1,  members: 4,  date: "Tonight", venue: "Brooklyn Clay, Williamsburg",     time: "Tonight · 6:30PM",  poster: "/happenings/posters/07_Sunday_Brunch_Club.png",       eventId: 2 },
  { id: 6, name: "Golden Hour Rooftop", emoji: "🌅",  bg: "#180A06", accent: "#FF1F7D", unread: 0,  members: 6,  date: "Tonight", venue: "Westlight Hotel, Williamsburg",   time: "Tonight · 8PM",     poster: "/happenings/posters/08_Rooftop_Sessions.png",         eventId: 3 },
];

export const BLOOMIES_LIST = [
  { id: 1, name: "Aaliyah M.", initial: "A", color: "#FF1F7D", status: "Active now" },
  { id: 2, name: "Zara F.",    initial: "Z", color: "#FF69B4", status: "Online"     },
  { id: 3, name: "Temi A.",    initial: "T", color: "#FF1F7D", status: "3h ago"     },
  { id: 4, name: "Jade K.",    initial: "J", color: "#FF5FA5", status: "Yesterday"  },
  { id: 5, name: "Sofia W.",   initial: "S", color: "#FFB3D1", status: "Online"     },
  { id: 6, name: "Naomi B.",   initial: "N", color: "#FF1F7D", status: "2d ago"     },
];

export const CLUBS_LIST = [
  { id: 1, name: "Women & Lens",         emoji: "📸", members: 42 },
  { id: 2, name: "Sunday Walkers",       emoji: "🌿", members: 28 },
  { id: 3, name: "Afrobeats Collective", emoji: "🎵", members: 67 },
];

export const PLAN_TODOS: Record<number, { id: number; text: string; done: boolean }[]> = {
  1: [
    { id: 1, text: "Book flights JFK → RAK",          done: false },
    { id: 2, text: "Reserve riad (Nadia's link)",     done: false },
    { id: 3, text: "Check Morocco visa requirements", done: true  },
    { id: 4, text: "Travel insurance",               done: false },
    { id: 5, text: "Group flight coordination call", done: false },
    { id: 6, text: "Shared packing list",            done: false },
  ],
  2: [
    { id: 1, text: "Get tickets (3 left!)",  done: false },
    { id: 2, text: "Pregame at mine — 9PM",  done: true  },
    { id: 3, text: "Rideshare to SOB's",     done: false },
    { id: 4, text: "Outfit check ✔️",        done: true  },
  ],
  3: [
    { id: 1, text: "Meet at Grand Army Plaza 9AM", done: true  },
    { id: 2, text: "Naomi bringing matcha 🍵",    done: true  },
    { id: 3, text: "Wear comfy shoes",            done: false },
  ],
  4: [
    { id: 1, text: "Get there by 6:45 (talk at 7:15)", done: false },
    { id: 2, text: "Free champagne reception!",         done: false },
    { id: 3, text: "Meet Sofía at Wyckoff corner",      done: true  },
  ],
  5: [
    { id: 1, text: "Wear old clothes (clay splatter!)", done: false },
    { id: 2, text: "Brooklyn Clay, Williamsburg",       done: true  },
    { id: 3, text: "Session starts 6:30PM sharp",      done: false },
  ],
  6: [
    { id: 1, text: "Wear something gold 🌟",   done: false },
    { id: 2, text: "Arrive before sunset (8PM)", done: false },
    { id: 3, text: "Reserve Westlight rooftop bar", done: true },
  ],
};

export const PLAN_NOTES: Record<number, { id: number; text: string }[]> = {
  1: [
    { id: 1, text: "Riad has private pool 🌴 link in group" },
    { id: 2, text: "Oct 10-17 works for everyone" },
    { id: 3, text: "Budget ~$2,200 per person all in" },
  ],
  2: [{ id: 1, text: "SOB's fills up — arrive by 10 latest" }],
  3: [{ id: 1, text: "Route: Grand Army → Boathouse → Vale" }],
  4: [{ id: 1, text: "Artist talk starts 7:15. Don't be late!" }, { id: 2, text: "Champagne reception is FREE 🥂" }],
  5: [{ id: 1, text: "First-timers: centering clay takes 20 min to learn, be patient!" }],
  6: [{ id: 1, text: "Sunset is 8:24PM — arrive early for good spots" }],
};

export const EVENT_DATES: Record<string, { emoji: string; name: string; time: string; color: string }[]> = {
  "2026-06-07": [{ emoji: "🌿", name: "Sunday Walk Circle",  time: "9AM",    color: "#FFB3D1" }],
  "2026-06-08": [{ emoji: "🎨", name: "Women in Lens",       time: "7PM",    color: "#FF1F7D" }, { emoji: "🏺", name: "Wheel Throwing", time: "6:30PM", color: "#FFB3D1" }],
  "2026-06-14": [{ emoji: "🎵", name: "Afrobeats Night",     time: "10PM",   color: "#FF69B4" }],
  "2026-06-20": [{ emoji: "🌅", name: "Golden Hour Rooftop", time: "8PM",    color: "#FF1F7D" }],
  "2026-10-10": [{ emoji: "🇲🇦", name: "Morocco October",   time: "10AM",   color: "#FF69B4" }],
};

export const TICKET_IMAGES: Record<number, string> = {
  2: "/tickets templates/Ticket_Girls_Night.png",
  4: "/tickets templates/Ticket_Museum_Exhibition.png",
  6: "/tickets templates/Ticket_Dinner_Society.png",
  1: "/tickets templates/Ticket_NYC_Marrakech.png",
};

export const MEMORY_EVENTS = [
  { id: 10, name: "Gallery Hop BK",   date: "May 3",  poster: "/happenings/posters/05_Film_Club.png",              note: "what a night ✦",  color: "#FF1F7D" },
  { id: 11, name: "Brunch at Lola's", date: "Apr 20", poster: "/happenings/posters/07_Sunday_Brunch_Club.png",     note: "always her 🌸",   color: "#FFB3D1" },
  { id: 20, name: "Jazz at Small's",  date: "May 28", poster: "/happenings/posters/09_Bagels_And_Books.png",       note: "iconic ✦",        color: "#FF1F7D" },
  { id: 21, name: "Rooftop Pilates",  date: "May 15", poster: "/happenings/posters/08_Rooftop_Sessions.png",       note: "girls that slay", color: "#FF69B4" },
  { id: 22, name: "Film Club Night",  date: "Apr 5",  poster: "/happenings/posters/06_Dance_All_Night.png",        note: "loved this 💕",   color: "#FF1F7D" },
  { id: 23, name: "Sunday Walk",      date: "Mar 28", poster: "/happenings/posters/10_Ladies_First_Road_Trip.png", note: "so peaceful 🌿",  color: "#FFB3D1" },
];

export const POLAROID_ROTS = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5];

export const RETIRED_ROOMS: PlanRoom[] = [
  { id: 10, name: "Gallery Hop BK",   emoji: "🖼️", bg: "#1A0A14", accent: "#FF1F7D", unread: 0, members: 8,  date: "May 3",  venue: "Bushwick Collective",  time: "Sat May 3 · 6PM"  },
  { id: 11, name: "Brunch at Lola's", emoji: "🥂",  bg: "#0A100A", accent: "#FFB3D1", unread: 0, members: 5,  date: "Apr 20", venue: "Lola Taverna, WV",     time: "Sun Apr 20 · 11AM" },
];

export const EXPIRED_ROOMS: PlanRoom[] = [
  { id: 20, name: "Jazz at Small's",   emoji: "🎷",  bg: "#0A0810", accent: "#FF1F7D", unread: 0, members: 7,  date: "May 28", venue: "Smalls Jazz Club, WV", time: "Wed May 28 · 8PM" },
  { id: 21, name: "Rooftop Pilates",   emoji: "🧘‍♀️", bg: "#0A1018", accent: "#FFB3D1", unread: 0, members: 12, date: "May 15", venue: "Arlo Hotel Rooftop",   time: "Thu May 15 · 7AM" },
];
