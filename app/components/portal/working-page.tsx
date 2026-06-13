"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#0F0F1A";
const INK   = "#1A1A2E";
const CREAM = "#FAF6F0";
const PLUM  = "#1A0A2E";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type CareerCat = "all" | "job" | "career_move" | "event" | "salary" | "hot_take";
type Industry  = "all" | "tech" | "finance" | "media" | "fashion" | "healthcare" | "creative" | "law" | "nonprofit";

const CAT_META: Record<CareerCat, { label: string; color: string }> = {
  all:         { label: "All",         color: DARK },
  job:         { label: "Jobs",        color: "#0F4C81" },
  career_move: { label: "Elevate",     color: "#5B2D8E" },
  event:       { label: "Events",      color: "#C4005A" },
  salary:      { label: "Money",       color: "#2E7D32" },
  hot_take:    { label: "Hot Take",    color: PINK },
};

const INDUSTRY_META: Record<Industry, { label: string; emoji: string }> = {
  all:        { label: "All Industries",  emoji: "💼" },
  tech:       { label: "Tech",            emoji: "💻" },
  finance:    { label: "Finance",         emoji: "📈" },
  media:      { label: "Media",           emoji: "📱" },
  fashion:    { label: "Fashion",         emoji: "👗" },
  healthcare: { label: "Healthcare",      emoji: "🏥" },
  creative:   { label: "Creative",        emoji: "🎨" },
  law:        { label: "Law & RE",        emoji: "⚖️" },
  nonprofit:  { label: "Nonprofit",       emoji: "🌱" },
};

interface CareerItem {
  id: string;
  category: CareerCat;
  industry: Industry;
  title: string;
  body: string;
  badge?: string;
  badge_color?: string;
  yande_note: string;
  cover_a: string;
  cover_b: string;
  featured?: boolean;
}

const MOCK_ITEMS: CareerItem[] = [
  {
    id: "1", category: "job", industry: "tech",
    title: "UX Research Lead — Figma · $145K–$175K",
    body: "Figma's NYC office is hiring a senior UX researcher to lead consumer insights across 4 product teams. Hybrid 3 days. They promote women — 4 of 6 research leads are women. Equity included.",
    badge: "HOT JOB", badge_color: "#0F4C81",
    yande_note: "This one has real growth built in — you'd be leading a team within 18 months, not doing individual contributor work forever.",
    cover_a: "#0F4C81", cover_b: "#1565C0", featured: true,
  },
  {
    id: "2", category: "hot_take", industry: "all",
    title: "The 'Culture Fit' Interview Is a Trap",
    body: "'Culture fit' usually means: will you tolerate our dysfunction without complaining? Here's how to turn it — ask them to describe a time a team member gave critical feedback upward and what happened next.",
    badge: "HOT TAKE", badge_color: PINK,
    yande_note: "If they can't answer that question well, you already know the culture.",
    cover_a: PLUM, cover_b: "#4A0070",
  },
  {
    id: "3", category: "salary", industry: "media",
    title: "Marketing Managers Are Leaving $18K on the Table in NYC",
    body: "Market rate in NYC: $88K–$112K. Most women accept first offers at $74K. Counter at 15% above, cite data, stop apologizing. Silence after you name the number is fine.",
    badge: "NEGOTIATE THIS", badge_color: "#2E7D32",
    yande_note: "The discomfort of negotiating lasts 30 seconds. The regret lasts years.",
    cover_a: "#1B5E20", cover_b: "#2E7D32",
  },
  {
    id: "4", category: "event", industry: "all",
    title: "She Builds Summit — Brooklyn Navy Yard",
    body: "Annual summit for women building companies, products, and movements in NYC. This Saturday. Founders, VCs, operators who are actually building. $35 general admission.",
    badge: "THIS WEEKEND", badge_color: "#C4005A",
    yande_note: "The networking here is real — not business cards, actual connections with women doing the thing.",
    cover_a: "#880E4F", cover_b: "#C4005A",
  },
  {
    id: "5", category: "career_move", industry: "tech",
    title: "The PM Cert That FAANG Actually Respects",
    body: "PMP certification = $22K more salary on average for NYC women in tech-adjacent roles. Prep: 3 months studying 8h/week. PMI exam: $555. ROI is immediate.",
    badge: "ELEVATE", badge_color: "#5B2D8E",
    yande_note: "If you've been an operations or coordinator for 2+ years and feel stuck, this signals 'ready to lead.'",
    cover_a: "#4A148C", cover_b: "#7B1FA2",
  },
  {
    id: "6", category: "hot_take", industry: "all",
    title: "Return to Office Is Not Neutral",
    body: "RTO mandates hit women harder. Women with caregiving responsibilities and long commutes are disproportionately forced out. Companies with 5-day RTO have 14% higher female attrition. Ask about flex before you accept.",
    badge: "HOT TAKE", badge_color: PINK,
    yande_note: "This isn't about hating the office — it's about not letting a policy that affects you disproportionately be framed as equal.",
    cover_a: "#BF360C", cover_b: "#E64A19",
  },
];

