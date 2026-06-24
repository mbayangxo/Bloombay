import type { Band, CityCategory } from "./tokens";

// ── Neighborhood search index ─────────────────────────────────────────────────
export const HOOD_INDEX = [
  { name: "West Village",      slug: "west-village",      borough: "Manhattan",   tags: ["wine bars","date night","italian","cobblestones"] },
  { name: "SoHo",              slug: "soho",               borough: "Manhattan",   tags: ["shopping","brunch","galleries","cast iron"] },
  { name: "Nolita",            slug: "nolita",             borough: "Manhattan",   tags: ["cafés","boutiques","strolling","cool"] },
  { name: "Williamsburg",      slug: "williamsburg",       borough: "Brooklyn",    tags: ["brunch","vintage","rooftops","music"] },
  { name: "DUMBO",             slug: "dumbo",              borough: "Brooklyn",    tags: ["waterfront","galleries","views","arch"] },
  { name: "Brooklyn Heights",  slug: "brooklyn-heights",   borough: "Brooklyn",    tags: ["promenade","brownstones","quiet","views"] },
  { name: "Park Slope",        slug: "park-slope",         borough: "Brooklyn",    tags: ["families","brunch","bookshops","chill"] },
  { name: "Lower East Side",   slug: "lower-east-side",    borough: "Manhattan",   tags: ["bars","live music","vintage","edgy"] },
  { name: "Chelsea",           slug: "chelsea",            borough: "Manhattan",   tags: ["galleries","high line","art","west side"] },
  { name: "Harlem",            slug: "harlem",             borough: "Manhattan",   tags: ["culture","music","soul food","history"] },
  { name: "Astoria",           slug: "astoria",            borough: "Queens",      tags: ["greek food","chill","coffee","affordable"] },
  { name: "Crown Heights",     slug: "crown-heights",      borough: "Brooklyn",    tags: ["culture","caribbean","arts","nightlife"] },
  { name: "Upper East Side",   slug: "upper-east-side",    borough: "Manhattan",   tags: ["museums","elegant","brunch","classic nyc"] },
  { name: "Bushwick",          slug: "bushwick",           borough: "Brooklyn",    tags: ["murals","nightlife","art","studios"] },
  { name: "Flushing",          slug: "flushing",           borough: "Queens",      tags: ["dim sum","asian food","markets","culture"] },
];

// ── Category bands ─────────────────────────────────────────────────────────────
export const BANDS: Band[] = [
  { id: "eat",      label: "EAT",            sub: "Restaurants · Cafés · Bars",              icon: "🍽️", accentColor: "#FF1F7D" },
  { id: "go",       label: "GO",             sub: "Museums · Walks · Things to do",          icon: "🗺️", accentColor: "#E8006A" },
  { id: "solo",     label: "SOLO",           sub: "For your alone time · Self-care · Peace", icon: "🌸", accentColor: "#FF5BAD" },
  { id: "bloomies", label: "BLOOMIES FAVES", sub: "Member picks · Hidden gems · Top spots",  icon: "✦",  accentColor: "#C80060" },
];

// ── Skyline building configs ──────────────────────────────────────────────────
export interface BuildingConfig {
  id: string;
  category?: CityCategory;
  label?: string;
  subLabel?: string;
  width: number;
  height: number;
  wallColor: string;
  windowColor: string;
  windowLitColor: string;
  winCols: number;
  winRows: number;
  rooftop: "flat" | "setback" | "arched" | "stepped" | "tower";
  waterTower?: boolean;
  accentTop?: string;
  filler?: boolean;
}

