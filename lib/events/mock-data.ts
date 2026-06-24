// PROTOTYPE-ONLY — replace with real DB queries before launch

export const INVITE_DEMO = [
  { id: "c1", type: "Birthday" as const,   name: "Sofia K.",  what: "30th Birthday Dinner",   venue: "Carbone, West Village",   date: "SAT JUL 5",  time: "8 PM",    initials: "SK", color: "#FF1F7D", confirmed: 12 },
  { id: "c2", type: "Wins" as const,       name: "Amara T.",  what: "New Job Celebration",     venue: "Ladurée SoHo",            date: "FRI JUL 11", time: "7:30 PM", initials: "AT", color: "#FF69B4", confirmed: 8  },
  { id: "c3", type: "Milestones" as const, name: "Nadia O.",  what: "New Apartment Warming",   venue: "Her new place · Tribeca", date: "SUN JUL 13", time: "3 PM",    initials: "NO", color: "#E8006A", confirmed: 18 },
  { id: "c4", type: "Birthday" as const,   name: "Lena R.",   what: "Birthday Brunch",         venue: "Sadelle's, SoHo",         date: "SUN JUL 20", time: "11 AM",   initials: "LR", color: "#C80060", confirmed: 7  },
  { id: "c5", type: "Wins" as const,       name: "Zora M.",   what: "Book Deal Dinner",        venue: "Via Carota",              date: "THU JUL 24", time: "7 PM",    initials: "ZM", color: "#FF1F7D", confirmed: 5  },
  { id: "c6", type: "Milestones" as const, name: "Fatima A.", what: "Engagement Dinner",       venue: "The Jane NYC",            date: "SAT JUL 26", time: "6 PM",    initials: "FA", color: "#A8004C", confirmed: 22 },
] as const;

// Hardcoded confetti strip
export const CONFETTI_SENT_DEMO = [
  { name: "Maya B.", what: "New job 🎉",  color: "#FF1F7D" },
  { name: "Temi O.", what: "Birthday 🎂", color: "#FF69B4" },
  { name: "Jade R.", what: "New keys 🏠", color: "#E8006A" },
  { name: "Sade L.", what: "Book deal 📚", color: "#C80060" },
];
