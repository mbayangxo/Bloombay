"use client";

import { useState } from "react";
import Link from "next/link";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const DARK  = "#1A1A1A";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type HapTab = "happenings" | "people" | "city";

// ── Data ───────────────────────────────────────────────────────────────────────

const EVENTS = [
  {
    id: 1,
    name: "Sunset Picnic",
    neighborhood: "PROSPECT PARK",
    city: "Brooklyn, NY",
    time: "Tonight · 6PM",
    badge: "TONIGHT",
    women: 23,
    desc: "Blankets, rosé, golden hour. No agenda just good conversation and better company.",
    tags: ["outdoor", "wine", "friends"],
    grad: "linear-gradient(135deg, #D4845A 0%, #B05030 100%)",
  },
  {
    id: 2,
    name: "Gallery Night Out",
    neighborhood: "CHELSEA",
    city: "Manhattan, NY",
    time: "Tonight · 7PM",
    badge: "TONIGHT",
    women: 41,
    desc: "Gallery hop through Chelsea — 3 opening receptions, champagne included at the last stop.",
    tags: ["art", "culture", "social"],
    grad: "linear-gradient(135deg, #7A5090 0%, #4A2070 100%)",
  },
  {
    id: 3,
    name: "Pilates & Prosecco",
    neighborhood: "SOHO",
    city: "Manhattan, NY",
    time: "Sat · 11AM",
    badge: "THIS WEEKEND",
    women: 18,
    desc: "45 min reformer class followed by brunch and bubbles. The best Saturday morning you'll have all year.",
    tags: ["fitness", "wellness", "brunch"],
    grad: "linear-gradient(135deg, #E896A0 0%, #C06070 100%)",
  },
  {
    id: 4,
    name: "Wine Down Wednesday",
    neighborhood: "WEST VILLAGE",
    city: "Manhattan, NY",
    time: "Wed · 8PM",
    badge: "UPCOMING",
    women: 12,
    desc: "Cozy wine bar, natural wines, and the kind of conversation that makes you stay till closing.",
    tags: ["wine", "intimate", "nightlife"],
    grad: "linear-gradient(135deg, #5A3A2A 0%, #3A2015 100%)",
  },
  {
    id: 5,
    name: "Matcha & Mimosas",
    neighborhood: "WILLIAMSBURG",
    city: "Brooklyn, NY",
    time: "Sun · 12PM",
    badge: "THIS WEEKEND",
    women: 34,
    desc: "Brunch club meets. We rotate spots every week — this Sunday it's Diner in Williamsburg.",
    tags: ["brunch", "foodie", "Sunday"],
    grad: "linear-gradient(135deg, #3A6A4A 0%, #1A4A2A 100%)",
  },
  {
    id: 6,
    name: "The Rooftop",
    neighborhood: "LES",
    city: "Manhattan, NY",
    time: "Sat · 7PM",
    badge: "THIS WEEKEND",
    women: 67,
    desc: "The Roof at PUBLIC Hotel. Amazing views, DJ, and the best people watching in the city.",
    tags: ["rooftop", "nightlife", "views"],
    grad: "linear-gradient(135deg, #1A2A4A 0%, #0A1A3A 100%)",
  },
];

const PEOPLE = [
  {
    id: 1,
    name: "Amara K.",
    age: 27,
    location: "Brooklyn, NY",
    bio: "Just moved to Brooklyn. Love museum mornings, matcha bars, and making new friends. Looking for my NYC crew.",
    tags: ["museums", "matcha", "walks"],
    color: "#C4849A",
    initial: "A",
  },
  {
    id: 2,
    name: "Sofia R.",
    age: 29,
    location: "West Village, NY",
    bio: "Food writer and weekend chef. Always on the hunt for the best hole-in-wall spots. Let's do brunch.",
    tags: ["foodie", "cooking", "wine"],
    color: "#8A7090",
    initial: "S",
  },
  {
    id: 3,
    name: "Jade W.",
    age: 25,
    location: "Harlem, NY",
    bio: "Art director. Gallery hopper. I make great playlists and even better recommendations.",
    tags: ["art", "music", "fashion"],
    color: "#5A8090",
    initial: "J",
  },
  {
    id: 4,
    name: "Naomi B.",
    age: 31,
    location: "SoHo, NY",
    bio: "Startup founder by day, book club host by night. My fave night is a dinner party with people I just met.",
    tags: ["books", "dinners", "wellness"],
    color: "#A06040",
    initial: "N",
  },
  {
    id: 5,
    name: "Priya S.",
    age: 26,
    location: "Astoria, NY",
    bio: "Yoga teacher and travel addict. Planning Morocco this fall — anyone want in?",
    tags: ["yoga", "travel", "outdoors"],
    color: "#907040",
    initial: "P",
  },
];