// Demo coworkers for digital coworking section
const COWORKERS = [
  { name: "Amara T.", initial: "A", color: "#0F4C81", industry: "Tech · Product",    status: "online" },
  { name: "Nia B.",   initial: "N", color: "#5B2D8E", industry: "Finance · IB",     status: "online" },
  { name: "Kezia M.", initial: "K", color: "#C4005A", industry: "Media · Editorial", status: "online" },
];

function FeaturedCard({ item }: { item: CareerItem }) {
  const meta = CAT_META[item.category];
  return (
    <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.16)", background: CREAM, border: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ height: 200, background: `linear-gradient(160deg, ${item.cover_a} 0%, ${item.cover_b} 100%)`, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "200px 200px" }} />
        {item.badge && (
          <div style={{ position: "absolute", top: 14, left: 14, background: item.badge_color ?? PINK, borderRadius: 99, padding: "4px 11px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.16em" }}>{item.badge}</p>
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1, padding: "0 18px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", paddingTop: 40, width: "100%" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: meta.color, background: `${meta.color}28`, borderRadius: 99, padding: "2px 8px", marginBottom: 8, display: "inline-block", backdropFilter: "blur(4px)" }}>{meta.label.toUpperCase()}</span>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 21, color: "white", lineHeight: 1.15, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{item.title}</h2>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.6)", lineHeight: 1.55, marginBottom: 14 }}>{item.body}</p>
        <div style={{ background: `${PINK}08`, borderRadius: 12, padding: "10px 14px", borderLeft: `3px solid ${PINK}` }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, lineHeight: 1.5 }}>{item.yande_note} <span style={{ fontFamily: "var(--font-caveat)", color: PINK, opacity: 0.7 }}>— Yande ✦</span></p>
        </div>
      </div>
    </div>
  );
}

function CareerCard({ item }: { item: CareerItem }) {
  const meta = CAT_META[item.category];
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)", display: "flex" }}>
      <div style={{ width: 6, flexShrink: 0, background: `linear-gradient(180deg, ${item.cover_a}, ${item.cover_b})` }} />
      <div style={{ flex: 1, padding: "14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: meta.color, background: `${meta.color}12`, borderRadius: 99, padding: "2px 7px" }}>{meta.label.toUpperCase()}</span>
          {item.badge && <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: item.badge_color ?? PINK }}>{item.badge}</span>}
        </div>
        <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK, lineHeight: 1.25, marginBottom: 6 }}>{item.title}</h3>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5, marginBottom: 10 }}>{item.body}</p>
        <div style={{ background: `${PINK}08`, borderRadius: 10, padding: "8px 11px", borderLeft: `2px solid ${PINK}55` }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: PINK, lineHeight: 1.45 }}>{item.yande_note} <span style={{ opacity: 0.6 }}>— Yande ✦</span></p>
        </div>
      </div>
    </div>
  );
}

