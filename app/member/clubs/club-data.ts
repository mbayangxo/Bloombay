export type Club = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  members: number;
  description: string;
  gradient: string;
  ownerName: string;
  ownerInitial: string;
  welcomeMessage: string;
  upcomingEvents: { title: string; date: string; location: string }[];
  vibeBoard: { author: string; initial: string; text: string; time: string }[];
};

export const CLUBS: Club[] = [
  {
    id: "morning-run-club",
    name: "Morning Run Club",
    tagline: "Rise. Run. Repeat.",
    category: "Fitness",
    members: 214,
    description: "Early risers who hit the pavement together. Weekly runs, accountability, and post-run smoothies.",
    gradient: "linear-gradient(135deg, #ff6b9d 0%, #ff0055 60%, #c9004a 100%)",
    ownerName: "Aaliyah",
    ownerInitial: "A",
    welcomeMessage: "Welcome to the club, sis. We run together, we sweat together, we grow together. Show up for your first group run and you'll never want to do it alone again. See you at 6am. 🏃🏽‍♀️",
    upcomingEvents: [
      { title: "Saturday Morning 5K", date: "Sat, Jun 7 · 6:00 AM", location: "Central Park, South Entrance" },
      { title: "Interval Training Session", date: "Tue, Jun 10 · 6:30 AM", location: "Riverside Park Track" },
      { title: "Monthly Brunch Run", date: "Sun, Jun 15 · 8:00 AM", location: "Prospect Park, Brooklyn" },
    ],
    vibeBoard: [
      { author: "Zara", initial: "Z", text: "Just hit my first 10K without stopping. This club literally changed my life 🙌🏾", time: "2h ago" },
      { author: "Priya", initial: "P", text: "Anyone else obsessed with the post-run smoothie spot on 72nd? Meet you there Saturday!", time: "5h ago" },
      { author: "Monique", initial: "M", text: "New personal best this morning: 28 mins flat. Six months ago I couldn't run a mile. 💗", time: "Yesterday" },
    ],
  },
  {
    id: "the-page-turners",
    name: "The Page Turners",
    tagline: "Good books. Better conversations.",
    category: "Books",
    members: 87,
    description: "A monthly book club for women who love fiction, deep discussions, and even deeper wine.",
    gradient: "linear-gradient(135deg, #f7c59f 0%, #e8845a 60%, #c96a00 100%)",
    ownerName: "Imani",
    ownerInitial: "I",
    welcomeMessage: "So glad you're here. We read one book a month — usually fiction, always something that makes us feel something. Our meetings are part book discussion, part therapy, part girls' night. Come with your thoughts and an open heart.",
    upcomingEvents: [
      { title: "June Read: Homegoing Discussion", date: "Sat, Jun 14 · 4:00 PM", location: "Imani's apartment, Harlem" },
      { title: "July Pick Vote", date: "Mon, Jun 16 · Online", location: "Group chat vote" },
      { title: "Summer Reading Picnic", date: "Sun, Jun 22 · 2:00 PM", location: "Fort Greene Park" },
    ],
    vibeBoard: [
      { author: "Temi", initial: "T", text: "Just finished Homegoing in one sitting. Cried three times. See you all Saturday 📚", time: "3h ago" },
      { author: "Fatima", initial: "F", text: "Can we also nominate some Chimamanda for July? I'm obsessed with Americanah rn", time: "1d ago" },
      { author: "Claire", initial: "C", text: "This month's discussion was the best one yet. I needed that conversation more than I knew.", time: "3d ago" },
    ],
  },
  {
    id: "wander-women",
    name: "Wander Women",
    tagline: "The world is yours. Go get it.",
    category: "Travel",
    members: 340,
    description: "Group trips, solo travel tips, and a community of women who refuse to stay in one place.",
    gradient: "linear-gradient(135deg, #74c7f0 0%, #0099dd 60%, #0072c6 100%)",
    ownerName: "Kemi",
    ownerInitial: "K",
    welcomeMessage: "Welcome to the most adventurous club on Bloombay. Whether you're planning your first solo trip or your 40th country, this is your people. Share your itineraries, ask your questions, and let's build trips together.",
    upcomingEvents: [
      { title: "Lisbon Group Trip", date: "Aug 1–7 · International", location: "Lisbon, Portugal" },
      { title: "Travel Planning Workshop", date: "Wed, Jun 11 · 7:00 PM", location: "Virtual" },
      { title: "Ghana Roots Trip Info Session", date: "Sat, Jun 21 · 3:00 PM", location: "TBD, NYC" },
    ],
    vibeBoard: [
      { author: "Simone", initial: "S", text: "Just booked my Lisbon flight! Who else is confirmed? Need a roommate 🇵🇹", time: "1h ago" },
      { author: "Adaeze", initial: "A", text: "Solo trip to Bali debrief: 10/10. Detailed blog post coming. Ask me anything.", time: "6h ago" },
      { author: "Leila", initial: "L", text: "Morocco in October — anyone want to make it a group thing? DM me", time: "2d ago" },
    ],
  },
  {
    id: "the-wellness-circle",
    name: "The Wellness Circle",
    tagline: "Come as you are. Leave lighter.",
    category: "Wellness",
    members: 162,
    description: "Breathwork, sound baths, journaling, and honest conversations about mental health.",
    gradient: "linear-gradient(135deg, #a8e6cf 0%, #3dbb7c 60%, #00875a 100%)",
    ownerName: "Naomi",
    ownerInitial: "N",
    welcomeMessage: "This is a soft place to land. We don't perform wellness here — we practice it. Some weeks that means breathwork, other weeks it means crying together on Zoom. Both are valid. Welcome home.",
    upcomingEvents: [
      { title: "Sound Bath & Release", date: "Fri, Jun 6 · 7:00 PM", location: "The Light Studio, Williamsburg" },
      { title: "Journaling Circle: Letting Go", date: "Sun, Jun 8 · 10:00 AM", location: "Virtual" },
      { title: "Group Therapy Intro Session", date: "Thu, Jun 19 · 6:30 PM", location: "Naomi's studio, Brooklyn" },
    ],
    vibeBoard: [
      { author: "Blessing", initial: "B", text: "Last week's sound bath cracked me open in the best way. I cried, I laughed, I feel renewed 🌿", time: "4h ago" },
      { author: "Maya", initial: "M", text: "Reminder that therapy is not a luxury. Sharing the sliding scale therapist list in the resource folder.", time: "1d ago" },
      { author: "Jade", initial: "J", text: "The journaling prompt from Sunday is still living in my head: what would you do if you weren't afraid?", time: "2d ago" },
    ],
  },
  {
    id: "sunday-supper-club",
    name: "Sunday Supper Club",
    tagline: "Every table is better with us at it.",
    category: "Food",
    members: 95,
    description: "Rotating dinner parties hosted by members. New restaurants, new recipes, new friends.",
    gradient: "linear-gradient(135deg, #ffd97d 0%, #f4a261 60%, #b07d00 100%)",
    ownerName: "Chloé",
    ownerInitial: "C",
    welcomeMessage: "Food is how we love each other. This club rotates hosting every month — you'll eat in someone's home, at a restaurant we've taken over, or at a pop-up we've curated. Come hungry, come curious.",
    upcomingEvents: [
      { title: "June Dinner: West African Feast", date: "Sun, Jun 8 · 5:00 PM", location: "Chloé's apartment, Crown Heights" },
      { title: "Dumpling Making Workshop", date: "Sat, Jun 14 · 2:00 PM", location: "Mei's kitchen, Flushing" },
      { title: "Restaurant Takeover: Ceconi's", date: "Sun, Jun 29 · 6:00 PM", location: "West Village, NYC" },
    ],
    vibeBoard: [
      { author: "Ayo", initial: "A", text: "The jollof rice from last month's dinner is still haunting me. Chloé please share the recipe 😭", time: "2h ago" },
      { author: "Mei", initial: "M", text: "Dumpling workshop is almost full! 4 spots left if anyone wants in", time: "8h ago" },
      { author: "Rochelle", initial: "R", text: "This club has genuinely made me a better cook AND introduced me to my now-best-friend. Love you all.", time: "3d ago" },
    ],
  },
  {
    id: "after-dark",
    name: "After Dark",
    tagline: "Show up. Stand out. Come alive.",
    category: "Nightlife",
    members: 278,
    description: "The group chat that actually goes out. Gallery openings, rooftops, and nights worth remembering.",
    gradient: "linear-gradient(135deg, #d4b4fe 0%, #9333ea 60%, #7c3aed 100%)",
    ownerName: "Tiara",
    ownerInitial: "T",
    welcomeMessage: "Welcome to the club that actually leaves the house. No flaking, no maybes — just women who show up and make nights happen. Check the event board weekly. Something is always going on.",
    upcomingEvents: [
      { title: "Gallery Opening: Emerging Black Artists", date: "Thu, Jun 5 · 7:00 PM", location: "Fotografiska, NYC" },
      { title: "Rooftop Night: Members Only", date: "Sat, Jun 7 · 9:00 PM", location: "Location shared day-of" },
      { title: "Afrobeats Night", date: "Fri, Jun 13 · 10:00 PM", location: "Elsewhere, Brooklyn" },
    ],
    vibeBoard: [
      { author: "Tiara", initial: "T", text: "Rooftop Saturday is CONFIRMED. 40 women. Open bar for the first hour. Dress up. 💜", time: "30m ago" },
      { author: "Kezia", initial: "K", text: "The gallery last Thursday was everything. Already looking forward to the next one.", time: "5h ago" },
      { author: "Nadia", initial: "N", text: "PSA: we're doing a group outfit theme for Afrobeats night. Details in the group chat!", time: "1d ago" },
    ],
  },
  {
    id: "founders-in-the-making",
    name: "Founders in the Making",
    tagline: "Build it. Fund it. Own it.",
    category: "Entrepreneurship",
    members: 193,
    description: "Women building businesses. Share resources, get feedback, and find your co-founder.",
    gradient: "linear-gradient(135deg, #ff9eb5 0%, #ff0055 60%, #cc0044 100%)",
    ownerName: "Amara",
    ownerInitial: "A",
    welcomeMessage: "This is the room where it happens. Share your ideas without fear. Ask for the intro. Post your wins AND your failures. We're building in public, together. Your business idea deserves a community behind it.",
    upcomingEvents: [
      { title: "Pitch Practice Session", date: "Wed, Jun 11 · 6:00 PM", location: "Virtual" },
      { title: "VC Panel: Women Who Fund Women", date: "Tue, Jun 17 · 6:30 PM", location: "WeWork, Midtown" },
      { title: "Co-founder Speed Dating", date: "Sat, Jun 21 · 2:00 PM", location: "Amara's office, Flatiron" },
    ],
    vibeBoard: [
      { author: "Zuri", initial: "Z", text: "Just closed my pre-seed round! Couldn't have done it without the feedback sessions in this club 🙏🏾", time: "1h ago" },
      { author: "Dami", initial: "D", text: "Looking for a technical co-founder for my health-tech startup. DM me if interested!", time: "4h ago" },
      { author: "Amara", initial: "A", text: "Resource drop: 15 grants for Black women founders in 2025. Link in the resource folder.", time: "1d ago" },
    ],
  },
  {
    id: "the-creative-studio",
    name: "The Creative Studio",
    tagline: "Make something beautiful.",
    category: "Arts & Culture",
    members: 121,
    description: "Photographers, painters, writers, and makers. Monthly showcases and collaborative projects.",
    gradient: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 60%, #c026d3 100%)",
    ownerName: "Lola",
    ownerInitial: "L",
    welcomeMessage: "You are an artist. Even if you haven't picked up a brush in years. Even if your poems are only in your notes app. This is a space to make, share, and be seen. No judgment. Just creation.",
    upcomingEvents: [
      { title: "Photography Walk: Golden Hour", date: "Sat, Jun 7 · 5:30 PM", location: "DUMBO, Brooklyn" },
      { title: "Monthly Showcase Night", date: "Fri, Jun 20 · 7:00 PM", location: "Lola's studio, Bushwick" },
      { title: "Collage & Conversation Workshop", date: "Sun, Jun 22 · 1:00 PM", location: "Brooklyn Museum café" },
    ],
    vibeBoard: [
      { author: "Sade", initial: "S", text: "Posted my first photo series from last month's walk. The feedback from this group made me sob 🎨", time: "3h ago" },
      { author: "Vera", initial: "V", text: "Monthly showcase is filling up fast — submit your work by June 15!", time: "7h ago" },
      { author: "Lola", initial: "L", text: "New theme for July showcase: 'home.' Interpret it however you need to.", time: "2d ago" },
    ],
  },
  {
    id: "slow-living-society",
    name: "Slow Living Society",
    tagline: "Breathe. Be here. Begin again.",
    category: "Wellness",
    members: 76,
    description: "For women intentionally slowing down. Nature walks, analog hobbies, and digital detoxes.",
    gradient: "linear-gradient(135deg, #bbf7d0 0%, #4ade80 60%, #16a34a 100%)",
    ownerName: "Serene",
    ownerInitial: "S",
    welcomeMessage: "You found us. That means you're already ready to slow down. We do things here that don't optimize for anything — we walk slowly, we read paper books, we bake bread, we sit in the sun. Welcome to the unhurry.",
    upcomingEvents: [
      { title: "Morning Nature Walk", date: "Sun, Jun 8 · 7:00 AM", location: "The Ramble, Central Park" },
      { title: "Bread Baking Afternoon", date: "Sat, Jun 14 · 11:00 AM", location: "Serene's kitchen, UWS" },
      { title: "Digital Detox Weekend", date: "Jun 27–29", location: "Catskills Cabin" },
    ],
    vibeBoard: [
      { author: "Noa", initial: "N", text: "I put my phone in a drawer for 24 hours this weekend. I forgot how good boredom feels.", time: "6h ago" },
      { author: "Camille", initial: "C", text: "The bread baking last month was the most peaceful Saturday I've had in years.", time: "2d ago" },
      { author: "Serene", initial: "S", text: "Catskills cabin is booked. 12 spots. First come first serve. Life-changing, I promise. 🌿", time: "3d ago" },
    ],
  },
  {
    id: "culture-crawl",
    name: "Culture Crawl",
    tagline: "Art is better with company.",
    category: "Arts & Culture",
    members: 144,
    description: "Museum visits, theatre nights, and gallery hops. Art is better with good company.",
    gradient: "linear-gradient(135deg, #fda4af 0%, #f43f5e 60%, #be123c 100%)",
    ownerName: "Chisom",
    ownerInitial: "C",
    welcomeMessage: "We go to the things you've been meaning to go to but never got around to. Every week something cultural, something beautiful, something that makes you think. Bring your curiosity and your good shoes.",
    upcomingEvents: [
      { title: "MoMA Late Night: Members Only", date: "Fri, Jun 6 · 6:00 PM", location: "MoMA, Midtown" },
      { title: "Broadway: The Notebook Musical", date: "Sat, Jun 14 · 8:00 PM", location: "Schoenfeld Theatre" },
      { title: "Harlem Studio Museum Tour", date: "Sun, Jun 22 · 2:00 PM", location: "Studio Museum, Harlem" },
    ],
    vibeBoard: [
      { author: "Anika", initial: "A", text: "The MoMA late nights are unreal — no crowds, wine, and we basically had the whole floor to ourselves.", time: "2h ago" },
      { author: "Chisom", initial: "C", text: "Broadway tickets for June are almost gone — grab yours in the pinned link!", time: "9h ago" },
      { author: "Yemi", initial: "Y", text: "The Studio Museum is one of my favorite places on earth. So glad we're going together 🎭", time: "1d ago" },
    ],
  },
];

