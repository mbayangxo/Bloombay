// PROTOTYPE-ONLY: All data below is demo/seed content for development.
// Remove or replace with real DB data before shipping.

export interface MockListing {
  id: number;
  type: "room" | "apartment" | "roommate-wanted";
  city: string;
  neighborhood: string;
  price: number;
  availableFrom: string;
  availableTo?: string;
  furnished: boolean;
  bathroom: "private" | "shared";
  pets: boolean;
  smoking: boolean;
  weed: boolean;
  halalKitchen: boolean;
  description: string;
  poster: { initial: string; color: string; name: string; showProfile: boolean; clubs?: string[] };
  compatibility: number;
  yandeNote: string;
  ageRange?: string;
  lifestyleTags?: string[];
  personalityType?: string;
  cleanlinessLevel?: string;
  noiseLevel?: string;
  drinking?: string;
  momStatus?: string;
  wantsKids?: string;
  religion?: string;
  religionLevel?: string;
  moveInTimeline?: string;
  guestFrequency?: string;
  kitchenUse?: string;
  tempPreference?: string;
  dealbreakerTags?: string[];
  interests?: string[];
  dealBreakers?: string;
  voiceNoteUrl?: string;
  videoIntroUrl?: string;
}

export interface MockSeeker {
  id: number;
  initial: string;
  color: string;
  name: string;
  city: string;
  neighborhood: string;
  budget: number;
  moveIn: string;
  type: "room" | "apartment" | "co-search";
  showProfile: boolean;
  clubs?: string[];
  note: string;
  compatibility: number;
  yandeNote: string;
  ageRange?: string;
  lifestyleTags?: string[];
  personalityType?: string;
  cleanlinessLevel?: string;
  noiseLevel?: string;
  drinking?: string;
  momStatus?: string;
  wantsKids?: string;
  religion?: string;
  religionLevel?: string;
  moveInTimeline?: string;
  guestFrequency?: string;
  kitchenUse?: string;
  tempPreference?: string;
  dealbreakerTags?: string[];
  interests?: string[];
  dealBreakers?: string;
  voiceNoteUrl?: string;
  videoIntroUrl?: string;
}

export const MOCK_LISTINGS: MockListing[] = [
  {
    id: 1, type: "room",
    city: "New York City", neighborhood: "Williamsburg",
    price: 1450, availableFrom: "Aug 1", availableTo: "Nov 30",
    furnished: true, bathroom: "private", pets: false, smoking: false, weed: false, halalKitchen: false,
    description: "Sunny room in a 3BR with two other creatives. Great light, walk to the L. Looking for someone quiet, tidy, no smoking.",
    poster: { initial: "A", color: "#FF1F7D", name: "Amara D.", showProfile: true, clubs: ["Book Girls", "Museum Girls"] },
    compatibility: 91,
    yandeNote: "You and Amara are both in Book Girls and have saved 4 of the same cafés. She saves quiet, non-smoking spaces almost exclusively.",
  },
  {
    id: 2, type: "apartment",
    city: "New York City", neighborhood: "Crown Heights",
    price: 2800, availableFrom: "Sep 1", availableTo: "Dec 31",
    furnished: false, bathroom: "private", pets: true, smoking: false, weed: false, halalKitchen: false,
    description: "Full 1BR sublet while I'm traveling for work. Great block, laundry in building. Cat-friendly. No smoking.",
    poster: { initial: "F", color: "#C084FC", name: "Fatima A.", showProfile: true, clubs: ["African Girls Club", "Travel Girls"] },
    compatibility: 78,
    yandeNote: "Fatima is in African Girls Club. You've both saved the same 2 restaurants in Crown Heights. Pet-friendly matches your answers.",
  },
  {
    id: 3, type: "roommate-wanted",
    city: "London", neighborhood: "Peckham",
    price: 950, availableFrom: "Jul 15",
    furnished: true, bathroom: "shared", pets: false, smoking: false, weed: true, halalKitchen: false,
    description: "Looking for a third roommate in our flat. We're both early-30s, creative, social but respect space. Great area, tons of cafés.",
    poster: { initial: "Z", color: "#0EA5E9", name: "Zara M.", showProfile: false },
    compatibility: 65,
    yandeNote: "Zara hasn't linked her BloomBay profile — compatibility is based on your quiz answers only. She allows weed use.",
  },
  {
    id: 4, type: "room",
    city: "New York City", neighborhood: "Astoria",
    price: 1200, availableFrom: "Aug 15",
    furnished: false, bathroom: "shared", pets: true, smoking: false, weed: false, halalKitchen: true,
    description: "Large bedroom in a sunny 2BR with me and my dog. Halal kitchen, no pork in the apartment. Clean, quiet, warm vibes.",
    poster: { initial: "N", color: "#FF69B4", name: "Nadia K.", showProfile: true, clubs: ["Wellness Girls", "Dinner Society"] },
    compatibility: 84,
    yandeNote: "Nadia keeps a halal kitchen — you marked that as important. She's in Dinner Society, and you've both saved the same spots in Astoria.",
  },
];

