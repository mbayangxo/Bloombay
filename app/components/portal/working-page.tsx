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

const CAREER_ITEMS: CareerItem[] = [
  {
    id: "c1", category: "job", industry: "tech",
    title: "UX Research Lead — Figma · $145K–$175K",
    body: "Figma's NYC office is hiring a senior UX researcher to lead consumer insights. Hybrid 3 days. 4 of 6 research leads are women. Equity included.",
    badge: "HOT JOB", badge_color: "#0F4C81",
    yande_note: "Real growth built in — leading a team within 18 months, not individual contributor work forever.",
    cover_a: "#0F4C81", cover_b: "#1565C0", featured: true,
  },
  {
    id: "c2", category: "hot_take", industry: "all",
    title: "The 'Culture Fit' Interview Is a Trap",
    body: "'Culture fit' usually means will you tolerate dysfunction without complaining. Counter: ask them to describe a time someone gave critical feedback upward and what happened next.",
    badge: "HOT TAKE", badge_color: PINK,
    yande_note: "If they can't answer that question well, you already know the culture.",
    cover_a: PLUM, cover_b: "#4A0070",
  },
  {
    id: "c3", category: "salary", industry: "media",
    title: "Marketing Managers Are Leaving $18K on the Table in NYC",
    body: "Market rate: $88K–$112K. Most women accept $74K. Counter at 15% above, cite market data, stop apologizing. Silence after you name the number is fine.",
    badge: "NEGOTIATE THIS", badge_color: "#2E7D32",
    yande_note: "Discomfort of negotiating lasts 30 seconds. Regret lasts years.",
    cover_a: "#1B5E20", cover_b: "#2E7D32",
  },
  {
    id: "c4", category: "event", industry: "all",
    title: "She Builds Summit — Brooklyn Navy Yard",
    body: "Annual summit for women building in NYC. This Saturday. Founders, VCs, operators who are actually doing it. $35 general admission, limited seats.",
    badge: "THIS WEEKEND", badge_color: "#C4005A",
    yande_note: "Networking here is real — actual connections, not business cards.",
    cover_a: "#880E4F", cover_b: "#C4005A",
  },
  {
    id: "c5", category: "career_move", industry: "tech",
    title: "The PM Cert That FAANG Actually Respects",
    body: "PMP certification = $22K more salary on average for NYC women in tech-adjacent roles. 3 months prep, $555 exam. ROI is immediate.",
    badge: "ELEVATE", badge_color: "#5B2D8E",
    yande_note: "If you've been in ops or coordinator role for 2+ years and feel stuck, this is the signal that unlocks the next door.",
    cover_a: "#4A148C", cover_b: "#7B1FA2",
  },
];

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

const TREP_ITEMS: TrepItem[] = [
  {
    id: "t1", category: "funding",
    title: "How to Get Into an Accelerator With No Revenue Yet",
    body: "YC, First Round, Forerunner, and Female Founders Fund all accept pre-revenue companies. What they want: a clear problem, a convincing founder, and evidence you've talked to real customers. Applications open now.",
    badge: "FUNDING", badge_color: "#7B1FA2",
    yande_note: "The biggest mistake pre-revenue founders make is waiting to have more. Apply now and let the application sharpen your thinking.",
    cover_a: "#4A148C", cover_b: "#7B1FA2", featured: true,
  },
  {
    id: "t2", category: "legal",
    title: "LLC vs S-Corp — Which One to Pick as a Solo Founder",
    body: "If you're making under $80K/year: LLC. Over $80K: talk to an accountant about S-Corp election — you could save $8K–$15K in self-employment tax. Don't just Googling this. One consultation with a CPA is worth $300.",
    badge: "LEGAL", badge_color: "#2E7D32",
    yande_note: "Most women wait too long to set up the right structure and it costs them real money. Do this before you need to.",
    cover_a: "#1B5E20", cover_b: "#388E3C",
  },
  {
    id: "t3", category: "launch",
    title: "The NYC Pop-Up Strategy That Gets You First Customers",
    body: "Event-based pop-ups are how NYC founders validate before investing in inventory. Find a host venue (coffee shop, gallery, boutique), bring 20–30 products, charge full price. If you sell out in 3 hours, you have a business.",
    badge: "LAUNCH", badge_color: "#0F4C81",
    yande_note: "Don't overthink the brand deck. Your first test is whether strangers will pay real money right in front of you.",
    cover_a: "#0D47A1", cover_b: "#1565C0",
  },
  {
    id: "t4", category: "growth",
    title: "The Email List Is Still the Biggest Asset You Own",
    body: "Instagram can deplatform you. TikTok can ban you. Your email list is yours. Women-founded brands that grew from 0 to $1M — nearly all of them credit email marketing as the highest ROI channel. Start now.",
    badge: "GROWTH", badge_color: "#C4005A",
    yande_note: "Every Bloomie who follows you on Instagram should also be on your email list. That's the move.",
    cover_a: "#880E4F", cover_b: "#C4005A",
  },
  {
    id: "t5", category: "mindset",
    title: "You Don't Need to Be Ready. You Need to Be Honest.",
    body: "The question isn't whether you're ready to launch. It's whether you can honestly articulate the problem you're solving and who has it. That's it. Everything else is learned.",
    badge: "MINDSET", badge_color: GOLD,
    yande_note: "Readiness is a feeling. Clarity is a decision. Start with clarity.",
    cover_a: "#BF6F00", cover_b: GOLD,
  },
];

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

