export const BLOOMBAY_CLARITY =
  "BloomBay is a social world for women — clubs, gatherings, real friendships." as const;

export const WHY_JOIN_REASONS = [
  { id: "book-club",   label: "I want to join a club.",             emoji: "📖" },
  { id: "friends",     label: "I want to make new friends.",        emoji: "👭" },
  { id: "events",      label: "I want to go to more events.",       emoji: "🥂" },
  { id: "wellness",    label: "I want to focus on wellness.",       emoji: "🌸" },
  { id: "business",    label: "I want to meet women in business.",  emoji: "💼" },
  { id: "travel",      label: "I want to travel and explore.",      emoji: "✈️" },
] as const;

export const INTERESTS = [
  { id: "book-clubs",      label: "Book Clubs" },
  { id: "dinner-clubs",    label: "Dinner Clubs" },
  { id: "creative-women",  label: "Creative Women" },
  { id: "wellness",        label: "Wellness" },
  { id: "entrepreneurship",label: "Entrepreneurship" },
  { id: "faith",           label: "Faith" },
  { id: "travel",          label: "Travel" },
  { id: "events",          label: "Events" },
  { id: "new-friends",     label: "New Friends" },
  { id: "everything",      label: "Everything" },
] as const;

export const AGE_RANGES = ["18–24", "25–30", "31–35", "36–40", "40+"] as const;

export const FOUNDING_MOTHER_PERKS = [
  { icon: "🔑", text: "Early access to BloomBay and all new features" },
  { icon: "📩", text: "Invitations to exclusive Founding Mothers events" },
  { icon: "🏅", text: "A special badge in the app" },
  { icon: "💕", text: "Your name in BloomBay history" },
] as const;
