"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#0F0F1A";
const INK   = "#1A1A2E";
const CREAM = "#FAF6F0";
const PLUM  = "#1A0A2E";
const GOLD  = "#D4A853";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

// ── Modes ─────────────────────────────────────────────────────────────────────
type WorkMode = "working" | "trepreneur" | "fluencer";

const MODE_META: Record<WorkMode, { label: string; tagline: string; accent: string; accent2: string }> = {
  working:    { label: "Girl Working",      tagline: "Jobs. Money. Elevation.",         accent: PLUM,    accent2: INK },
  trepreneur: { label: "Girltrepreneur",    tagline: "Build your empire.",              accent: "#7B1FA2", accent2: "#4A0070" },
  fluencer:   { label: "Girl Fluencer",     tagline: "Create. Grow. Get paid.",         accent: "#C4005A", accent2: PINK },
};

// ── Career content (Girl Working tab) ─────────────────────────────────────────
type CareerCat = "all" | "job" | "career_move" | "event" | "salary" | "hot_take";
type Industry  = "all" | "tech" | "finance" | "media" | "fashion" | "healthcare" | "creative" | "law" | "nonprofit";

const CAT_META: Record<CareerCat, { label: string; color: string }> = {
  all:         { label: "All",       color: DARK },
  job:         { label: "Jobs",      color: "#0F4C81" },
  career_move: { label: "Elevate",   color: "#5B2D8E" },
  event:       { label: "Events",    color: "#C4005A" },
  salary:      { label: "Money",     color: "#2E7D32" },
  hot_take:    { label: "Hot Take",  color: PINK },
};

const INDUSTRY_META: Record<Industry, { label: string; emoji: string }> = {
  all:        { label: "All",        emoji: "💼" },
  tech:       { label: "Tech",       emoji: "💻" },
  finance:    { label: "Finance",    emoji: "📈" },
  media:      { label: "Media",      emoji: "📱" },
  fashion:    { label: "Fashion",    emoji: "👗" },
  healthcare: { label: "Health",     emoji: "🏥" },
  creative:   { label: "Creative",   emoji: "🎨" },
  law:        { label: "Law",        emoji: "⚖️" },
  nonprofit:  { label: "Nonprofit",  emoji: "🌱" },
};

interface CareerItem {
  id: string; category: CareerCat; industry: Industry;
  title: string; body: string; badge?: string; badge_color?: string;
  yande_note: string; cover_a: string; cover_b: string; featured?: boolean;
}

const CAREER_ITEMS: CareerItem[] = [];

// ── Entrepreneur content (Girltrepreneur tab) ─────────────────────────────────
type TrepCat = "all" | "funding" | "launch" | "legal" | "growth" | "mindset";

const TREP_CAT_META: Record<TrepCat, { label: string; color: string }> = {
  all:     { label: "All",      color: DARK },
  funding: { label: "Funding",  color: "#7B1FA2" },
  launch:  { label: "Launch",   color: "#0F4C81" },
  legal:   { label: "Legal",    color: "#2E7D32" },
  growth:  { label: "Growth",   color: "#C4005A" },
  mindset: { label: "Mindset",  color: GOLD },
};

interface TrepItem {
  id: string; category: TrepCat;
  title: string; body: string; badge?: string; badge_color?: string;
  yande_note: string; cover_a: string; cover_b: string; featured?: boolean;
}

const TREP_ITEMS: TrepItem[] = [];

// ── Influencer / Creator content (Girl Fluencer tab) ─────────────────────────
type FluCat = "all" | "growth" | "monetize" | "brand_deal" | "content" | "platform";

const FLU_CAT_META: Record<FluCat, { label: string; color: string }> = {
  all:        { label: "All",         color: DARK },
  growth:     { label: "Growth",      color: "#C4005A" },
  monetize:   { label: "Monetize",    color: "#2E7D32" },
  brand_deal: { label: "Brand Deals", color: "#0F4C81" },
  content:    { label: "Content",     color: "#5B2D8E" },
  platform:   { label: "Platform",    color: GOLD },
};

interface FluItem {
  id: string; category: FluCat;
  title: string; body: string; badge?: string; badge_color?: string;
  yande_note: string; cover_a: string; cover_b: string; featured?: boolean;
}

const FLU_ITEMS: FluItem[] = [];

const COWORKERS: { name: string; initial: string; color: string; role: string; status: string }[] = [];

// ── Card components ───────────────────────────────────────────────────────────

