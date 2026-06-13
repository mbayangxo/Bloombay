"use client";

import React, { useState } from "react";
import Link from "next/link";
import { use } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const GOLD  = "#D4A853";
const DARK  = "#1C1B1C";

const PAPER_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

// ── Neighborhood data ──────────────────────────────────────────────────────────
interface NeighborhoodData {
  name: string;
  borough: string;
  tagline: string;
  vibe: string[];
  bloomies: number;
  heroBg: string;
  heroAccent: string;
  eats: { name: string; type: string; note: string; saves: number; hot?: boolean }[];
  trending: { name: string; tag: string; detail: string; going: number }[];
  popular: { name: string; cat: string; saves: number; note: string; accent: string }[];
  hidden: { name: string; tip: string }[];
}

const NEIGHBORHOODS: Record<string, NeighborhoodData> = {
  "west-village": {
    name: "West Village",
    borough: "MANHATTAN",
    tagline: "Cobblestones, candlelight, and the best martini of your life.",
    vibe: ["Date Night", "Brunch", "Wine Bars", "Boutiques"],
    bloomies: 892,
    heroBg: "linear-gradient(155deg, #2A0818 0%, #3A1020 55%, #1A0810 100%)",
    heroAccent: "#D4A853",
    eats: [
      { name: "Bar Pisellino",    type: "COCKTAIL BAR",  note: "The negroni at the marble bar. Go at 6pm before the crowd.", saves: 412, hot: true },
      { name: "Via Carota",       type: "ITALIAN",        note: "Insalata verde. No reservations. Worth the wait.",           saves: 387 },
      { name: "Buvette",          type: "FRENCH BISTRO",  note: "Croque madame, 10am, window seat. Perfect.",                saves: 301 },
      { name: "L'Artusi",         type: "PASTA",          note: "Birthday dinner energy every single night.",                saves: 244 },
      { name: "Café Kitsuné",     type: "COFFEE",         note: "Matcha latte + journal. Their garden is everything.",       saves: 198 },
    ],
    trending: [
      { name: "Hotel Barrière Le Fouquet's", tag: "HOTEL BAR",  detail: "New and already the it spot for Sunday aperitivo",  going: 67 },
      { name: "Omar's La Ranita",            tag: "WINE BAR",   detail: "Natural wine, tiny tables, perfect strangers",       going: 48 },
      { name: "August",                      tag: "SEASONAL",   detail: "Their spring menu just dropped and it's stunning",   going: 34 },
    ],
    popular: [
      { name: "Bar Pisellino",  cat: "DRINKS",   saves: 412, note: "The martini. The marble bar. The people.",  accent: "#D4A070" },
      { name: "Via Carota",     cat: "DINING",   saves: 387, note: "No apps needed. Just go.",                  accent: "#E8B080" },
      { name: "Buvette",        cat: "BRUNCH",   saves: 301, note: "A little piece of Paris on Grove St.",      accent: "#C090D0" },
      { name: "Magnolia Bakery",cat: "DESSERT",  saves: 276, note: "Banana pudding. That's it.",                accent: "#F0C090" },
      { name: "Three Lives & Co",cat: "BOOKS",   saves: 234, note: "The best independent bookshop in NYC.",     accent: "#9080B0" },
    ],
    hidden: [
      { name: "The Waverly Inn",       tip: "Ring the bell. No sign outside. Ask for the back room." },
      { name: "Ty's Bar",              tip: "The oldest gay bar in NYC. Everyone's welcome. Cash only." },
      { name: "Bedford Cheese Shop",   tip: "Staff pick a cheese for you. Never wrong once." },
    ],
  },
  "soho": {
    name: "SoHo",
    borough: "MANHATTAN",
    tagline: "Cast iron, concept stores, and the city's best people-watching.",
    vibe: ["Shopping", "Galleries", "Brunch", "Fashion"],
    bloomies: 1204,
    heroBg: "linear-gradient(155deg, #080818 0%, #100820 55%, #06060E 100%)",
    heroAccent: "#6BB5F5",
    eats: [
      { name: "Sadelle's",          type: "BRUNCH",      note: "Tower of bagels. Reserve ahead. Worth every minute.", saves: 334, hot: true },
      { name: "La Mercerie",        type: "FRENCH CAFÉ",  note: "The most beautiful room in SoHo. Go for lunch.",     saves: 289 },
      { name: "Sant Ambroeus SoHo", type: "ITALIAN",      note: "Milanese in Manhattan. The espresso is perfect.",    saves: 251 },
      { name: "Balthazar",          type: "BRASSERIE",    note: "Classic. Brunch on Saturday. Steak frites.",          saves: 312 },
      { name: "Felix",              type: "WINE BAR",     note: "Outdoor tables on West Broadway. Très chic.",         saves: 167 },
    ],
    trending: [
      { name: "KITH Treats",       tag: "DESSERT POP-UP", detail: "Cereal milk soft serve. The line is worth it.", going: 89 },
      { name: "Miu Miu Café",      tag: "POP-UP CAFÉ",    detail: "Only here through the end of the season",        going: 143 },
      { name: "Zero Bond terrace", tag: "MEMBERS CLUB",   detail: "If you know, you know. Ask around.",              going: 31 },
    ],
    popular: [
      { name: "Balthazar",       cat: "DINING",   saves: 312, note: "NYC institution. Never gets old.",        accent: "#C4A070" },
      { name: "Sadelle's",       cat: "BRUNCH",   saves: 334, note: "The tower. Get the lox.",                 accent: "#E0A080" },
      { name: "Opening Ceremony",cat: "FASHION",  saves: 201, note: "Rotating designers. Always something new.", accent: "#9090D8" },
      { name: "Housing Works",   cat: "VINTAGE",  saves: 189, note: "Best thrift in NYC. Patient hunting.",     accent: "#A8C890" },
      { name: "McNally Jackson", cat: "BOOKS",    saves: 178, note: "Staff recs are always spot on.",           accent: "#D8C060" },
    ],
    hidden: [
      { name: "The Ear Inn",         tip: "Oldest bar in NYC (1817). Order the burger. Sit at the bar." },
      { name: "Vesuvio Playground",  tip: "Hidden pocket park off Prince St. Perfect reading spot." },
      { name: "Fanelli's Café",      tip: "Since 1847. Cash only. The cheeseburger is underrated." },
    ],
  },
  "williamsburg": {
    name: "Williamsburg",
    borough: "BROOKLYN",
    tagline: "Waterfront views, vintage finds, and brunch that goes until 5pm.",
    vibe: ["Brunch", "Vintage", "Live Music", "Rooftops"],
    bloomies: 743,
    heroBg: "linear-gradient(155deg, #0A1A10 0%, #142A18 55%, #081408 100%)",
    heroAccent: "#A8C97A",
    eats: [
      { name: "Lilia",           type: "PASTA",     note: "The mafaldini with pink peppercorns. Reserve weeks ahead.", saves: 445, hot: true },
      { name: "Marlow & Sons",   type: "OYSTER BAR", note: "Sunday afternoon oysters. The vibe is unmatched.",        saves: 278 },
      { name: "Bonnie's",        type: "CANTONESE",  note: "Fusion done right. Small plates, big flavor.",             saves: 231 },
      { name: "Peter Luger",     type: "STEAKHOUSE", note: "Cash only. Call ahead. Order the bacon.",                  saves: 356 },
      { name: "Diner",           type: "AMERICAN",   note: "No printed menu. Whatever's fresh. Always good.",          saves: 189 },
    ],
    trending: [
      { name: "TALEA Beer Co",         tag: "BREWERY",    detail: "Female-founded. Their pink lager is perfect.", going: 58 },
      { name: "Brooklyn Winery",       tag: "WINE TASTING", detail: "Tours on weekends, intimate and lovely",     going: 42 },
      { name: "Domino Park sunsets",   tag: "OUTDOOR",    detail: "The whole city shows up. Bring a blanket.",   going: 211 },
    ],
    popular: [
      { name: "Lilia",            cat: "DINING",    saves: 445, note: "Best pasta in New York. Full stop.",       accent: "#D4A070" },
      { name: "Smorgasburg",      cat: "FOOD MKTPLACE", saves: 389, note: "Saturdays at the waterfront. Go hungry.", accent: "#E8A080" },
      { name: "Artists & Fleas",  cat: "VINTAGE",   saves: 267, note: "Weekend market. Local designers only.",   accent: "#C0B090" },
      { name: "Domino Park",      cat: "OUTDOOR",   saves: 312, note: "East River views. Free, forever.",        accent: "#A8C890" },
      { name: "Rough Trade",      cat: "RECORDS",   saves: 198, note: "Best vinyl selection in Brooklyn.",       accent: "#9090B8" },
    ],
    hidden: [
      { name: "Maison Première",     tip: "Absinthe and oysters in a 1920s New Orleans bar. Unmissable." },
      { name: "Night of Joy",        tip: "Tiny dive bar. Best jukebox in Brooklyn. Go after 11pm." },
      { name: "Spritzenhaus",        tip: "Hidden beer garden. Huge space. Bring the whole group." },
    ],
  },
  "nolita": {
    name: "Nolita",
    borough: "MANHATTAN",
    tagline: "Four blocks. Infinite cool. The best neighborhood nobody can spell.",
    vibe: ["Boutiques", "Cafés", "Brunch", "Strolling"],
    bloomies: 567,
    heroBg: "linear-gradient(155deg, #1A0A08 0%, #2A1410 55%, #120806 100%)",
    heroAccent: "#FF9B70",
    eats: [
      { name: "Café Gitane",     type: "CAFÉ",        note: "Avocado toast before it was everywhere. The original.", saves: 312, hot: true },
      { name: "Lovely Day",      type: "THAI-FUSION",  note: "Bowl of Thai green curry on the way home. Always.",   saves: 234 },
      { name: "Rubirosa",        type: "PIZZA",        note: "Thin crust vodka pie. Arrive at 5:30 to skip the line.", saves: 289 },
      { name: "Spring Street Natural", type: "HEALTHY", note: "Since 1973. The grains bowl. Feel virtuous after.",  saves: 156 },
      { name: "Estela",          type: "WINE BAR",     note: "Small plates, natural wine, always someone interesting.", saves: 278 },
    ],
    trending: [
      { name: "Atla",          tag: "MEXICAN",       detail: "New Enrique Olvera spot. Bright, buzzy, delicious.", going: 72 },
      { name: "La Esquina",    tag: "TAQUERIA",      detail: "The basement brasserie. Ring the buzzer.",           going: 54 },
      { name: "Café Habana",   tag: "CUBAN",         detail: "The Mexican corn. Been here since always. Still #1.", going: 91 },
    ],
    popular: [
      { name: "Café Gitane",   cat: "CAFÉ",    saves: 312, note: "The definitive Nolita table.",        accent: "#E8A870" },
      { name: "Rubirosa",      cat: "PIZZA",   saves: 289, note: "Thin, crispy, perfect.",              accent: "#E08870" },
      { name: "Estela",        cat: "WINE",    saves: 278, note: "The burrata with salsa verde.",       accent: "#C0B090" },
      { name: "Warm",          cat: "FASHION", saves: 201, note: "NY-made clothes. Worth every penny.", accent: "#D0A0C0" },
      { name: "Bureau Again",  cat: "VINTAGE", saves: 178, note: "Curated consignment. Serious finds.", accent: "#A0B0C8" },
    ],
    hidden: [
      { name: "Puck Building courtyard", tip: "Hidden garden between Prince & Houston. Nobody knows it." },
      { name: "Fiore's",                 tip: "Old-school deli. No Yelp listing. The regulars hate that." },
      { name: "DeSalvio Playground",     tip: "Best espresso from the cart on Mulberry at 8am." },
    ],
  },
  "dumbo": {
    name: "DUMBO",
    borough: "BROOKLYN",
    tagline: "Manhattan Bridge views, converted warehouses, and weekend art crawls.",
    vibe: ["Waterfront", "Galleries", "Architecture", "Views"],
    bloomies: 489,
    heroBg: "linear-gradient(155deg, #080C1A 0%, #101828 55%, #060A14 100%)",
    heroAccent: "#7BA8E0",
    eats: [
      { name: "Time Out Market",    type: "FOOD HALL",  note: "Every cuisine under one roof. Rooftop bar with bridge views.", saves: 356, hot: true },
      { name: "Grimaldi's",         type: "PIZZA",      note: "Coal-fired thin crust. The original. Worth every wait.",       saves: 312 },
      { name: "Juliana's",          type: "PIZZA",      note: "The founder's comeback. White pie with fresh mozzarella.",     saves: 289 },
      { name: "Superfine",          type: "BRUNCH",     note: "Pool table, organic eggs, and the best bloody mary.",          saves: 178 },
    ],
    trending: [
      { name: "1 Hotel Brooklyn Bridge", tag: "ROOFTOP BAR", detail: "Sustainable luxury with the best view in the borough.", going: 94 },
      { name: "Empire Stores",           tag: "MARKET",      detail: "Weekend market in the converted Civil War warehouse.",   going: 61 },
      { name: "Brooklyn Bridge Park",    tag: "OUTDOOR",     detail: "Pier 6 beach volleyball and sunset picnics.",           going: 187 },
    ],
    popular: [
      { name: "Brooklyn Bridge Park", cat: "OUTDOOR",  saves: 421, note: "NYC's most scenic green space.",        accent: "#7BA8E0" },
      { name: "Grimaldi's",           cat: "DINING",   saves: 312, note: "The pilgrimage pizza.",                 accent: "#E07070" },
      { name: "PowerHouse Arena",     cat: "BOOKS",    saves: 234, note: "Gallery + bookshop. Always an exhibit.", accent: "#D4A070" },
      { name: "DUMBO Arts District",  cat: "CULTURE",  saves: 198, note: "Open studios every October.",           accent: "#C090D0" },
    ],
    hidden: [
      { name: "Jane's Carousel",          tip: "1922 carousel in a glass pavilion. $2. Pure magic at dusk." },
      { name: "Archway under the bridge", tip: "The spot photographers queue for. Go in morning light." },
      { name: "Foragers Market",          tip: "Tiny organic grocery on Adams. Best coffee in DUMBO, no line." },
    ],
  },
  "brooklyn-heights": {
    name: "Brooklyn Heights",
    borough: "BROOKLYN",
    tagline: "Promenade views, brownstone quiet, and the city's most civilized pace.",
    vibe: ["Promenade", "Brownstones", "Quiet", "Classic"],
    bloomies: 312,
    heroBg: "linear-gradient(155deg, #100818 0%, #1C1024 55%, #0C0814 100%)",
    heroAccent: "#B09FD8",
    eats: [
      { name: "Henry's End",       type: "AMERICAN",     note: "Neighborhood institution. Game menu in winter. Book it.", saves: 201, hot: true },
      { name: "Jack the Horse",    type: "BRUNCH",       note: "Tiny, perfect, everything made in-house.",               saves: 178 },
      { name: "Colonie",           type: "NEW AMERICAN", note: "Farm-to-table before it was a phrase. Still the best.",   saves: 234 },
      { name: "Noodle Pudding",    type: "ITALIAN",      note: "No reservations, cash only, always worth the wait.",     saves: 156 },
    ],
    trending: [
      { name: "Brooklyn Heights Promenade", tag: "OUTDOOR",   detail: "The Manhattan skyline at magic hour. Unmissable.", going: 312 },
      { name: "The Invisible Dog",          tag: "ART SPACE", detail: "Monthly openings in a converted factory.",          going: 43 },
      { name: "Sahadi's",                   tag: "MARKET",    detail: "Middle Eastern grocery since 1948. The best olives.", going: 67 },
    ],
    popular: [
      { name: "Brooklyn Promenade", cat: "OUTDOOR", saves: 489, note: "The Manhattan skyline. Every time.",    accent: "#B09FD8" },
      { name: "Colonie",            cat: "DINING",  saves: 234, note: "The roasted chicken. Perfect.",         accent: "#D4A070" },
      { name: "Sahadi's",           cat: "MARKET",  saves: 198, note: "56 varieties of olive. Not kidding.",   accent: "#A8C870" },
      { name: "Heights Cinema",     cat: "CULTURE", saves: 156, note: "Indie films, $12. Bring a date.",       accent: "#90A8D8" },
    ],
    hidden: [
      { name: "Pierrepont Playground", tip: "Hidden garden square locals guard like a secret. Bring coffee." },
      { name: "Long Island Bar",       tip: "1950s diner transformed. The martini is perfect." },
      { name: "St. Ann's Warehouse",   tip: "World-class theater in an old tobacco warehouse. Check what's on." },
    ],
  },
  "park-slope": {
    name: "Park Slope",
    borough: "BROOKLYN",
    tagline: "Prospect Park mornings, bookshops, and brunch that lasts all afternoon.",
    vibe: ["Families", "Brunch", "Bookshops", "Parks"],
    bloomies: 654,
    heroBg: "linear-gradient(155deg, #0A1810 0%, #141C10 55%, #08140A 100%)",
    heroAccent: "#90C880",
    eats: [
      { name: "Olmsted",            type: "NEW AMERICAN",  note: "Garden dining. Seasonal menu. Book a month ahead.",      saves: 389, hot: true },
      { name: "Miriam",             type: "ISRAELI",       note: "Shakshuka on the patio. Brunch lines out the door.",     saves: 267 },
      { name: "Convivium Osteria",  type: "MEDITERRANEAN", note: "Cave-like room, incredible wine list, perfect pasta.",   saves: 234 },
      { name: "Bare Burger",        type: "BURGERS",       note: "Organic, grass-fed, best in the slope.",                 saves: 178 },
    ],
    trending: [
      { name: "Prospect Park Boathouse", tag: "OUTDOOR",      detail: "Free concerts on the water all summer.",              going: 234 },
      { name: "Community Bookstore",     tag: "BOOKS",         detail: "Beloved indie since 1971. Staff picks are perfect.",  going: 89 },
      { name: "Grand Army",              tag: "COCKTAIL BAR",  detail: "Aperitivo hour 5-7pm. Outstanding negroni.",         going: 67 },
    ],
    popular: [
      { name: "Prospect Park",      cat: "OUTDOOR", saves: 567, note: "Brooklyn's backyard. Any time, any season.",   accent: "#90C880" },
      { name: "Olmsted",            cat: "DINING",  saves: 389, note: "The garden dinner experience.",                accent: "#D4A070" },
      { name: "Community Bookstore", cat: "BOOKS",  saves: 278, note: "Indie bookshop with 50 years of soul.",        accent: "#C090B0" },
      { name: "Nitehawk Cinema",    cat: "CULTURE", saves: 201, note: "Dinner and a film. Both are great.",           accent: "#9090D0" },
    ],
    hidden: [
      { name: "Rocky Sullivan's", tip: "Irish bar on Lexington. Bluegrass on Wednesdays. Divey in the best way." },
      { name: "Sunday mornings",  tip: "The farmers market on Grand Army Plaza. Every Sunday. Get the cheese." },
      { name: "Nitehawk Cinema",  tip: "The bar opens 90 mins before each film. Go early." },
    ],
  },
  "lower-east-side": {
    name: "Lower East Side",
    borough: "MANHATTAN",
    tagline: "Dive bars, live music, vintage rails, and the city's best late-night energy.",
    vibe: ["Bars", "Live Music", "Vintage", "Nightlife"],
    bloomies: 534,
    heroBg: "linear-gradient(155deg, #120808 0%, #1E0C10 55%, #0E0608 100%)",
    heroAccent: "#E05858",
    eats: [
      { name: "Katz's Delicatessen",   type: "DELI",        note: "The pastrami on rye. The whole vibe. Get here early.",  saves: 445, hot: true },
      { name: "Ivan Ramen",            type: "RAMEN",       note: "Shio ramen. Minimalist. Outstanding.",                   saves: 312 },
      { name: "Russ & Daughters",      type: "APPETIZING",  note: "Since 1914. The best lox in the world. Period.",         saves: 389 },
      { name: "Clinton St. Baking",    type: "BRUNCH",      note: "The blueberry pancakes. Reserve ahead on weekends.",     saves: 267 },
    ],
    trending: [
      { name: "Metrograph",  tag: "CINEMA",       detail: "Curated film, great café, excellent people-watching.", going: 78 },
      { name: "Good Room",   tag: "CLUB",         detail: "The best DJ nights in the city. Intimate and loud.",   going: 134 },
      { name: "Attaboy",     tag: "COCKTAIL BAR", detail: "No menu. Tell them what you like. Always perfect.",    going: 56 },
    ],
    popular: [
      { name: "Katz's Delicatessen", cat: "ICONIC",  saves: 445, note: "A New York institution since 1888.",    accent: "#E05858" },
      { name: "Russ & Daughters",    cat: "DINING",  saves: 389, note: "The lox, the cream cheese, the bagel.", accent: "#D4A070" },
      { name: "Metrograph",          cat: "CULTURE", saves: 267, note: "The lounge bar before a 7pm screening.", accent: "#9090D0" },
      { name: "Orchard Street",      cat: "VINTAGE", saves: 234, note: "The whole street on a Sunday afternoon.", accent: "#A8C870" },
    ],
    hidden: [
      { name: "Verlaine",      tip: "On Rivington. Happy hour 5-9pm. The cocktails are the point." },
      { name: "Pianos",        tip: "Live music downstairs, bar upstairs. $5-10 cover. Always a vibe." },
      { name: "Economy Candy", tip: "Since 1937. Floor-to-ceiling sweets. You'll spend $40 minimum." },
    ],
  },
  "chelsea": {
    name: "Chelsea",
    borough: "MANHATTAN",
    tagline: "World-class galleries, the High Line, and the best Saturday afternoon in the city.",
    vibe: ["Galleries", "High Line", "Art", "West Side"],
    bloomies: 678,
    heroBg: "linear-gradient(155deg, #080E18 0%, #0C1424 55%, #060C14 100%)",
    heroAccent: "#6898D8",
    eats: [
      { name: "The Cookshop",  type: "BRUNCH",   note: "Art world brunch. Farm-to-table before the galleries.",  saves: 289, hot: true },
      { name: "Tía Pol",       type: "TAPAS",    note: "Tiny, always packed, spectacular pintxos.",              saves: 234 },
      { name: "Los Mariscos",  type: "MEXICAN",  note: "Chelsea Market. The best fish taco in the city.",        saves: 312 },
      { name: "Café Grumpy",   type: "COFFEE",   note: "First café in Chelsea to take coffee seriously.",        saves: 198 },
    ],
    trending: [
      { name: "Hauser & Wirth",      tag: "GALLERY",  detail: "The current show is unmissable. Free on Mondays.",      going: 89 },
      { name: "High Line at sunset", tag: "OUTDOOR",  detail: "The light at 6pm on the elevated park. Bring a friend.", going: 412 },
      { name: "David Zwirner",       tag: "GALLERY",  detail: "Three-floor Chelsea space. Multiple shows at once.",     going: 67 },
    ],
    popular: [
      { name: "The High Line",    cat: "OUTDOOR",   saves: 567, note: "The best urban park in the world.",          accent: "#90C880" },
      { name: "Chelsea Market",   cat: "FOOD HALL", saves: 445, note: "The original. Still the best.",              accent: "#D4A070" },
      { name: "Gallery district", cat: "CULTURE",   saves: 389, note: "25th-26th Street. 60+ galleries.",           accent: "#6898D8" },
      { name: "Whitney Museum",   cat: "MUSEUM",    saves: 312, note: "American art + the Hudson from the terrace.", accent: "#C090B0" },
    ],
    hidden: [
      { name: "The Half King",    tip: "Literary bar co-founded by Sebastian Junger. Book readings upstairs." },
      { name: "Printed Matter",   tip: "Artist books and zines. You'll be here two hours. Budget for it." },
      { name: "High Line Hotel",  tip: "The Gothic seminary turned hotel garden. Free to sit in. A secret garden." },
    ],
  },
  "harlem": {
    name: "Harlem",
    borough: "MANHATTAN",
    tagline: "The birthplace of a movement. Jazz, soul food, and culture that fills every block.",
    vibe: ["Culture", "Music", "Soul Food", "History"],
    bloomies: 421,
    heroBg: "linear-gradient(155deg, #180808 0%, #241010 55%, #120606 100%)",
    heroAccent: "#E0982A",
    eats: [
      { name: "Sylvia's",              type: "SOUL FOOD", note: "Since 1962. Fried chicken. Sunday gospel brunch. Required.", saves: 445, hot: true },
      { name: "Red Rooster",           type: "AMERICAN",  note: "Marcus Samuelsson's love letter to Harlem. Always buzzing.", saves: 389 },
      { name: "Patisserie des Ambassades", type: "BAKERY", note: "Senegalese pastry. The best croissant outside Paris.",     saves: 256 },
      { name: "Melba's",               type: "SOUL FOOD", note: "Waffle and chicken. The signature. The real deal.",         saves: 312 },
    ],
    trending: [
      { name: "The Den",              tag: "JAZZ BAR",   detail: "Live jazz Thursday-Sunday. Intimate, historic, perfect.", going: 67 },
      { name: "Ginny's Supper Club",  tag: "LIVE MUSIC", detail: "Red Rooster's basement. Brunch with live jazz.",          going: 89 },
      { name: "MIST Harlem",          tag: "FILM",       detail: "Black cinema hub. Screenings, talks, community.",         going: 43 },
    ],
    popular: [
      { name: "Sylvia's",        cat: "DINING",  saves: 445, note: "A Harlem institution since 1962.",    accent: "#E0982A" },
      { name: "Apollo Theater",  cat: "CULTURE", saves: 412, note: "Amateur Night on Wednesdays. Go.",    accent: "#C47830" },
      { name: "Red Rooster",     cat: "DINING",  saves: 389, note: "The chicken and waffle. Every time.", accent: "#D4A070" },
      { name: "Studio Museum",   cat: "MUSEUM",  saves: 278, note: "Black artists. Powerful, essential.", accent: "#8090D0" },
    ],
    hidden: [
      { name: "Shrine World Music Venue", tip: "African music and soul food. The best kept secret on 133rd St." },
      { name: "Serengeti Teas",           tip: "African tea house on 116th. Spiced chai that changes everything." },
      { name: "Harlem Shake",             tip: "The milkshakes at the counter, 1960s diner style. Order the classic." },
    ],
  },
  "astoria": {
    name: "Astoria",
    borough: "QUEENS",
    tagline: "Greek coffee, diverse bites, and a neighborhood that still feels like real New York.",
    vibe: ["Greek Food", "Coffee", "Chill", "Affordable"],
    bloomies: 289,
    heroBg: "linear-gradient(155deg, #0A1018 0%, #141820 55%, #080C14 100%)",
    heroAccent: "#80A8D8",
    eats: [
      { name: "Taverna Kyclades",  type: "GREEK",         note: "Grilled fish, lemon, olive oil. Queue for it. Worth it.",     saves: 312, hot: true },
      { name: "Butcher Bar",       type: "BBQ",           note: "Wood-smoked brisket in Queens. The dark horse of NYC BBQ.",   saves: 234 },
      { name: "Elias Corner",      type: "GREEK SEAFOOD", note: "No menu. They tell you what's fresh. Always the right call.", saves: 201 },
      { name: "Astoria Coffee",    type: "COFFEE",        note: "The neighborhood third wave. Great single origins.",          saves: 178 },
    ],
    trending: [
      { name: "MoMA PS1",               tag: "MUSEUM",  detail: "Contemporary art in a converted school. Sunday afternoon.", going: 134 },
      { name: "Astoria Park",           tag: "OUTDOOR", detail: "The Triborough bridge view at sunset. Pack wine.",          going: 189 },
      { name: "Museum of Moving Image", tag: "MUSEUM",  detail: "Behind-the-scenes film history. Surprisingly brilliant.",  going: 78 },
    ],
    popular: [
      { name: "Astoria Park",       cat: "OUTDOOR", saves: 312, note: "Best view of the Triborough. Bring a book.",  accent: "#80A8D8" },
      { name: "Taverna Kyclades",   cat: "DINING",  saves: 312, note: "The grilled fish. The bread. The oil.",       accent: "#D4A070" },
      { name: "MoMA PS1",           cat: "MUSEUM",  saves: 267, note: "Outdoor concerts in summer. Free with MoMA.", accent: "#C090B0" },
      { name: "Steinway Street",    cat: "EXPLORE", saves: 189, note: "Every cuisine on two blocks. Start walking.", accent: "#A8C870" },
    ],
    hidden: [
      { name: "Sanford's",          tip: "Since 1922. Regulars-only vibe. The gyro plate, cash only." },
      { name: "Bohemian Beer Hall", tip: "Czech beer garden hidden off 24th Ave. Enormous, magical, packed in summer." },
      { name: "Neptune Diner",      tip: "Open 24 hours. Order the Greek omelette at 2am. A Queens classic." },
    ],
  },
  "crown-heights": {
    name: "Crown Heights",
    borough: "BROOKLYN",
    tagline: "Caribbean flavor, museum mornings, and the best block parties in the borough.",
    vibe: ["Culture", "Caribbean", "Arts", "Nightlife"],
    bloomies: 378,
    heroBg: "linear-gradient(155deg, #0C0818 0%, #181224 55%, #0A0814 100%)",
    heroAccent: "#D080E8",
    eats: [
      { name: "Miss Ada",          type: "ISRAELI",    note: "Garden dining in a brownstone backyard. The shakshuka.",   saves: 289, hot: true },
      { name: "Barboncino",        type: "PIZZA",      note: "Neapolitan pizza in Brooklyn. Wood-fired, perfect char.",  saves: 234 },
      { name: "Franklin Park",     type: "BAR",        note: "Big outdoor patio, cheap drinks, great music. The vibe.", saves: 201 },
      { name: "Glady's Caribbean", type: "CARIBBEAN",  note: "Jerk chicken, rum cocktails, the right playlist.",         saves: 178 },
    ],
    trending: [
      { name: "Brooklyn Museum",  tag: "MUSEUM",  detail: "First Saturday: free, 5-11pm, DJ sets and galleries.", going: 312 },
      { name: "Brooklyn Botanic", tag: "OUTDOOR", detail: "Cherry blossoms in April. Earliest bloom alert.",      going: 267 },
      { name: "Syndicated",       tag: "CINEMA",  detail: "Film + bar + food in a converted garage.",             going: 89 },
    ],
    popular: [
      { name: "Brooklyn Museum",  cat: "MUSEUM",  saves: 456, note: "First Saturdays. Free. Unforgettable.",        accent: "#D080E8" },
      { name: "Brooklyn Botanic", cat: "OUTDOOR", saves: 389, note: "52 acres of curated beauty.",                  accent: "#A8C870" },
      { name: "Miss Ada",         cat: "DINING",  saves: 289, note: "The garden. The food. The whole thing.",        accent: "#D4A070" },
      { name: "Utica Avenue",     cat: "EXPLORE", saves: 201, note: "Caribbean restaurants, bakeries, music shops.", accent: "#E09070" },
    ],
    hidden: [
      { name: "Berg'n",       tip: "Beer hall with rotating food vendors. Wednesday-Sunday. Bring a group." },
      { name: "Ode to Babel", tip: "Impossibly cute café on Franklin. The almond croissant is worth the trip." },
      { name: "Threes Brewing", tip: "Craft brewery taproom with excellent food. The quietest patio in the nabe." },
    ],
  },
  "upper-east-side": {
    name: "Upper East Side",
    borough: "MANHATTAN",
    tagline: "Museum Mile, impeccable brunches, and a neighborhood that refuses to be anything but classic.",
    vibe: ["Museums", "Elegant", "Brunch", "Classic NYC"],
    bloomies: 543,
    heroBg: "linear-gradient(155deg, #0A0A18 0%, #141424 55%, #080810 100%)",
    heroAccent: "#C0B870",
    eats: [
      { name: "Café Boulud",         type: "FRENCH",      note: "Daniel Boulud's neighborhood bistro. The Sunday brunch.", saves: 312, hot: true },
      { name: "Paola's",             type: "ITALIAN",     note: "UES institution. The lasagne bolognese. Reservations.",   saves: 267 },
      { name: "The Mark Restaurant", type: "NEW AMERICAN", note: "Jean-Georges at The Mark Hotel. Elevated, worth it.",    saves: 234 },
      { name: "Sette Mezzo",         type: "ITALIAN",     note: "Cash only. No reservations. AMEX crowd going casual.",    saves: 201 },
    ],
    trending: [
      { name: "The Met Fifth Avenue", tag: "MUSEUM", detail: "Pay what you wish (NY residents). Go on a Tuesday.",    going: 489 },
      { name: "Guggenheim",          tag: "MUSEUM", detail: "The building is the art. Current show is excellent.",     going: 234 },
      { name: "Neue Galerie",        tag: "MUSEUM", detail: "Café Sabarsky for Viennese coffee and strudel after.",   going: 89 },
    ],
    popular: [
      { name: "The Metropolitan Museum", cat: "MUSEUM",  saves: 678, note: "The greatest collection in the Western world.",   accent: "#C0B870" },
      { name: "Guggenheim",              cat: "MUSEUM",  saves: 456, note: "Frank Lloyd Wright's spiral. Pure architecture.", accent: "#D4A070" },
      { name: "Central Park (East)",     cat: "OUTDOOR", saves: 512, note: "The Reservoir run. The Boathouse lunch.",         accent: "#90C880" },
      { name: "Neue Galerie",            cat: "CULTURE", saves: 289, note: "Klimt. Schiele. And the best Viennese café.",     accent: "#C090B0" },
    ],
    hidden: [
      { name: "Café Heidelberg",        tip: "German deli on 86th since 1936. The schnitzel. Cash only." },
      { name: "Gracie Mansion grounds", tip: "The mayor's garden is open Wednesdays. Few tourists know." },
      { name: "Bemelmans Bar",          tip: "Murals by the Madeline author. The most civilized cocktail in New York." },
    ],
  },
  "bushwick": {
    name: "Bushwick",
    borough: "BROOKLYN",
    tagline: "Street murals, underground venues, and the city's most alive creative neighborhood.",
    vibe: ["Murals", "Nightlife", "Art", "Studios"],
    bloomies: 412,
    heroBg: "linear-gradient(155deg, #0E0814 0%, #18101E 55%, #0A0810 100%)",
    heroAccent: "#E050C8",
    eats: [
      { name: "Roberta's",         type: "PIZZA",      note: "The Bee Sting pizza. The garden. The vibe. The legend.",    saves: 489, hot: true },
      { name: "Bunker Vietnamese", type: "VIETNAMESE", note: "Banh mi and pho in a converted garage. Exceptional.",       saves: 267 },
      { name: "Syndicated",        type: "BAR + FILM", note: "Movies + cocktails + food. Best date concept in Brooklyn.", saves: 312 },
      { name: "Lola Star",         type: "DINER",      note: "Retro Coney Island meets Bushwick. Milkshakes and fries.", saves: 178 },
    ],
    trending: [
      { name: "Bushwick Collective", tag: "STREET ART", detail: "Over 50 murals on Jefferson Ave. Self-guided walk.",    going: 312 },
      { name: "Market Hotel",        tag: "LIVE MUSIC",  detail: "Secret DIY venue. Best emerging acts in Brooklyn.",    going: 78 },
      { name: "House of Yes",        tag: "NIGHTCLUB",   detail: "The circus-themed club. Costume strongly encouraged.", going: 145 },
    ],
    popular: [
      { name: "Roberta's",           cat: "DINING",   saves: 489, note: "The pizza that started it all.",               accent: "#E050C8" },
      { name: "Bushwick Collective", cat: "CULTURE",  saves: 423, note: "World's largest open-air mural museum.",        accent: "#D080E8" },
      { name: "House of Yes",        cat: "NIGHTLIFE", saves: 312, note: "The most theatrical night out in NYC.",        accent: "#C090D0" },
      { name: "Wyckoff House",       cat: "HISTORY",  saves: 178, note: "NYC's oldest surviving house. Worth a detour.", accent: "#A8C870" },
    ],
    hidden: [
      { name: "Pine Box Rock Shop",  tip: "Rock bar in a coffin factory. Veggie-friendly. Always a show." },
      { name: "Archie's",            tip: "Tiny wine bar on Wyckoff. Natural wine, tiny bites. No reservations." },
      { name: "Flushing Ave mural walk", tip: "Start at Troutman St and walk. Every block is a new artist." },
    ],
  },
  "flushing": {
    name: "Flushing",
    borough: "QUEENS",
    tagline: "The best dim sum outside Hong Kong, night markets, and a neighborhood that never sleeps.",
    vibe: ["Dim Sum", "Asian Food", "Markets", "Culture"],
    bloomies: 234,
    heroBg: "linear-gradient(155deg, #081018 0%, #0C1820 55%, #060E14 100%)",
    heroAccent: "#E89040",
    eats: [
      { name: "Golden Shopping Mall",     type: "FOOD COURT", note: "Basement food court. Hand-pulled noodles. The real Flushing.", saves: 389, hot: true },
      { name: "Nan Xiang Xiao Long Bao",  type: "DIM SUM",    note: "The soup dumplings. Queue starts at 11am.",                   saves: 445 },
      { name: "Flushing Mall Food Court", type: "FOOD COURT", note: "Scallion pancakes, lamb skewers, rice rolls. All excellent.",  saves: 312 },
      { name: "Biang Biang Noodles",      type: "CHINESE",    note: "Belt noodles, hand-torn, spicy and extraordinary.",            saves: 267 },
    ],
    trending: [
      { name: "New World Mall Food Court", tag: "FOOD HALL", detail: "50+ vendors, every Chinese regional cuisine.",       going: 234 },
      { name: "Flushing Night Market",     tag: "MARKET",    detail: "Weekends May-October. The skewers are life-changing.", going: 312 },
      { name: "Louis Armstrong House",     tag: "CULTURE",   detail: "The jazz great's actual home. Tours are intimate.",   going: 56 },
    ],
    popular: [
      { name: "Flushing Main Street",    cat: "EXPLORE", saves: 456, note: "The food street that starts at the 7 train.",   accent: "#E89040" },
      { name: "Nan Xiang XLB",           cat: "DINING",  saves: 445, note: "The best XLB outside Shanghai.",               accent: "#D4A070" },
      { name: "New World Mall",          cat: "FOOD",    saves: 389, note: "Food court with 50 stalls. Bring everyone.",   accent: "#C0A070" },
      { name: "Queens Botanical Garden", cat: "OUTDOOR", saves: 234, note: "Underrated gem. Rose garden in June.",         accent: "#A8C870" },
    ],
    hidden: [
      { name: "Ganesh Temple",  tip: "Free vegetarian cafeteria open to all. The dosas cost $4. Extraordinary." },
      { name: "Sweet Spot",     tip: "Mango mochi at 41-28 Main St. In a tiny case by the register. Always fresh." },
      { name: "Kissena Park",   tip: "Flushing's best kept secret. Velodrome, lake, and zero tourists." },
    ],
  },
};