const NEIGHBORHOODS = [
  { name: "SoHo",          bg: "#D4B5A0", spots: 14 },
  { name: "West Village",  bg: "#C4A0A8", spots: 18 },
  { name: "Williamsburg",  bg: "#A8C0B8", spots: 16 },
  { name: "Brooklyn Hts",  bg: "#B8A8C0", spots: 11 },
  { name: "Harlem",        bg: "#C0B0A0", spots: 9  },
];

const CITY_SPOTS = [
  { id: 1, name: "Bar Pisellino",  area: "SoHo",         type: "Italian · Cocktails",   women: 18, grad: "linear-gradient(135deg,#2d1208,#0d0806)" },
  { id: 2, name: "Via Carota",     area: "West Village",  type: "Italian · Dinner",      women: 24, grad: "linear-gradient(135deg,#1a2a0a,#0a180a)" },
  { id: 3, name: "Lola Taverna",   area: "West Village",  type: "Greek · Date Night",    women: 41, grad: "linear-gradient(135deg,#2a1a08,#180a00)" },
  { id: 4, name: "Sant Ambroeus",  area: "SoHo",          type: "Italian · Brunch",      women: 12, grad: "linear-gradient(135deg,#281820,#180810)" },
  { id: 5, name: "Rubirosa",       area: "Nolita",        type: "Pizza · Casual",        women: 32, grad: "linear-gradient(135deg,#201010,#100808)" },
  { id: 6, name: "L'Artusi",       area: "West Village",  type: "Italian · Wine Bar",    women: 19, grad: "linear-gradient(135deg,#102028,#081018)" },
];

// ── Toggle ─────────────────────────────────────────────────────────────────────