export function WorkingPage() {
  const [activeCategory, setActiveCategory]   = useState<CareerCat>("all");
  const [activeIndustry, setActiveIndustry]   = useState<Industry>("all");
  const cats     = Object.entries(CAT_META)     as [CareerCat, { label: string; color: string }][];
  const industries = Object.entries(INDUSTRY_META) as [Industry, { label: string; emoji: string }][];

  const filtered = MOCK_ITEMS.filter(i =>
    (activeCategory === "all" || i.category === activeCategory) &&
    (activeIndustry === "all" || i.industry === activeIndustry || i.industry === "all")
  );
  const [featured, ...rest] = filtered;

  return (
    <div style={{ background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "56px 22px 24px", background: `${GRAIN}, linear-gradient(150deg, ${DARK} 0%, ${INK} 50%, ${PLUM} 100%)`, backgroundSize: "200px 200px, auto", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}10, transparent)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", borderRadius: 99, padding: "4px 12px", border: `1px solid ${PINK}30` }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: `${PINK}CC`, letterSpacing: "0.2em" }}>JOBS · MONEY · CAREER MOVES</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: `${PINK}55`, letterSpacing: "0.3em", marginBottom: 4 }}>BLOOMBAY</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 44, color: "white", lineHeight: 1, marginBottom: 6 }}>Girl Working.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.45)" }}>Jobs. Elevation. NYC career life.</p>
      </div>

      {/* Digital Coworking Strip */}
      <div style={{ background: "white", padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "#aaa", letterSpacing: "0.18em" }}>DIGITAL COWORKING NOW</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.5)" }}>3 Bloomies are working right now</p>
          </div>
          <button style={{ background: PINK, borderRadius: 99, padding: "7px 16px", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>
            Drop In →
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {COWORKERS.map((cw) => (
            <div key={cw.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8f8f8", borderRadius: 99, padding: "5px 10px 5px 5px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${cw.color}, ${cw.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>{cw.initial}</div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 7, height: 7, borderRadius: "50%", background: "#22C55E", border: "1.5px solid white" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: DARK }}>{cw.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#aaa" }}>{cw.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(250,246,240,0.97)", backdropFilter: "blur(8px)", borderBottom: `2px solid ${PINK}18` }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCategory(id)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 99, background: activeCategory === id ? meta.color : "white", border: `1.5px solid ${activeCategory === id ? meta.color : "rgba(0,0,0,0.08)"}`, color: activeCategory === id ? "white" : "#888", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{meta.label}</button>
          ))}
        </div>
        {/* Industry filter */}
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "0 18px 10px" }}>
          {industries.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveIndustry(id)} style={{ flexShrink: 0, padding: "4px 12px", borderRadius: 99, background: activeIndustry === id ? "#0F0F1A" : "transparent", border: `1px solid ${activeIndustry === id ? "#0F0F1A" : "rgba(0,0,0,0.1)"}`, color: activeIndustry === id ? "white" : "#aaa", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{meta.emoji} {meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(0,0,0,0.35)", textAlign: "center", padding: "40px 0" }}>No content yet for this filter — Yande is on it for next week.</p>
        ) : (
          <>
            {featured && <FeaturedCard item={featured} />}
            {rest.map(item => <CareerCard key={item.id} item={item} />)}
          </>
        )}
      </div>

      {/* Share an opportunity CTA */}
      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: `${GRAIN}, ${DARK}`, backgroundSize: "200px 200px, auto", padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: `1px solid ${PINK}18` }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Know a great opportunity?</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Share a job, event, or tip with the girls. BloomBay women help each other get the bag.</p>
        <button style={{ padding: "12px 22px", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, #C4005A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", letterSpacing: "0.06em", boxShadow: `0 4px 16px ${PINK}44` }}>
          Share an Opportunity →
        </button>
      </div>
    </div>
  );
}