const FLU_ITEMS: FluItem[] = [
  {
    id: "f1", category: "monetize",
    title: "The Rate Card Every NYC Creator Should Have",
    body: "NYC creator rates: 10K–50K followers → $500–$2K per sponsored post. 50K–200K → $2K–$8K. 200K+ → negotiate. Stop undercharging because someone said you're 'micro.' Micro with high engagement outperforms macro every time.",
    badge: "RATE CARD", badge_color: "#2E7D32",
    yande_note: "Your engagement rate is the number brands actually care about. Calculate it and know it before every conversation.",
    cover_a: "#1B5E20", cover_b: "#388E3C", featured: true,
  },
  {
    id: "f2", category: "brand_deal",
    title: "How to Pitch a Brand Deal (Without an Agent)",
    body: "Email subject: '[Your name] × [Brand Name] — partnership proposal.' Two paragraphs: who you are and why this brand aligns with your audience specifically. Attach your media kit. Always propose 3 tiers of partnership at 3 prices.",
    badge: "BRAND DEAL", badge_color: "#0F4C81",
    yande_note: "The brand already knows they want to reach your audience. You're not asking for a favor — you're proposing a business deal.",
    cover_a: "#0D47A1", cover_b: "#1565C0",
  },
  {
    id: "f3", category: "growth",
    title: "The TikTok Hook Formula That's Actually Working Right Now",
    body: "First 1.5 seconds: state the problem your viewer has right now. Not your solution — their problem. 'If you're doing X, stop.' or 'The reason Y keeps happening is...' Then deliver. No 10-second intros.",
    badge: "CONTENT TIP", badge_color: "#C4005A",
    yande_note: "The algorithm doesn't reward pretty — it rewards watch time. Hook first, everything else second.",
    cover_a: "#880E4F", cover_b: "#C4005A",
  },
  {
    id: "f4", category: "platform",
    title: "Substack Is Having a Moment — Here's Why Creators Are Moving There",
    body: "Creators with 10K+ TikTok or Instagram followers are launching Substack newsletters and hitting $2K–$5K/month within 6 months. It's owned content, no algorithm, direct to your audience. The free tier grows the paid.",
    badge: "PLATFORM PICK", badge_color: GOLD,
    yande_note: "Every creator should have an email list or a Substack. One policy change on TikTok and your audience disappears — own the relationship.",
    cover_a: "#BF6F00", cover_b: GOLD,
  },
  {
    id: "f5", category: "content",
    title: "The Content Calendar System That Actually Works for Solo Creators",
    body: "Batch 4 weeks of content in one Sunday. Theme each week (product week, personal story week, tips week, community week). Film everything in one day per week. If you're posting daily without batching, you'll burn out.",
    badge: "WORKFLOW", badge_color: "#5B2D8E",
    yande_note: "Consistency beats volume. Three times a week, batched in advance, beats daily chaos.",
    cover_a: "#4A148C", cover_b: "#7B1FA2",
  },
];

// ── Demo coworkers ────────────────────────────────────────────────────────────
const COWORKERS = [
  { name: "Amara T.", initial: "A", color: "#0F4C81", role: "Tech · Product",    status: "online" },
  { name: "Nia B.",   initial: "N", color: "#7B1FA2", role: "Founder · Beauty",  status: "online" },
  { name: "Kezia M.", initial: "K", color: "#C4005A", role: "Creator · Lifestyle", status: "online" },
];

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
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 42, color: "white", lineHeight: 1, marginBottom: 6 }}>{activeMeta.label}.</h1>
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