function TabToggle({ tab, setTab }: { tab: HapTab; setTab: (t: HapTab) => void }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px 12px",
      background: PAPER,
      backgroundImage: PAPER_TEX,
      borderBottom: "1px solid rgba(0,0,0,0.06)",
    }}>
      {/* Pill group */}
      <div style={{
        display: "flex",
        background: "rgba(0,0,0,0.06)",
        borderRadius: 999,
        padding: "3px",
        gap: "2px",
      }}>
        {(["happenings", "people", "city"] as HapTab[]).map(t => {
          const active = tab === t;
          const label = t === "happenings" ? "Happenings" : t === "people" ? "People" : "City";
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                background: active ? DARK : "transparent",
                color: active ? "white" : "rgba(0,0,0,0.45)",
                fontFamily: "var(--font-jost)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
              }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Icons */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "4px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "4px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Happenings Tab ─────────────────────────────────────────────────────────────

function HappeningsTab() {
  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
          HAPPENING NEAR YOU
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "rgba(0,0,0,0.3)" }}>NYC · Tonight</p>
      </div>

      {EVENTS.map(ev => (
        <button key={ev.id} style={{
          width: "100%",
          background: PAPER,
          backgroundImage: PAPER_TEX,
          backgroundSize: "200px 200px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 3px 16px rgba(0,0,0,0.08)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "transform 0.15s",
        }}>
          {/* Photo area */}
          <div style={{ height: "100px", background: ev.grad, position: "relative" }}>
            {/* Badge */}
            <div style={{
              position: "absolute",
              top: "10px",
              left: "12px",
              background: ev.badge === "TONIGHT" ? PINK : ev.badge === "THIS WEEKEND" ? DARK : "rgba(0,0,0,0.55)",
              borderRadius: 999,
              padding: "4px 10px",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em", color: "white" }}>
                {ev.badge}
              </p>
            </div>
            {/* Women count */}
            <div style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 999,
              padding: "4px 10px",
            }}>
              <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.9)" }}>✿</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {ev.women} going
              </p>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "14px 16px 14px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Location pill */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  marginBottom: "8px",
                }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(0,0,0,0.45)" }}>
                    {ev.neighborhood} · {ev.city.split(",")[0]}
                  </p>
                </div>

                <p style={{ fontFamily: "var(--font-playfair)", fontSize: "17px", fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.2, marginBottom: "5px" }}>
                  {ev.name}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: PINK, marginBottom: "6px" }}>
                  {ev.time}
                </p>
                <p style={{ fontFamily: "var(--font-instrument)", fontSize: "12px", fontStyle: "italic", color: "rgba(0,0,0,0.45)", lineHeight: 1.4, marginBottom: "10px" }}>
                  {ev.desc}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {ev.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "9px",
                      fontWeight: 600,
                      color: "rgba(0,0,0,0.4)",
                      background: "rgba(0,0,0,0.055)",
                      borderRadius: 999,
                      padding: "3px 9px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div style={{
                flexShrink: 0,
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: PINK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 10px ${PINK}44`,
                marginTop: "4px",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>
        </button>
      ))}

      <div style={{ height: "20px" }} />
    </div>
  );
}

// ── People Tab ─────────────────────────────────────────────────────────────────

function PeopleTab() {
  const [idx, setIdx] = useState(0);
  const [waved, setWaved] = useState<Set<number>>(new Set());
  const person = PEOPLE[idx % PEOPLE.length];
  const hasWaved = waved.has(person.id);

  function nextPerson() {
    setIdx(i => (i + 1) % PEOPLE.length);
  }

  function wavePerson() {
    setWaved(prev => new Set([...prev, person.id]));
    setTimeout(nextPerson, 800);
  }

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
          WOMEN NEAR YOU
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "rgba(0,0,0,0.3)" }}>NYC · {PEOPLE.length} nearby</p>
      </div>

      {/* Main profile card */}
      <div style={{
        background: PAPER,
        backgroundImage: PAPER_TEX,
        backgroundSize: "200px 200px",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        position: "relative",
      }}>
        {/* Photo area */}
        <div style={{
          height: "280px",
          background: `linear-gradient(145deg, ${person.color} 0%, ${person.color}88 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          {/* Initial */}
          <p style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "80px",
            fontWeight: 900,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1,
            userSelect: "none",
          }}>
            {person.initial}
          </p>

          {/* Nav arrows */}
          <button
            onClick={() => setIdx(i => (i - 1 + PEOPLE.length) % PEOPLE.length)}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={nextPerson}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* Profile dots indicator */}
          <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
            {PEOPLE.map((_, i) => (
              <div key={i} style={{
                width: i === idx % PEOPLE.length ? "16px" : "6px",
                height: "6px",
                borderRadius: "999px",
                background: i === idx % PEOPLE.length ? "white" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s",
              }} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", fontWeight: 900, fontStyle: "italic", color: DARK }}>
                  {person.name}
                </p>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "14px", fontWeight: 600, color: "rgba(0,0,0,0.35)" }}>
                  {person.age}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>{person.location}</p>
              </div>
            </div>

            {/* Wave button */}
            <button
              onClick={wavePerson}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: hasWaved ? "rgba(255,31,125,0.1)" : PINK,
                border: hasWaved ? `2px solid ${PINK}` : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: hasWaved ? "none" : `0 4px 16px ${PINK}44`,
                transition: "all 0.2s",
                flexShrink: 0,
              }}>
              {hasWaved
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <span style={{ fontSize: "22px" }}>👋</span>
              }
            </button>
          </div>

          <p style={{ fontFamily: "var(--font-instrument)", fontSize: "13px", fontStyle: "italic", color: "rgba(0,0,0,0.5)", lineHeight: 1.5, marginTop: "12px", marginBottom: "12px" }}>
            {person.bio}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {person.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                fontWeight: 600,
                color: "rgba(0,0,0,0.45)",
                background: "rgba(0,0,0,0.06)",
                borderRadius: 999,
                padding: "5px 12px",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Browse more */}
      <div style={{ textAlign: "center", paddingBottom: "8px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "rgba(0,0,0,0.28)" }}>
          {idx + 1} of {PEOPLE.length} women near you
        </p>
      </div>
      <div style={{ height: "20px" }} />
    </div>
  );
}