export const SKYLINE_BUILDINGS: BuildingConfig[] = [
  { id: "fill-1", filler: true, width: 48, height: 118, wallColor: "#7A5438", windowColor: "#1A0A04", windowLitColor: "#F5D080", winCols: 2, winRows: 5, rooftop: "flat" },
  { id: "eat", category: "eat", label: "EAT", subLabel: "Eats · Cafés", width: 112, height: 168, wallColor: "#C8B89A", windowColor: "#3A2A1A", windowLitColor: "#FFDF90", winCols: 4, winRows: 8, rooftop: "stepped", waterTower: true, accentTop: "#B8A88A" },
  { id: "fill-2", filler: true, width: 38, height: 88, wallColor: "#3A4A5A", windowColor: "#0A1A2A", windowLitColor: "#A0D0FF", winCols: 2, winRows: 4, rooftop: "flat" },
  { id: "go", category: "go", label: "GO", subLabel: "Museums · Walks", width: 82, height: 214, wallColor: "#6A8AAA", windowColor: "#0A1A2A", windowLitColor: "#C0E8FF", winCols: 3, winRows: 12, rooftop: "tower", accentTop: "#8AAABF" },
  { id: "fill-3", filler: true, width: 56, height: 104, wallColor: "#8A4A3A", windowColor: "#1A0800", windowLitColor: "#FFD070", winCols: 2, winRows: 5, rooftop: "arched" },
  { id: "solo", category: "solo", label: "SOLO", subLabel: "Self-care · Peace", width: 128, height: 148, wallColor: "#D4C8B4", windowColor: "#2A1A0A", windowLitColor: "#FFE8A0", winCols: 5, winRows: 7, rooftop: "stepped", waterTower: true, accentTop: "#C4B8A4" },
  { id: "fill-4", filler: true, width: 60, height: 134, wallColor: "#5A7A6A", windowColor: "#0A180A", windowLitColor: "#B0FFD0", winCols: 2, winRows: 6, rooftop: "arched" },
  { id: "bloomies", category: "bloomies", label: "BLOOMIES", subLabel: "Member Faves", width: 100, height: 188, wallColor: "#2A3A4A", windowColor: "#050D15", windowLitColor: "#80C4FF", winCols: 4, winRows: 10, rooftop: "setback", accentTop: "#3A4A5A" },
  { id: "fill-5", filler: true, width: 44, height: 96, wallColor: "#6A4A38", windowColor: "#180800", windowLitColor: "#FFCF70", winCols: 2, winRows: 4, rooftop: "flat", waterTower: true },
];

// ── Girl Gems ─────────────────────────────────────────────────────────────────
export const GIRL_GEMS = [
  { name: "Caffe Reggio",   neighborhood: "Greenwich Village", type: "café",      note: "Oldest espresso machine in NYC. Order the cappuccino.", emoji: "☕", color: "#8B4513" },
  { name: "Corner Bar",     neighborhood: "NoHo",             type: "bar",       note: "No sign outside. Tiny, perfect, intimate.",             emoji: "🍷", color: "#722F37" },
  { name: "Bluestockings",  neighborhood: "LES",              type: "bookshop",  note: "Radical feminist bookshop. Buy something.",             emoji: "📚", color: "#1A4A1A" },
  { name: "Lucien",         neighborhood: "East Village",     type: "restaurant",note: "Always full but worth the wait. Order the steak frites.",emoji: "🥩", color: "#8B1A1A" },
  { name: "Housing Works",  neighborhood: "SoHo",             type: "shop",      note: "The best thrift store in NYC. Everything is $5–$40.",   emoji: "🛍", color: "#2A4A7F" },
];

// ── Girl Favorites ─────────────────────────────────────────────────────────────
export const GIRL_FAVS = [
  { name: "Cha Cha Matcha",  neighborhood: "Multiple locations", saves: 847, emoji: "🍵" },
  { name: "Bar Pisellino",   neighborhood: "West Village",       saves: 623, emoji: "🍸" },
  { name: "The Strand",      neighborhood: "Flatiron",           saves: 541, emoji: "📚" },
  { name: "Café Kitsuné",    neighborhood: "West Village",       saves: 488, emoji: "☕" },
  { name: "Russ & Daughters",neighborhood: "LES",                saves: 412, emoji: "🥯" },
];

// ── Eats ──────────────────────────────────────────────────────────────────────
export const EATS_FILTERS = ["Tonight","Date Night","Brunch","Cocktails","Italian","Outdoor","Sushi","Wine Bar","Solo"];

export type RestaurantType = "fine_dining" | "café" | "bar" | "bakery" | "casual";

export interface EatsPartner {
  id: number;
  name: string;
  type: RestaurantType;
  hood: string;
  tagline: string;
  tags: string[];
  saves: number;
  rating: string;
  priceRange: string;
  heroColor: string;
  accentColor: string;
  textColor: string;
  menuHighlights: { item: string; price: string; note?: string }[];
  bloomieNote: string;
  lovedBy: number;
  poem: string;
  polaroidCaption: string;
  hostNote: { from: string; text: string };
  about: string;
  tips: string[];
  girlFavorites: { item: string; note: string; tone: string }[];
  reviews: { name: string; text: string; ago: string }[];
  hours: string;
  instagram: string;
  visited: boolean;
}

