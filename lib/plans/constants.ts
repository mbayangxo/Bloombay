export const PINK = "#FF1F7D";

export const THEME = {
  pageBg:       "#FFFFFF",
  topBar:       "rgba(255,255,255,0.97)",
  topBarBorder: "rgba(255,31,125,0.12)",
  cardBg:       "#FFFFFF",
  cardBorder:   "rgba(255,31,125,0.15)",
  heading:      "#111111",
  subText:      "rgba(0,0,0,0.6)",
  label:        "rgba(0,0,0,0.38)",
  sectionBg:    "#FFF5F8",
  inputBg:      "#FFF5F8",
};

export const MONTH_THEMES = [
  /* 0 Jan */ { headerGrad:"linear-gradient(160deg,#F0EDE8 0%,#E8E4DF 100%)", binding:"#A8A0A8", accent:"#8A9DC0", textColor:"#3A3228", deco:"❄️", decoExtra:["✦","❄","✦"], watermark:"WINTER", gridBg:"#FDFAF7", todayRing:"#8A9DC0" },
  /* 1 Feb */ { headerGrad:"linear-gradient(160deg,#FCE0E8 0%,#F8C8D4 100%)", binding:"#D4607A", accent:"#CC3355", textColor:"#7A1530", deco:"💕", decoExtra:["♡","♥","♡"], watermark:"LOVE",   gridBg:"#FFF5F8", todayRing:"#CC3355" },
  /* 2 Mar */ { headerGrad:"linear-gradient(160deg,#EDF5EC 0%,#D8EED5 100%)", binding:"#6A9E68", accent:"#4A8A48", textColor:"#1A3818", deco:"🌸", decoExtra:["✿","❀","✿"], watermark:"BLOOM",  gridBg:"#F6FCF5", todayRing:"#4A8A48" },
  /* 3 Apr */ { headerGrad:"linear-gradient(160deg,#EDE8F8 0%,#DDD5F5 100%)", binding:"#8A70C8", accent:"#6A50B8", textColor:"#2A1860", deco:"🦋", decoExtra:["✦","✿","✦"], watermark:"SPRING", gridBg:"#F7F4FD", todayRing:"#6A50B8" },
  /* 4 May */ { headerGrad:"linear-gradient(160deg,#FEFAE0 0%,#FBF0C0 100%)", binding:"#C8A820", accent:"#A88808", textColor:"#4A3800", deco:"🌼", decoExtra:["☀","✦","☀"], watermark:"GOLDEN", gridBg:"#FFFDF0", todayRing:"#C8A820" },
  /* 5 Jun */ { headerGrad:"linear-gradient(160deg,#FFD0E8 0%,#FFB0D4 100%)", binding:"#FF1F7D", accent:"#FF1F7D", textColor:"#7A0038", deco:"🌺", decoExtra:["✦","❋","✦"], watermark:"BLOOM",  gridBg:"#FFF0F8", todayRing:"#FF1F7D" },
  /* 6 Jul */ { headerGrad:"linear-gradient(160deg,#FFE8D8 0%,#FFD0B8 100%)", binding:"#E07040", accent:"#C05028", textColor:"#5A1808", deco:"🐚", decoExtra:["〰","≈","〰"], watermark:"SUMMER", gridBg:"#FFF8F5", todayRing:"#E07040" },
  /* 7 Aug */ { headerGrad:"linear-gradient(160deg,#D8EEF8 0%,#C0E0F5 100%)", binding:"#3888C8", accent:"#1870B0", textColor:"#083858", deco:"🌊", decoExtra:["≈","〰","≈"], watermark:"WAVES",  gridBg:"#F5FAFE", todayRing:"#3888C8" },
  /* 8 Sep */ { headerGrad:"linear-gradient(160deg,#F8ECD8 0%,#F5DFC0 100%)", binding:"#C88040", accent:"#A86020", textColor:"#4A2808", deco:"🍂", decoExtra:["✦","❋","✦"], watermark:"GOLDEN", gridBg:"#FFFBF5", todayRing:"#C88040" },
  /* 9 Oct */ { headerGrad:"linear-gradient(160deg,#ECD8F5 0%,#DCC0F0 100%)", binding:"#8840C8", accent:"#6820A8", textColor:"#280848", deco:"🌙", decoExtra:["✦","★","✦"], watermark:"MAGIC",  gridBg:"#FAF5FF", todayRing:"#8840C8" },
  /* 10 Nov*/ { headerGrad:"linear-gradient(160deg,#F0E8DC 0%,#E8D8C4 100%)", binding:"#987060", accent:"#785040", textColor:"#381808", deco:"🍁", decoExtra:["✦","❋","✦"], watermark:"COZY",   gridBg:"#FBF7F3", todayRing:"#987060" },
  /* 11 Dec*/ { headerGrad:"linear-gradient(160deg,#F8E8F0 0%,#F0D0E4 100%)", binding:"#A82058", accent:"#881040", textColor:"#480820", deco:"⭐", decoExtra:["❄","✦","❄"], watermark:"JOY",    gridBg:"#FDF5F8", todayRing:"#A82058" },
];

export const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
export const DAY_FULL    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export type StickerPackId = "bloom" | "hearts" | "glam" | "stars" | "nyc";

export const STICKER_PACKS: Record<StickerPackId, string[]> = {
  bloom:  ["🌸","🌺","🌷","🌹","💐","🪷","🌼","🌻","🌿","🍃","🌱","🪴","🫧","🪻","🌾","❀","✿","🎋"],
  hearts: ["💕","💖","💗","💝","❤️","🩷","💞","💌","💘","🫶","💓","♥️","❣️","🎀","🩰","💟","🫦","🌹"],
  glam:   ["💎","👑","🎀","💄","👠","💍","🪞","🛁","🫧","💅","🪭","🧴","🥂","🍾","🌟","✨","💫","🪩"],
  stars:  ["✨","⭐","🌟","💫","🌙","☀️","🌈","🌠","🎇","🎆","🌌","🔮","⚡","🎑","🌛","🌜","★","☆"],
  nyc:    ["🗽","🌆","🚕","🏙","🌉","🚇","🍕","🥯","☕","🌃","🛗","🌁","🎭","🎪","🍎","📸","🎶","🏟"],
};
