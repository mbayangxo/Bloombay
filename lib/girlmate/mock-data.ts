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

export const MOCK_LISTINGS: MockListing[] = [];

export const MOCK_SEEKERS: MockSeeker[] = [];

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