export const EATS_PARTNERS: EatsPartner[] = [
  {
    id: 10, name: "Bar Pisellino", type: "bar", hood: "West Village",
    tagline: "Aperitivo hour, every hour",
    tags: ["Italian","Cocktails","Date Night"],
    saves: 847, rating: "4.7", priceRange: "$$",
    heroColor: "#C84A18", accentColor: "#FF7040", textColor: "#FFF5EE",
    menuHighlights: [{ item: "Negroni Sbagliato", price: "$18", note: "the one" }, { item: "Tramezzini", price: "$14" }, { item: "Spritz Flight", price: "$22", note: "3 variations" }],
    bloomieNote: "Get there before 7pm for a seat at the bar.",
    lovedBy: 847, poem: "The kind of corner that turns a Tuesday into a little Italian holiday.",
    polaroidCaption: "marble bar + a spritz + golden hour",
    hostNote: { from: "Maya", text: "Order the Sbagliato and sit at the window. Watch the Village go by. Trust me." },
    about: "A tiny all-day bar with Venetian soul and West Village charm. Espresso in the morning, spritzes from noon, and tramezzini whenever.",
    tips: ["Go before 7pm. The bar seats are everything.", "Cash tips for the bartenders — they remember you."],
    girlFavorites: [{ item: "Negroni Sbagliato", note: "the only answer", tone: "#FFD8C0" }, { item: "Tramezzini", note: "tiny + perfect", tone: "#FFE8D8" }, { item: "Window Seat", note: "best in the house", tone: "#FFF0E4" }],
    reviews: [{ name: "Sara", text: "My go-to before dinner anywhere in the Village. Never misses.", ago: "3 days ago" }, { name: "Jess", text: "The bartender remembered my order from a month ago.", ago: "1 week ago" }, { name: "Lina", text: "Came alone with a book, stayed three hours.", ago: "2 weeks ago" }],
    hours: "Daily, 8AM – 12AM", instagram: "@barpisellino", visited: true,
  },
  {
    id: 11, name: "Café Kitsuné", type: "café", hood: "West Village",
    tagline: "Matcha, sunshine & silence",
    tags: ["Coffee","Matcha","Solo","Pastries"],
    saves: 623, rating: "4.8", priceRange: "$",
    heroColor: "#3A6A38", accentColor: "#8AC878", textColor: "#F0FAF0",
    menuHighlights: [{ item: "Matcha Latte", price: "$8", note: "oat milk" }, { item: "Croissant", price: "$6", note: "always fresh" }, { item: "Cold Brew", price: "$7" }],
    bloomieNote: "Garden seats fill by 11am on weekends.",
    lovedBy: 623, poem: "The kind of place that makes your weekday feel like a soft little secret.",
    polaroidCaption: "sunlight + good coffee + therapy",
    hostNote: { from: "Amina", text: "Order the pistachio matcha and sit by the front window. Go before 11am, trust me." },
    about: "A cosy all-day café with Parisian soul and NYC energy. Perfect for slow mornings, long catch-ups, and solo coffee dates.",
    tips: ["Go before 11am. The light is perfect.", "Ask for the patio in the back!"],
    girlFavorites: [{ item: "Pistachio Matcha", note: "most ordered", tone: "#D8EED0" }, { item: "Almond Croissant", note: "the classic", tone: "#F4E8D0" }, { item: "Window Table", note: "best seat in the house", tone: "#E4F0E0" }],
    reviews: [{ name: "Sara", text: "My go-to write, read, overthink, and glow spot. Never misses.", ago: "3 days ago" }, { name: "Jess", text: "Almond croissant is insane. And the playlist? Chef's kiss.", ago: "1 week ago" }, { name: "Lina", text: "The girls who work here are angels. Feels like home.", ago: "2 weeks ago" }],
    hours: "Daily, 7AM – 7PM", instagram: "@cafekitsune.nyc", visited: true,
  },
  {
    id: 12, name: "Via Carota", type: "fine_dining", hood: "West Village",
    tagline: "Italian soul, no reservations",
    tags: ["Italian","Dinner","Date Night","Brunch"],
    saves: 591, rating: "4.9", priceRange: "$$$",
    heroColor: "#5A1A0A", accentColor: "#D4602A", textColor: "#FFF4EE",
    menuHighlights: [{ item: "Insalata Verde", price: "$19", note: "legendary" }, { item: "Cacio e Pepe", price: "$26" }, { item: "Bistecca", price: "$58", note: "for two" }],
    bloomieNote: "Walk in at 5:30pm or wait. Worth it.",
    lovedBy: 591, poem: "A candlelit corner of Tuscany that somehow landed on Grove Street.",
    polaroidCaption: "candlelight + cacio e pepe + her",
    hostNote: { from: "Dani", text: "Get the insalata verde even if it sounds boring. It will change you." },
    about: "Jody Williams and Rita Sodi's beloved trattoria. No reservations, all heart. The most romantic walk-in in Manhattan.",
    tips: ["Walk in at 5:30pm sharp or expect a wait.", "Sit at the bar if it's just two of you — faster."],
    girlFavorites: [{ item: "Insalata Verde", note: "legendary", tone: "#E8D8C8" }, { item: "Cacio e Pepe", note: "order two", tone: "#F4E4D4" }, { item: "Bar Seats", note: "skip the wait", tone: "#EEDFD0" }],
    reviews: [{ name: "Maya", text: "Took my mom here. She cried. The salad did that.", ago: "5 days ago" }, { name: "Aisha", text: "Waited 45 min and would do it again tomorrow.", ago: "1 week ago" }, { name: "Noor", text: "Date night gold. Candlelight does the flirting for you.", ago: "3 weeks ago" }],
    hours: "Daily, 5PM – 11PM", instagram: "@viacarota", visited: false,
  },
  {
    id: 13, name: "Lucien", type: "casual", hood: "East Village",
    tagline: "French bistro, no fuss",
    tags: ["French","Dinner","Wine","Classic"],
    saves: 412, rating: "4.4", priceRange: "$$",
    heroColor: "#1A1430", accentColor: "#8080C8", textColor: "#F4F0FF",
    menuHighlights: [{ item: "Steak Frites", price: "$38", note: "always" }, { item: "Moules Marinières", price: "$28" }, { item: "Crème Brûlée", price: "$14" }],
    bloomieNote: "Tiny, cash-only, magical. Go early.",
    lovedBy: 412, poem: "Paris squeezed into a shoebox on First Avenue, exactly as it should be.",
    polaroidCaption: "red wine + steak frites + no rush",
    hostNote: { from: "Camille", text: "Sit at the bar, order the steak frites, and let the night decide the rest." },
    about: "A tiny, beloved French bistro that hasn't changed in decades — and that's exactly the point. Candle wax, red wine, good company.",
    tips: ["Go early — it's tiny and fills fast.", "Bring cash. Seriously."],
    girlFavorites: [{ item: "Steak Frites", note: "always", tone: "#E0D8F0" }, { item: "House Red", note: "by the carafe", tone: "#E8E0F4" }, { item: "Corner Booth", note: "if you're lucky", tone: "#DDD4EE" }],
    reviews: [{ name: "Ava", text: "Felt like I was in a French film the entire dinner.", ago: "2 days ago" }, { name: "Riley", text: "The crème brûlée crack is the best sound in NYC.", ago: "1 week ago" }, { name: "Zoe", text: "Came for one drink. Left at 1am. No regrets.", ago: "2 weeks ago" }],
    hours: "Daily, 6PM – 1AM", instagram: "@lucien.nyc", visited: false,
  },
  {
    id: 14, name: "Russ & Daughters", type: "bakery", hood: "Lower East Side",
    tagline: "NYC institution since 1914",
    tags: ["Brunch","Bagels","Breakfast","Iconic"],
    saves: 388, rating: "4.6", priceRange: "$",
    heroColor: "#8B4513", accentColor: "#C87038", textColor: "#FFF8F0",
    menuHighlights: [{ item: "Classic Bagel + Lox", price: "$22", note: "build your own" }, { item: "Appetizing Plate", price: "$28", note: "serves two" }, { item: "Babka", price: "$9", note: "chocolate always" }],
    bloomieNote: "The Appetizing Plate is non-negotiable.",
    lovedBy: 388, poem: "A hundred years of bagels and somehow it still tastes like the first.",
    polaroidCaption: "lox + babka + a Sunday well spent",
    hostNote: { from: "Rachel", text: "Get the appetizing plate, split it with your best friend, and thank me later." },
    about: "Four generations of appetizing on the Lower East Side. The bagels, the lox, the babka — this is the city's breakfast soul.",
    tips: ["Weekday mornings = no line.", "Chocolate babka. Always chocolate."],
    girlFavorites: [{ item: "Appetizing Plate", note: "serves two", tone: "#F0DCC8" }, { item: "Chocolate Babka", note: "always", tone: "#E8D0B8" }, { item: "Everything Bagel", note: "with scallion", tone: "#F4E4D0" }],
    reviews: [{ name: "Hana", text: "Brought my whole book club. We did NOT share well.", ago: "4 days ago" }, { name: "Tess", text: "The babka sold me. I now plan weekends around it.", ago: "1 week ago" }, { name: "Mara", text: "100 years old and still the best bagel in the city.", ago: "3 weeks ago" }],
    hours: "Daily, 8AM – 4PM", instagram: "@russanddaughters", visited: true,
  },
  {
    id: 15, name: "The Four Horsemen", type: "bar", hood: "Williamsburg",
    tagline: "Natural wine & good company",
    tags: ["Wine Bar","Williamsburg","Dinner","Natural Wine"],
    saves: 334, rating: "4.5", priceRange: "$$$",
    heroColor: "#1A2810", accentColor: "#6A9848", textColor: "#F4FEE8",
    menuHighlights: [{ item: "Wine by the Glass", price: "$16–$28" }, { item: "Charcuterie Board", price: "$24" }, { item: "Seasonal Pasta", price: "$32" }],
    bloomieNote: "Ask the sommelier — they actually know.",
    lovedBy: 334, poem: "Where natural wine stops being a personality and starts being a pleasure.",
    polaroidCaption: "orange wine + good lighting + your people",
    hostNote: { from: "Sofia", text: "Tell them what you usually drink and let them pick. They've never been wrong." },
    about: "James Murphy's Williamsburg wine bar with a Michelin star and zero pretension. Natural wines, seasonal plates, perfect acoustics.",
    tips: ["Ask the sommelier — they actually know.", "The seasonal pasta changes weekly. Always order it."],
    girlFavorites: [{ item: "Orange Wine", note: "ask for funky", tone: "#E4ECD4" }, { item: "Seasonal Pasta", note: "changes weekly", tone: "#ECF2DC" }, { item: "Back Corner", note: "the cozy spot", tone: "#DCE8CC" }],
    reviews: [{ name: "Ines", text: "The somm picked a bottle off one sentence. Perfection.", ago: "6 days ago" }, { name: "Dree", text: "Best date spot in Williamsburg, no debate.", ago: "2 weeks ago" }, { name: "Kat", text: "Music + wine + lighting = the whole vibe.", ago: "1 month ago" }],
    hours: "Daily, 5PM – 12AM", instagram: "@fourhorsemenbk", visited: false,
  },
];