// ── City Tab ───────────────────────────────────────────────────────────────────

function CityTab() {
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | null>(null);

  const filtered = activeNeighborhood
    ? CITY_SPOTS.filter(s => s.area === activeNeighborhood || s.area.includes(activeNeighborhood.split(" ")[0]))
    : CITY_SPOTS;

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
          THE CITY · NYC
        </p>
        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.3)" }}>Full guide →</p>
        </Link>
      </div>

      {/* Neighborhood pills */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" as const }}>
        <button
          onClick={() => setActiveNeighborhood(null)}
          style={{
            flexShrink: 0,
            padding: "8px 14px",
            borderRadius: 999,
            background: !activeNeighborhood ? DARK : "rgba(0,0,0,0.06)",
            color: !activeNeighborhood ? "white" : "rgba(0,0,0,0.5)",
            fontFamily: "var(--font-jost)",
            fontSize: "10px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}>
          All
        </button>
        {NEIGHBORHOODS.map(n => (
          <button
            key={n.name}
            onClick={() => setActiveNeighborhood(activeNeighborhood === n.name ? null : n.name)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: 999,
              background: activeNeighborhood === n.name ? DARK : "rgba(0,0,0,0.06)",
              color: activeNeighborhood === n.name ? "white" : "rgba(0,0,0,0.5)",
              fontFamily: "var(--font-jost)",
              fontSize: "10px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}>
            {n.name}
          </button>
        ))}
      </div>

      {/* 2-per-row restaurant grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {filtered.map(spot => (
          <Link key={spot.id} href="/member/city" style={{ textDecoration: "none" }}>
            <div style={{
              background: PAPER,
              backgroundImage: PAPER_TEX,
              backgroundSize: "200px 200px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}>
              {/* Photo area */}
              <div style={{ height: "80px", background: spot.grad, position: "relative" }}>
                {/* Women going */}
                <div style={{
                  position: "absolute",
                  bottom: "6px",
                  left: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  background: "rgba(0,0,0,0.45)",
                  borderRadius: 999,
                  padding: "3px 7px",
                }}>
                  <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.8)" }}>✿</span>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                    {spot.women}
                  </p>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: "10px 10px 12px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: DARK, lineHeight: 1.2 }}>
                  {spot.name}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.4)", marginTop: "3px" }}>
                  {spot.area}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.3)", marginTop: "2px" }}>
                  {spot.type}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ height: "20px" }} />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function HappeningsPage() {
  const [tab, setTab] = useState<HapTab>("happenings");

  return (
    <div style={{
      backgroundImage: PAPER_TEX,
      backgroundColor: CREAM,
      backgroundSize: "200px 200px",
      minHeight: "100vh",
      paddingBottom: 96,
    }}>
      {/* Page header */}
      <div style={{
        padding: "60px 20px 0",
        backgroundImage: PAPER_TEX,
        backgroundColor: PAPER,
        backgroundSize: "200px 200px",
      }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: "4px" }}>
          ✦ BLOOMBAY
        </p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "34px", fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1, marginBottom: "2px" }}>
          Discover
        </h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "16px", color: "rgba(0,0,0,0.3)", marginBottom: "0" }}>
          your city. your people. ♡
        </p>
      </div>

      {/* Sticky toggle */}
      <div style={{ position: "sticky", top: "48px", zIndex: 40 }}>
        <TabToggle tab={tab} setTab={setTab} />
      </div>

      {/* Tab content */}
      {tab === "happenings" && <HappeningsTab />}
      {tab === "people"     && <PeopleTab />}
      {tab === "city"       && <CityTab />}
    </div>
  );
}