const AVATAR_COLORS = ["#ff2d8a", "#ffb7ce", "#121212", "#ff2d8a", "#ffb7ce", "#121212"] as const;

export const MOCK_MEMBERS = [
  { name: "Zara", initial: "Z", color: AVATAR_COLORS[0] },
  { name: "Priya", initial: "P", color: AVATAR_COLORS[1] },
  { name: "Monique", initial: "M", color: AVATAR_COLORS[2] },
  { name: "Fatima", initial: "F", color: AVATAR_COLORS[0] },
  { name: "Aaliyah", initial: "A", color: AVATAR_COLORS[1] },
  { name: "Kezia", initial: "K", color: AVATAR_COLORS[2] },
  { name: "Simone", initial: "S", color: AVATAR_COLORS[0] },
  { name: "Jade", initial: "J", color: AVATAR_COLORS[1] },
  { name: "Adaeze", initial: "A", color: AVATAR_COLORS[2] },
  { name: "Blessing", initial: "B", color: AVATAR_COLORS[0] },
  { name: "Nadia", initial: "N", color: AVATAR_COLORS[1] },
  { name: "Tiara", initial: "T", color: AVATAR_COLORS[2] },
];

export const SUGGESTED = [
  { name: "Leila", initial: "L", neighborhood: "Bed-Stuy", shared: "Travel, Wellness" },
  { name: "Dami", initial: "D", neighborhood: "Crown Heights", shared: "Entrepreneurship, Food" },
  { name: "Vera", initial: "V", neighborhood: "Harlem", shared: "Arts, Books" },
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Fitness: { bg: "#ffe4ec", text: "#121212" },
  Books: { bg: "#ffb7ce", text: "#121212" },
  Travel: { bg: "#ffe4ec", text: "#ff2d8a" },
  Wellness: { bg: "#ffb7ce", text: "#121212" },
  Food: { bg: "#ffe4ec", text: "#ff2d8a" },
  Nightlife: { bg: "#121212", text: "#ffffff" },
  Entrepreneurship: { bg: "#ff2d8a", text: "#ffffff" },
  "Arts & Culture": { bg: "#ffb7ce", text: "#121212" },
};