// ── Solo ──────────────────────────────────────────────────────────────────────
export const SOLO_MOODS = ["Quiet","Creative","Mindful","Wandering","Indulgent"];

export const SOLO_ACTIVITIES = [
  { id: 1, name: "MoMA Galleries",    type: "ART",       time: "90 min",    note: "Get there at 10am — entire floor to yourself",      accent: "#B0CCE8", bg: "#EDF2FA" },
  { id: 2, name: "The Strand",        type: "BOOKS",     time: "open-ended",note: "Rare books room on the third floor is magic",        accent: "#C9A882", bg: "#FAF2E8" },
  { id: 3, name: "Central Park Loop", type: "WALK",      time: "45 min",    note: "Reservoir track at golden hour",                     accent: "#9AC98A", bg: "#EDF5EC" },
  { id: 4, name: "Café Kitsuné",      type: "COFFEE",    time: "∞",         note: "Matcha latte + journal, always a good idea",         accent: "#E8A0B0", bg: "#FAF0F2" },
  { id: 5, name: "Glossier Flagship", type: "SELF-CARE", time: "30 min",    note: "Actually try everything before you commit",          accent: "#F4C0D0", bg: "#FEF4F6" },
  { id: 6, name: "Jane's Carousel",   type: "DREAMY",    time: "20 min",    note: "Brooklyn Bridge views from the glass pavilion",      accent: "#B8C8E8", bg: "#F2F5FD" },
];