interface AnyItem { title: string; body: string; badge?: string; badge_color?: string; yande_note: string; cover_a: string; cover_b: string; featured?: boolean; }

function FeaturedCard({ item, accent }: { item: AnyItem; accent: string }) {
  return (
    <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.16)", background: CREAM, border: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ height: 200, background: `linear-gradient(160deg, ${item.cover_a} 0%, ${item.cover_b} 100%)`, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "200px 200px" }} />
        {item.badge && (
          <div style={{ position: "absolute", top: 14, left: 14, background: item.badge_color ?? accent, borderRadius: 99, padding: "4px 11px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.16em" }}>{item.badge}</p>
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1, padding: "0 18px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", paddingTop: 40, width: "100%" }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 21, color: "white", lineHeight: 1.15, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{item.title}</h2>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.6)", lineHeight: 1.55, marginBottom: 14 }}>{item.body}</p>
        <div style={{ background: `${accent}08`, borderRadius: 12, padding: "10px 14px", borderLeft: `3px solid ${accent}` }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: accent, lineHeight: 1.5 }}>{item.yande_note} <span style={{ opacity: 0.7 }}>— Yande ✦</span></p>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item, accent, categoryLabel }: { item: AnyItem; accent: string; categoryLabel: string }) {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)", display: "flex" }}>
      <div style={{ width: 6, flexShrink: 0, background: `linear-gradient(180deg, ${item.cover_a}, ${item.cover_b})` }} />
      <div style={{ flex: 1, padding: "14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: accent, background: `${accent}12`, borderRadius: 99, padding: "2px 7px" }}>{categoryLabel.toUpperCase()}</span>
          {item.badge && <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: item.badge_color ?? accent }}>{item.badge}</span>}
        </div>
        <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK, lineHeight: 1.25, marginBottom: 6 }}>{item.title}</h3>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5, marginBottom: 10 }}>{item.body}</p>
        <div style={{ background: `${accent}08`, borderRadius: 10, padding: "8px 11px", borderLeft: `2px solid ${accent}55` }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: accent, lineHeight: 1.45 }}>{item.yande_note} <span style={{ opacity: 0.6 }}>— Yande ✦</span></p>
        </div>
      </div>
    </div>
  );
}