const DEFAULT_NEIGHBORHOOD: NeighborhoodData = {
  name: "New Neighborhood",
  borough: "NYC",
  tagline: "We're curating this neighborhood. Check back soon.",
  vibe: [],
  bloomies: 0,
  heroBg: "linear-gradient(155deg, #1A0018 0%, #2D0020 100%)",
  heroAccent: PINK,
  eats: [],
  trending: [],
  popular: [],
  hidden: [],
};

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, sub, accent }: { label: string; sub?: string; accent: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: accent }}>{label}</p>
      {sub && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

// ── Eat card ───────────────────────────────────────────────────────────────────
function EatCard({ eat, accent }: { eat: NeighborhoodData["eats"][0]; accent: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#130810",
      borderRadius: 18,
      padding: "16px 16px 14px",
      marginBottom: 10,
      border: `1px solid rgba(255,255,255,0.06)`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      position: "relative",
    }}>
      {eat.hot && (
        <div style={{ position: "absolute", top: 14, right: 14, background: PINK, borderRadius: 999, padding: "2px 9px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>✦ HOT</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 7 }}>
        <div style={{ background: `${accent}22`, border: `1px solid ${accent}44`, borderRadius: 999, padding: "2px 8px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{eat.type}</span>
        </div>
      </div>
      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 20, color: "white", lineHeight: 1.1, marginBottom: 7 }}>{eat.name}</p>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.45, marginBottom: 10 }}>"{eat.note}"</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.22)" }}>{eat.saves} saves</span>
        <button onClick={() => setSaved(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? GOLD : "none"} stroke={GOLD} strokeWidth="2.2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Trending card ──────────────────────────────────────────────────────────────
function TrendingCard({ item, accent }: { item: NeighborhoodData["trending"][0]; accent: string }) {
  return (
    <div style={{
      flexShrink: 0, width: 200,
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#0E080E",
      borderRadius: 18,
      padding: "16px 16px 14px",
      border: `1px solid ${accent}22`,
      boxShadow: `0 6px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accent}11`,
    }}>
      <div style={{ background: `${accent}22`, border: `1px solid ${accent}55`, borderRadius: 999, padding: "3px 9px", display: "inline-flex", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{item.tag}</span>
      </div>
      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "white", lineHeight: 1.15, marginBottom: 8 }}>{item.name}</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 12 }}>{item.detail}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, boxShadow: `0 0 0 2px rgba(255,0,144,0.22)` }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>{item.going} bloomies going</span>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const hood = NEIGHBORHOODS[slug] ?? { ...DEFAULT_NEIGHBORHOOD, name: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) };
  const [tab, setTab] = useState<"eats" | "trending" | "popular">("eats");

  return (
    <div style={{
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#0A040E",
      minHeight: "100vh",
      paddingBottom: 120,
    }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 290, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, ${hood.heroBg}`, backgroundSize: "160px 160px, 100% 100%" }} />
        {/* Glow */}
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${hood.heroAccent}22 0%, transparent 70%)`, filter: "blur(40px)" }} />
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,4,14,0.9) 100%)" }} />

        {/* Back button */}
        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <div style={{
            position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: 16, zIndex: 20,
            background: "rgba(0,0,0,0.38)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
            padding: "6px 13px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.07em" }}>CITY</span>
          </div>
        </Link>

        {/* Text */}
        <div style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: hood.heroAccent, marginBottom: 6 }}>{hood.borough} · NEIGHBORHOOD</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 44, color: "white", lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: 10 }}>{hood.name}.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.4, maxWidth: 280 }}>{hood.tagline}</p>
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundImage: DARK_GRAIN,
        backgroundSize: "160px 160px",
        backgroundColor: "#120A14",
        padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 0,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "white", lineHeight: 1 }}>{hood.bloomies.toLocaleString()}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>BLOOMIES HERE</p>
        </div>
        <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />
        <div style={{ flex: 2, display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          {hood.vibe.map(v => (
            <div key={v} style={{ background: `${hood.heroAccent}18`, border: `1px solid ${hood.heroAccent}33`, borderRadius: 999, padding: "3px 10px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: hood.heroAccent, letterSpacing: "0.06em" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB BAR ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#0A040E" }}>
        {(["eats", "trending", "popular"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "13px 0", background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === t ? hood.heroAccent : "transparent"}`,
            transition: "border-color 0.2s",
          }}>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
              letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: tab === t ? hood.heroAccent : "rgba(255,255,255,0.28)",
            }}>
              {t === "eats" ? "🍽 Eats" : t === "trending" ? "✦ Trending" : "✦ Most Loved"}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 16px 0" }}>

        {/* ── EATS TAB ───────────────────────────────────────────────────────── */}
        {tab === "eats" && (
          <>
            <SectionHeader label="BEST EATS" sub="Where the girls go" accent={hood.heroAccent} />
            {hood.eats.length > 0
              ? hood.eats.map((eat, i) => <EatCard key={i} eat={eat} accent={hood.heroAccent} />)
              : <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Coming soon.</p>
            }
          </>
        )}

        {/* ── TRENDING TAB ───────────────────────────────────────────────────── */}
        {tab === "trending" && (
          <>
            <SectionHeader label="TRENDING NOW" sub="This week's it spots" accent={hood.heroAccent} />
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" as const, marginBottom: 24 }}>
              {hood.trending.length > 0
                ? hood.trending.map((item, i) => <TrendingCard key={i} item={item} accent={hood.heroAccent} />)
                : <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Coming soon.</p>
              }
            </div>

            {/* Hidden gems */}
            {hood.hidden.length > 0 && (
              <>
                <SectionHeader label="HIDDEN GEMS" sub="Secrets worth knowing" accent="rgba(255,255,255,0.4)" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {hood.hidden.map((gem, i) => (
                    <div key={i} style={{
                      backgroundImage: PAPER_TEX,
                      backgroundSize: "200px 200px",
                      backgroundColor: "#FEF8F0",
                      borderRadius: 16,
                      padding: "14px 16px",
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${hood.heroAccent}22`, border: `1px solid ${hood.heroAccent}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 13 }}>✦</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: DARK, lineHeight: 1.1, marginBottom: 5 }}>{gem.name}</p>
                        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.4 }}>{gem.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── MOST LOVED TAB ─────────────────────────────────────────────────── */}
        {tab === "popular" && (
          <>
            <SectionHeader label="MOST LOVED" sub="Saved by the most bloomies" accent={hood.heroAccent} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {hood.popular.length > 0
                ? hood.popular.map((pick, i) => (
                    <div key={i} style={{
                      backgroundImage: DARK_GRAIN,
                      backgroundSize: "160px 160px",
                      backgroundColor: "#120A14",
                      borderRadius: 18,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                    }}>
                      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${pick.accent}88, transparent)` }} />
                      <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: `rgba(212,168,83,0.1)`, border: `1px solid ${pick.accent}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: pick.accent }}>{i + 1}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <div style={{ background: `${pick.accent}22`, border: `1px solid ${pick.accent}44`, borderRadius: 999, padding: "1.5px 7px" }}>
                              <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: pick.accent, letterSpacing: "0.1em" }}>{pick.cat}</span>
                            </div>
                            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "rgba(255,255,255,0.22)" }}>{pick.saves} saves</span>
                          </div>
                          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "rgba(255,245,235,0.9)", lineHeight: 1.1, marginBottom: 4 }}>{pick.name}</p>
                          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: `${pick.accent}bb`, lineHeight: 1.35 }}>"{pick.note}"</p>
                        </div>
                      </div>
                    </div>
                  ))
                : <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Coming soon.</p>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