// ── Go ────────────────────────────────────────────────────────────────────────
export const GO_TYPES = ["All","Museums","Outdoors","Markets","Theater","Tours"];

export const GO_EXPERIENCES = [
  { id: 1, name: "The Metropolitan Museum", hood: "UPPER EAST SIDE",  type: "MUSEUM",  tag: "FREE THIS WEEK", big: true,  accent: "#3A5FCD", bg: "#E8EEFF" },
  { id: 2, name: "The High Line",           hood: "WEST CHELSEA",     type: "OUTDOOR", going: 28,             big: false, accent: "#2A9A60", bg: "#E8FFF4" },
  { id: 3, name: "Brooklyn Flea",           hood: "DUMBO",            type: "MARKET",  tag: "THIS WEEKEND",   big: false, accent: "#C4802A", bg: "#FFF5E8" },
  { id: 4, name: "MoMA PS1",               hood: "LONG ISLAND CITY", type: "GALLERY", going: 14,             big: false, accent: "#A04090", bg: "#FEF0FF" },
  { id: 5, name: "Staten Island Ferry",     hood: "LOWER MANHATTAN",  type: "TOUR",    tag: "FREE",           big: false, accent: "#3A5FCD", bg: "#EAF0FF" },
  { id: 6, name: "The Shed",               hood: "HUDSON YARDS",     type: "THEATER", going: 22,             big: false, accent: "#C43A3A", bg: "#FFF0F0" },
];