// ── Girl Working tab ──────────────────────────────────────────────────────────
function GirlWorkingTab() {
  const [activeCategory, setActiveCategory] = useState<CareerCat>("all");
  const [activeIndustry, setActiveIndustry] = useState<Industry>("all");
  const cats = Object.entries(CAT_META) as [CareerCat, { label: string; color: string }][];
  const industries = Object.entries(INDUSTRY_META) as [Industry, { label: string; emoji: string }][];

  const filtered = CAREER_ITEMS.filter(i =>
    (activeCategory === "all" || i.category === activeCategory) &&
    (activeIndustry === "all" || i.industry === activeIndustry || i.industry === "all")
  );
  const [featured, ...rest] = filtered;
  const accent = MODE_META.working.accent;

  return (
    <>
      {/* Coworking strip */}
      <div style={{ background: "white", padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "#aaa", letterSpacing: "0.18em" }}>DIGITAL COWORKING · LIVE NOW</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.5)" }}>3 Bloomies are working right now</p>
          </div>
          <button style={{ background: accent, borderRadius: 99, padding: "7px 16px", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>Drop In →</button>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const }}>
          {COWORKERS.map(cw => (
            <div key={cw.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8f8f8", borderRadius: 99, padding: "5px 10px 5px 5px", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${cw.color}, ${cw.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>{cw.initial}</div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 7, height: 7, borderRadius: "50%", background: "#22C55E", border: "1.5px solid white" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: DARK }}>{cw.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#aaa" }}>{cw.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ position: "sticky", top: 52, zIndex: 18, background: "rgba(250,246,240,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px 6px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCategory(id)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 99, background: activeCategory === id ? meta.color : "white", border: `1.5px solid ${activeCategory === id ? meta.color : "rgba(0,0,0,0.08)"}`, color: activeCategory === id ? "white" : "#888", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{meta.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "0 18px 10px" }}>
          {industries.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveIndustry(id)} style={{ flexShrink: 0, padding: "4px 12px", borderRadius: 99, background: activeIndustry === id ? DARK : "transparent", border: `1px solid ${activeIndustry === id ? DARK : "rgba(0,0,0,0.1)"}`, color: activeIndustry === id ? "white" : "#aaa", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{meta.emoji} {meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(0,0,0,0.35)", textAlign: "center", padding: "40px 0" }}>Yande is pulling content for this industry — check back Tuesday.</p>
        ) : (
          <>
            {featured && <FeaturedCard item={featured} accent={accent} />}
            {rest.map(item => <ContentCard key={item.id} item={item} accent={accent} categoryLabel={CAT_META[item.category].label} />)}
          </>
        )}
      </div>

      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: `${GRAIN}, ${DARK}`, backgroundSize: "200px 200px, auto", padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: `1px solid ${PINK}18` }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Know a great opportunity?</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Share a job, event, or tip with the girls.</p>
        <button style={{ padding: "12px 22px", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, #C4005A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", boxShadow: `0 4px 16px ${PINK}44` }}>Share an Opportunity →</button>
      </div>
    </>
  );
}

// ── Girltrepreneur tab ────────────────────────────────────────────────────────
function GirltrepreneurTab() {
  const [activeCat, setActiveCat] = useState<TrepCat>("all");
  const cats = Object.entries(TREP_CAT_META) as [TrepCat, { label: string; color: string }][];
  const filtered = activeCat === "all" ? TREP_ITEMS : TREP_ITEMS.filter(i => i.category === activeCat);
  const [featured, ...rest] = filtered;
  const accent = MODE_META.trepreneur.accent;

  return (
    <>
      {/* Founder identity strip */}
      <div style={{ background: `linear-gradient(135deg, #4A0070, #7B1FA2)`, padding: "14px 18px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", marginBottom: 4 }}>FOR WOMEN BUILDING SOMETHING</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "white", lineHeight: 1.4 }}>Funding, launch tactics, legal basics, growth strategy — the stuff nobody teaches you in school.</p>
      </div>

      <div style={{ position: "sticky", top: 52, zIndex: 18, background: "rgba(250,246,240,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCat(id)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 99, background: activeCat === id ? meta.color : "white", border: `1.5px solid ${activeCat === id ? meta.color : "rgba(0,0,0,0.08)"}`, color: activeCat === id ? "white" : "#888", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {featured && <FeaturedCard item={featured} accent={accent} />}
        {rest.map(item => <ContentCard key={item.id} item={item} accent={accent} categoryLabel={TREP_CAT_META[item.category].label} />)}
      </div>

      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: `${GRAIN}, linear-gradient(150deg, #2D0050, #4A0070)`, backgroundSize: "200px 200px, auto", padding: "22px 20px", boxShadow: "0 8px 32px rgba(74,0,112,0.4)", border: "1px solid rgba(123,31,162,0.3)" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Building something?</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Connect with other Bloomies who are in build mode. Real founder convos, no pitch decks required.</p>
        <button style={{ padding: "12px 22px", borderRadius: 50, background: "linear-gradient(135deg, #7B1FA2, #4A0070)", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", boxShadow: "0 4px 16px rgba(123,31,162,0.4)" }}>Find Founder Bloomies →</button>
      </div>
    </>
  );
}

// ── Girl Fluencer tab ─────────────────────────────────────────────────────────
function GirlFluencerTab() {
  const [activeCat, setActiveCat] = useState<FluCat>("all");
  const cats = Object.entries(FLU_CAT_META) as [FluCat, { label: string; color: string }][];
  const filtered = activeCat === "all" ? FLU_ITEMS : FLU_ITEMS.filter(i => i.category === activeCat);
  const [featured, ...rest] = filtered;
  const accent = MODE_META.fluencer.accent;

  return (
    <>
      {/* Creator identity strip */}
      <div style={{ background: `linear-gradient(135deg, #880E4F, ${PINK})`, padding: "14px 18px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", marginBottom: 4 }}>FOR WOMEN WHO CREATE CONTENT</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "white", lineHeight: 1.4 }}>Rate cards, brand deal strategy, growth tactics, and how to actually get paid for what you make.</p>
      </div>

      <div style={{ position: "sticky", top: 52, zIndex: 18, background: "rgba(250,246,240,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCat(id)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 99, background: activeCat === id ? meta.color : "white", border: `1.5px solid ${activeCat === id ? meta.color : "rgba(0,0,0,0.08)"}`, color: activeCat === id ? "white" : "#888", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {featured && <FeaturedCard item={featured} accent={accent} />}
        {rest.map(item => <ContentCard key={item.id} item={item} accent={accent} categoryLabel={FLU_CAT_META[item.category].label} />)}
      </div>

      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: `${GRAIN}, linear-gradient(150deg, #7A0037, #C4005A)`, backgroundSize: "200px 200px, auto", padding: "22px 20px", boxShadow: "0 8px 32px rgba(196,0,90,0.3)", border: `1px solid ${PINK}30` }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Build your media kit.</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Yande helps you put together a rate card and one-pager you can actually send to brands today.</p>
        <button style={{ padding: "12px 22px", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, #C4005A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", boxShadow: `0 4px 16px ${PINK}44` }}>Build My Media Kit →</button>
      </div>

      {/* ── Bloom AI Team ─────────────────────────────────────────────────── */}
      <div style={{ margin: "28px 0 0" }}>
        <div style={{ padding: "0 18px", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "rgba(255,31,125,0.6)", letterSpacing: "0.22em", marginBottom: 4 }}>✦ YOUR BLOOM AI TEAM</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, fontWeight: 900, color: "#1A1A1A", lineHeight: 1 }}>Meet the team.</p>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 18px 20px", scrollbarWidth: "none" as const }}>
          {([
            { name: "Zora",  role: "Data Analyst",        desc: "Reads your numbers so you don't have to",        grad: "linear-gradient(135deg, #FF1F7D, #C4005A)", emoji: "📊" },
            { name: "Lena",  role: "Content Strategist",  desc: "Plans your content calendar start to finish",     grad: "linear-gradient(135deg, #FF69B4, #FF1F7D)", emoji: "🗓" },
            { name: "Amara", role: "Ideator",             desc: "Sparks ideas when you're blank and blocked",      grad: "linear-gradient(135deg, #C4005A, #8A003A)", emoji: "💡" },
            { name: "Sade",  role: "Scripter",            desc: "Writes your hooks, captions, and full scripts",   grad: "linear-gradient(135deg, #FF1F7D, #FF69B4)", emoji: "✍️" },
            { name: "Nadia", role: "Publishing Manager",  desc: "Schedules, tracks, and manages your posts",       grad: "linear-gradient(135deg, #8A003A, #C4005A)", emoji: "📲" },
          ] as { name: string; role: string; desc: string; grad: string; emoji: string }[]).map(agent => (
            <button
              key={agent.name}
              style={{ flexShrink: 0, width: 152, background: "white", borderRadius: 18, padding: "14px 14px 16px", border: "1px solid rgba(255,31,125,0.1)", boxShadow: "0 3px 16px rgba(255,31,125,0.07)", cursor: "pointer", textAlign: "left" as const }}
            >
              {/* Avatar */}
              <div style={{ width: 48, height: 48, borderRadius: 14, background: agent.grad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }}>
                <span style={{ fontSize: 22 }}>{agent.emoji}</span>
              </div>
              {/* Name */}
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 17, color: "#111", lineHeight: 1, marginBottom: 2 }}>{agent.name}</p>
              {/* Role */}
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: PINK, marginBottom: 6 }}>{agent.role.toUpperCase()}</p>
              {/* Desc */}
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", lineHeight: 1.45 }}>{agent.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function WorkingPage() {
  const [mode, setMode] = useState<WorkMode>("working");
  const activeMeta = MODE_META[mode];

  return (
    <div style={{ background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      {/* Header */}
      <div style={{ padding: "56px 22px 24px", background: `${GRAIN}, linear-gradient(150deg, ${DARK} 0%, ${INK} 50%, ${PLUM} 100%)`, backgroundSize: "200px 200px, auto", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}10, transparent)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(30px, 10.5vw, 42px)", color: "white", lineHeight: 1, marginBottom: 6 }}>{activeMeta.label}.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.45)" }}>{activeMeta.tagline}</p>
      </div>

      {/* Mode switcher — the three tabs */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(15,15,26,0.97)", backdropFilter: "blur(8px)", borderBottom: "2px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex" }}>
          {(Object.entries(MODE_META) as [WorkMode, typeof MODE_META[WorkMode]][]).map(([id, meta]) => (
            <button key={id} onClick={() => setMode(id)} style={{
              flex: 1, padding: "13px 0", background: "none", border: "none", cursor: "pointer",
              borderBottom: mode === id ? `3px solid ${meta.accent === PLUM ? PINK : meta.accent}` : "3px solid transparent",
              transition: "border-color 0.18s",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: mode === id ? "white" : "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{meta.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {mode === "working"    && <GirlWorkingTab />}
      {mode === "trepreneur" && <GirltrepreneurTab />}
      {mode === "fluencer"   && <GirlFluencerTab />}
    </div>
  );
}