export const MOCK_SEEKERS: MockSeeker[] = [
  {
    id: 1, initial: "I", color: "#FF1F7D", name: "Ifeoma O.",
    city: "New York City", neighborhood: "Brooklyn (flexible)",
    budget: 1500, moveIn: "Aug 1", type: "room", showProfile: true, clubs: ["African Girls Club"],
    note: "Just moved from Lagos. Looking for a quiet, clean space. Halal kitchen preferred. Non-smoker.",
    compatibility: 88,
    yandeNote: "You and Ifeoma are both in African Girls Club. She has similar lifestyle answers — early riser, tidy, no smoking.",
  },
  {
    id: 2, initial: "C", color: "#8B5CF6", name: "Camille D.",
    city: "New York City", neighborhood: "West Village / SoHo",
    budget: 2200, moveIn: "Sep 1", type: "apartment", showProfile: true, clubs: ["Soft Life Club NYC"],
    note: "Relocated from Paris. Need a proper apartment, not just a room. Quiet, no parties, good taste.",
    compatibility: 72,
    yandeNote: "Camille recently moved from Paris. Detailed profile — good match on lifestyle even without shared clubs.",
  },
  {
    id: 3, initial: "T", color: "#D97706", name: "Tara L.",
    city: "New York City", neighborhood: "West Village",
    budget: 1800, moveIn: "Flexible", type: "co-search", showProfile: true, clubs: ["Dinner Society", "Book Girls"],
    note: "Looking for someone to apartment-hunt with in the West Village. Budget $1800 each. Let's find something good together.",
    compatibility: 94,
    yandeNote: "You and Tara are 94% compatible because you're both in Book Girls and Dinner Society, you've saved 6 of the same places, and you both tend to show up for the same type of events.",
  },
  {
    id: 4, initial: "S", color: "#0EA5E9", name: "Sade T.",
    city: "London", neighborhood: "Peckham / Brixton",
    budget: 1100, moveIn: "Jul 1", type: "room", showProfile: true, clubs: ["Book Girls"],
    note: "Just moved from New York. Need a room in south London. Quiet bookworm. Prefer no weed in the flat.",
    compatibility: 80,
    yandeNote: "Sade is in Book Girls. She's new to London — looking for community as much as a room.",
  },
];

export const MOCK_QUIZ = [
  { id: "sleep",     q: "Sleep schedule?",            opts: ["Early bird (in by 10pm)", "Night owl (up past midnight)", "Flexible"] },
  { id: "guests",    q: "Guests?",                    opts: ["Often (weekly)", "Sometimes (monthly)", "Rarely", "Never"] },
  { id: "clean",     q: "Cleanliness?",               opts: ["Very tidy — everything in its place", "Clean and organized", "Relaxed", "I'm working on it"] },
  { id: "noise",     q: "Noise level?",               opts: ["Very quiet — silence is important", "Moderate — music sometimes", "I like background noise"] },
  { id: "pets",      q: "Pets?",                      opts: ["I have pets", "I love pets — welcome", "No pets please", "Allergic"] },
  { id: "smoking",   q: "Smoking?",                   opts: ["I smoke inside", "Outside only", "No smoking please"] },
  { id: "weed",      q: "Weed / cannabis?",           opts: ["Fine inside", "Outside only", "No please"] },
  { id: "dietary",   q: "Kitchen needs?",             opts: ["Halal kitchen (no pork/alcohol)", "No pork", "Vegan kitchen preferred", "No restrictions"] },
  { id: "wfh",       q: "Working from home?",         opts: ["Always home", "Few days a week", "Rarely home"] },
  { id: "partner",   q: "Partner visits?",            opts: ["Often — very present", "Sometimes", "Single / partner rarely here"] },
  { id: "age",       q: "Your age range?",            opts: ["20–25", "26–30", "31–35", "36–40", "40+"] },
  { id: "lifestyle", q: "Your daily rhythm?",         opts: ["Early bird — up by 7, in by 10", "Night owl — alive after midnight", "Homebody — mostly at home", "Social butterfly — always out"] },
  { id: "mom",       q: "Family status?",             opts: ["I'm a mom · kids at home", "Not a mom", "Open to living with moms", "Prefer child-free home"] },
  { id: "religion",  q: "Religion (helps with lifestyle fit)?", opts: ["Muslim", "Christian", "Jewish", "Hindu", "Buddhist", "Atheist/agnostic", "Spiritual", "Prefer not to say"] },
  { id: "dealbreaker", q: "Biggest deal-breaker in a home?", opts: ["Messiness / uncleanliness", "Loud guests at night", "No personal space respected", "Misaligned values / lifestyle"] },
];