// ── Trending ──────────────────────────────────────────────────────────────────
export const TICKER_ITEMS = ["VILLA PIZZA","DIOR CAFÉ POP-UP","JAZZ CLUB FRIDAYS","ROOFTOP THURSDAYS","PASTA NIGHT LES","BROOKLYN FLEA","MATCHA BARS","HOTEL BARS","WINE TASTING SOHO"];

export const TREND_LIST = [
  { rank: 1, name: "Italian in the West Village",  tag: "DINING",    count: 247, hot: true,  badge: "✦ MOST SEARCHED" },
  { rank: 2, name: "Dior Café Pop-Up on Madison",  tag: "POP-UP",    count: 188, hot: true,  badge: "✦ NEW" },
  { rank: 3, name: "Late Night Jazz in Harlem",    tag: "NIGHTLIFE", count: 156, hot: false, badge: null },
  { rank: 4, name: "Rooftop Bars This Season",     tag: "DRINKS",    count: 134, hot: false, badge: null },
  { rank: 5, name: "Sunday Brunch: Best Spots",    tag: "BRUNCH",    count: 119, hot: false, badge: null },
  { rank: 6, name: "The Quiet Luxury Hotel Bars",  tag: "COCKTAILS", count: 98,  hot: false, badge: null },
  { rank: 7, name: "Gallery Openings This Week",   tag: "ART",       count: 87,  hot: false, badge: null },
  { rank: 8, name: "Korean BBQ in Koreatown",      tag: "DINING",    count: 76,  hot: false, badge: null },
];

// ── Bloomies Picks ────────────────────────────────────────────────────────────
export const BLOOM_PICKS = [
  { id: 1, name: "Bar Pisellino",         cat: "DINING",    hood: "WEST VILLAGE",    stars: 5, saves: 312, note: "The martini. The marble bar. The people.",          accent: "#D4A070", bg: "#1A0C08" },
  { id: 2, name: "The Standard Spa",      cat: "SELF-CARE", hood: "MEATPACKING",     stars: 5, saves: 284, note: "Book 3 weeks ahead. Worth every minute.",           accent: "#E8B0C0", bg: "#140A0C" },
  { id: 3, name: "Café Kitsuné",          cat: "COFFEE",    hood: "WEST VILLAGE",    stars: 5, saves: 256, note: "Matcha in the garden with a good book.",            accent: "#A8C890", bg: "#0C1408" },
  { id: 4, name: "Brooklyn Museum",       cat: "ART",       hood: "CROWN HEIGHTS",   stars: 4, saves: 198, note: "First Saturday of the month is free + a party.",    accent: "#9090D8", bg: "#08080E" },
  { id: 5, name: "Russ & Daughters",      cat: "BRUNCH",    hood: "LOWER EAST SIDE", stars: 5, saves: 176, note: "The appetizing plate. Every. Single. Time.",         accent: "#D8A050", bg: "#181008" },
  { id: 6, name: "Vessel (Hudson Yards)", cat: "ICONIC",    hood: "HUDSON YARDS",    stars: 4, saves: 154, note: "Go at sunset for the best light.",                   accent: "#C0B090", bg: "#101008" },
];
