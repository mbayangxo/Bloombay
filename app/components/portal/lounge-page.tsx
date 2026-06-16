"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { updateProfile } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/client";

// ── CONSTANTS ──────────────────────────────────────────────────────────────────

const PINK   = "#FF1F7D";

// ── PURCHASE HISTORY ──────────────────────────────────────────────────────────

interface Purchase {
  id: string;
  type: string;
  item_name: string | null;
  amount_cents: number | null;
  currency: string;
  status: string;
  created_at: string;
}

const PURCHASE_META: Record<string, { icon: string; label: string }> = {
  membership:          { icon: "🌺", label: "BloomBay Membership" },
  platform_membership: { icon: "🌺", label: "BloomBay Membership" },
  event_ticket:        { icon: "🎟️", label: "Event Ticket" },
  club_membership:     { icon: "💎", label: "Club Membership" },
  hanger_purchase:     { icon: "👗", label: "The Hanger" },
};

function formatCurrency(cents: number | null, currency = "gbp") {
  if (!cents) return "—";
  const sym = currency === "gbp" ? "£" : "$";
  return `${sym}${(cents / 100).toFixed(2)}`;
}

function PurchaseHistorySection() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("purchases")
          .select("id, type, item_name, amount_cents, currency, status, created_at")
          .order("created_at", { ascending: false })
          .limit(20);
        setPurchases((data as Purchase[]) ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: "28px 20px 0" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(0,0,0,0.28)", marginBottom: 14 }}>
        ✦ PURCHASE HISTORY
      </p>

      {loading ? (
        <div style={{ background: "white", borderRadius: 16, padding: "20px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#bbb" }}>Loading…</p>
        </div>
      ) : purchases.length === 0 ? (
        <div style={{ background: "white", borderRadius: 16, padding: "20px 18px", boxShadow: "0 2px 12px rgba(255,31,125,0.06)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#bbb", textAlign: "center" }}>No purchases yet</p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(255,31,125,0.07)" }}>
          {purchases.map((p, i) => {
            const meta = PURCHASE_META[p.type] ?? { icon: "✦", label: p.type };
            const date = new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: i < purchases.length - 1 ? "1px solid #FFF0F5" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {meta.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                    {p.item_name ?? meta.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa" }}>{date}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, color: PINK }}>
                    {formatCurrency(p.amount_cents, p.currency)}
                  </p>
                  {p.status !== "completed" && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#F59E0B", fontWeight: 700 }}>{p.status}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
const DARK   = "#1C1B1C";
const PAPER  = "#FEFCF7";
const GOLD   = "#D4A853";

// ── DATA ──────────────────────────────────────────────────────────────────────

const ALL_FLOWERS = [
  { id: "host",      emoji: "🌹", label: "Host",      color: "#E63946", bg: "#FFF0F0" },
  { id: "connector", emoji: "🌸", label: "Connector", color: "#FF69B4", bg: "#FFF0F8" },
  { id: "community", emoji: "🌺", label: "Community", color: "#FF1F7D", bg: "#FFF0F5" },
  { id: "explorer",  emoji: "🌷", label: "Explorer",  color: "#E8006A", bg: "#FFF0F3" },
  { id: "culture",   emoji: "🌼", label: "Culture",   color: "#C80060", bg: "#FFF0F3" },
  { id: "adventure", emoji: "🌻", label: "Adventure", color: "#FF5BAD", bg: "#FFF0F8" },
  { id: "wisdom",    emoji: "🪷", label: "Wisdom",    color: "#A8004C", bg: "#FFF0F4" },
  { id: "founding",  emoji: "🌺", label: "Founding",  color: "#FF1F7D", bg: "#FFF0F5" },
  { id: "bloombay",  emoji: "💮", label: "BloomBay",  color: "#FF1F7D", bg: "#FFF0F5" },
] as const;

type FlowerId = typeof ALL_FLOWERS[number]["id"];

const USER_EARNED_FLOWER_IDS: FlowerId[] = ["founding", "connector", "culture", "explorer"];

const BLOOMIE_FLOWER_IDS: Record<string, FlowerId[]> = {
  "Aaliyah M.": ["host", "community"],
  "Sofia K.":   ["connector", "adventure"],
  "Kelechi O.": ["culture", "wisdom"],
  "Naomi B.":   ["explorer"],
  "Temi A.":    ["community"],
  "Zara F.":    ["adventure", "connector"],
};

const ALL_BLOOMIES = [
  { name: "Aaliyah M.", neighborhood: "Crown Heights", color: "#FF1F7D", initial: "A", since: "Jan 2026" },
  { name: "Sofia K.",   neighborhood: "Williamsburg",  color: "#FF69B4", initial: "S", since: "Feb 2026" },
  { name: "Kelechi O.", neighborhood: "Flatbush",      color: "#FF69B4", initial: "K", since: "Mar 2026" },
  { name: "Naomi B.",   neighborhood: "SoHo",          color: "#FF69B4", initial: "N", since: "Apr 2026" },
  { name: "Temi A.",    neighborhood: "Crown Heights", color: "#FF1F7D", initial: "T", since: "Apr 2026" },
  { name: "Zara F.",    neighborhood: "DUMBO",         color: "#FF69B4", initial: "Z", since: "May 2026" },
];

const BLOOMIE_UPDATES: Record<string, { emoji: string; text: string; time: string }[]> = {
  "Aaliyah M.": [
    { emoji: "🌅", text: "Just got back from that Williamsburg matcha spot. It's everything.", time: "2h ago" },
    { emoji: "🎨", text: "Paint & sip night was so good. Already planning the next one.",       time: "Yesterday" },
  ],
  "Sofia K.":   [
    { emoji: "🏃‍♀️", text: "Sunday run done. Pastries were mandatory.",       time: "3h ago"     },
    { emoji: "✈️",  text: "Thinking Morocco in October. Who's in?",            time: "2 days ago" },
  ],
  "Kelechi O.": [
    { emoji: "📚", text: "Book club pick just dropped. Cannot wait.",                   time: "5h ago"     },
    { emoji: "🍷", text: "That rooftop spot in Flatbush is unreal. Telling everyone.",  time: "3 days ago" },
  ],
};

const MEMORIES = [
  { emoji: "🌅", title: "Williamsburg morning", date: "May 12", color: "#FFF0F5", rotate: "-2.5deg" },
  { emoji: "🍷", title: "Rooftop wine hour",    date: "May 8",  color: "#FFE8F3", rotate:  "2deg"   },
  { emoji: "🎨", title: "Paint + sip night",    date: "Apr 30", color: "#FFF5F8", rotate: "-1.5deg" },
  { emoji: "🏃‍♀️", title: "Run club Sunday",  date: "Apr 27", color: "#FFE0EE", rotate:  "3deg"   },
  { emoji: "🧘", title: "Pilates morning",      date: "Apr 20", color: "#FFF0F5", rotate: "-2deg"   },
  { emoji: "☕", title: "Matcha café crawl",    date: "Apr 14", color: "#FFF5F8", rotate:  "1.5deg" },
];

const INTEREST_TAGS = ["Soft Life", "Art", "Wellness", "Food", "Music", "Travel"];

const WITNESS_ENTRIES = [
  { initial: "A", color: "#FF1F7D", text: "She lights up the whole table when she talks about food.",  date: "Apr 2026" },
  { initial: "Z", color: "#FF69B4", text: "The most thoughtful woman I've met at a BloomBay event.",   date: "Mar 2026" },
  { initial: "N", color: "#C084FC", text: "She made everyone feel welcome that Sunday morning walk.",  date: "Mar 2026" },
  { initial: "M", color: "#FB923C", text: "Real, grounded, and completely herself — rare.",            date: "Feb 2026" },
];

function getMemberNumber(name: string) {
  const s = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return (((s * 31 + 17) % 900) + 100).toString().padStart(4, "0");
}
function getReferralCode(name: string) {
  const s = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return `BB-NYC-${((s * 17 + 23) % 9000) + 1000}`;
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface LoungeUser { name: string; initial: string; neighborhood: string; bio?: string; }
interface BloomieProfile { name: string; neighborhood: string; color: string; initial: string; since: string; }

// ── MEMBERSHIP CARD ───────────────────────────────────────────────────────────

function MembershipCard({ name, memberNum, tier = "FOUNDING" }: {
  name: string; memberNum: string; tier?: string;
}) {
  return (
    <div style={{
      width: "100%",
      maxWidth: 340,
      margin: "0 auto",
      aspectRatio: "85.6 / 54",
      borderRadius: 14,
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(138deg, #0D0008 0%, #2A0820 28%, #580035 58%, #A40050 82%, #C4005A 100%)",
      boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 8px 24px rgba(196,0,90,0.22), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)",
    }}>
      {/* Holographic shimmer stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent 5%, #FF1F7D 25%, #FF69B4 45%, #FFB3D9 60%, #FF5BAD 78%, #FF1F7D 88%, transparent 98%)",
      }} />

      {/* Light streak */}
      <div style={{
        position: "absolute", top: 0, left: "15%", width: "38%", height: "100%",
        background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.035) 50%, transparent 72%)",
        pointerEvents: "none",
      }} />

      {/* Paper grain texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        pointerEvents: "none",
      }} />

      {/* Large bloom watermark */}
      <div style={{ position: "absolute", right: -10, bottom: -10, width: 110, height: 110, opacity: 0.08, pointerEvents: "none" }}>
        <svg viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="22" rx="11" ry="22"/>
          <ellipse cx="50" cy="22" rx="11" ry="22" transform="rotate(60 50 50)"/>
          <ellipse cx="50" cy="22" rx="11" ry="22" transform="rotate(120 50 50)"/>
          <ellipse cx="50" cy="22" rx="11" ry="22" transform="rotate(180 50 50)"/>
          <ellipse cx="50" cy="22" rx="11" ry="22" transform="rotate(240 50 50)"/>
          <ellipse cx="50" cy="22" rx="11" ry="22" transform="rotate(300 50 50)"/>
          <circle cx="50" cy="50" r="12"/>
        </svg>
      </div>

      {/* Card content */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        height: "100%", padding: "14px 18px 12px",
        boxSizing: "border-box",
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: "white", lineHeight: 1 }}>BloomBay</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 700, letterSpacing: "0.28em", color: "rgba(255,255,255,0.32)", marginTop: 2 }}>NEW YORK CITY</p>
          </div>
          <div style={{
            background: "rgba(212,168,83,0.16)", border: "1px solid rgba(212,168,83,0.48)",
            borderRadius: 3, padding: "2px 8px",
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.18em", color: GOLD }}>{tier}</p>
          </div>
        </div>

        {/* Gold chip */}
        <div style={{
          width: 30, height: 21, borderRadius: 3,
          background: "linear-gradient(135deg, #D4A853 0%, #F4D03F 38%, #D4A853 65%, #B8860B 100%)",
          boxShadow: "0 1px 5px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.28)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: "3px 3px",
            border: "0.5px solid rgba(0,0,0,0.18)", borderRadius: 1,
            background: "linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 30%, rgba(0,0,0,0.04) 70%, transparent 100%)",
          }} />
        </div>

        {/* Name + number */}
        <div>
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
            fontSize: 16, color: "white", letterSpacing: "0.03em", marginBottom: 5,
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}>{name || "Member"}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)" }}>
              ●●●● ●●●● ●●●● {memberNum}
            </p>
            <div style={{ textAlign: "right" as const }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>SINCE</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APARTMENT DOOR ────────────────────────────────────────────────────────────

function ApartmentDoor({ label, icon, href, num, accentColor = PINK }: {
  label: string; icon: string; href: string; num: string; accentColor?: string;
}) {
  const doorWood = "#B5724A";
  const doorPanel = "#C9895A";
  const frameColor = "#7A4A28";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Drop shadow */}
        <div style={{
          position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
          width: 50, height: 10, borderRadius: "50%",
          background: "rgba(0,0,0,0.2)", filter: "blur(5px)",
        }} />

        {/* Door SVG */}
        <svg width="58" height="82" viewBox="0 0 58 82" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Frame */}
          <rect x="0" y="24" width="58" height="58" rx="1" fill={frameColor}/>
          <path d={`M0 24 Q0 0 29 0 Q58 0 58 24 Z`} fill={frameColor}/>

          {/* Door body */}
          <rect x="2" y="24" width="54" height="56" rx="1" fill={doorWood}/>
          <path d={`M2 24 Q2 2 29 2 Q56 2 56 24 Z`} fill={doorWood}/>

          {/* Door surface lighter */}
          <rect x="4" y="25" width="50" height="54" rx="1" fill={doorPanel}/>
          <path d={`M4 25 Q4 4 29 4 Q54 4 54 25 Z`} fill={doorPanel}/>

          {/* Top panel */}
          <rect x="8" y="28" width="42" height="20" rx="2.5" fill="rgba(0,0,0,0.12)" stroke="rgba(0,0,0,0.14)" strokeWidth="0.8"/>

          {/* Bottom panel */}
          <rect x="8" y="56" width="42" height="18" rx="2.5" fill="rgba(0,0,0,0.12)" stroke="rgba(0,0,0,0.14)" strokeWidth="0.8"/>

          {/* Highlight on arch */}
          <path d={`M6 24 Q6 6 29 6 Q48 6 52 18`} stroke="rgba(255,255,255,0.14)" strokeWidth="2" fill="none" strokeLinecap="round"/>

          {/* Gold number plate */}
          <rect x="19" y="14" width="20" height="12" rx="2" fill={GOLD} opacity="0.9"/>
          <text x="29" y="23" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fontWeight="bold" fill="#7B4A1A">{num}</text>

          {/* Door knob */}
          <circle cx="44" cy="44" r="4.5" fill={GOLD} opacity="0.9"/>
          <circle cx="44" cy="44" r="3" fill="url(#knobGrad)"/>
          <circle cx="43" cy="43" r="1.2" fill="rgba(255,255,255,0.5)"/>

          <defs>
            <radialGradient id="knobGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F4D03F"/>
              <stop offset="100%" stopColor="#B8860B"/>
            </radialGradient>
          </defs>
        </svg>

        {/* Room icon overlay */}
        <div style={{
          position: "absolute", top: "36%", left: "38%", transform: "translate(-50%, -50%)",
          fontSize: 18, lineHeight: 1, pointerEvents: "none",
        }}>{icon}</div>

        {/* Accent dot */}
        <div style={{
          position: "absolute", top: -4, right: -4, width: 12, height: 12,
          borderRadius: "50%", background: accentColor,
          boxShadow: `0 2px 8px ${accentColor}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "white" }} />
        </div>
      </div>

      {/* Threshold */}
      <div style={{ width: 64, height: 4, borderRadius: "0 0 4px 4px", background: frameColor, boxShadow: "0 2px 6px rgba(0,0,0,0.22)", marginTop: -8 }} />

      <p style={{
        fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800,
        letterSpacing: "0.1em", color: "#888",
        textAlign: "center" as const, textTransform: "uppercase" as const,
        lineHeight: 1.4, maxWidth: 68,
      }}>{label}</p>
    </Link>
  );
}

// ── BLOOMIE SHEET ─────────────────────────────────────────────────────────────

function BloomieSheet({ bloomie, onClose }: { bloomie: BloomieProfile; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const updates = BLOOMIE_UPDATES[bloomie.name] ?? [];

  function sendMessage() {
    if (!message.trim()) return;
    setSent(true); setMessage("");
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: PAPER, boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "85vh", overflowY: "auto" }}>
        <div className="flex justify-center pt-3 pb-2"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} /></div>
        <div className="px-6 pb-5 flex items-start gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg,${bloomie.color},${bloomie.color}BB)`, boxShadow: `0 4px 16px ${bloomie.color}44` }}>
            {bloomie.initial}
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{bloomie.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{bloomie.neighborhood} · since {bloomie.since}</p>
            <span className="inline-block mt-2 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider" style={{ background: PINK, color: "white" }}>✦ YOUR BLOOMIE</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        <div className="px-6 pb-5">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: PINK }}>SEND A MESSAGE</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1.5px solid #F0E0E8" }}>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder={`Write to ${bloomie.name.split(" ")[0]}…`} rows={3}
              className="w-full resize-none text-sm outline-none px-4 py-3" style={{ background: "transparent", color: "#111", lineHeight: 1.6 }} />
            <div className="px-4 pb-3 flex justify-end">
              <button onClick={sendMessage} disabled={!message.trim()} className="px-5 py-2 rounded-full text-xs font-bold"
                style={sent ? { background: "#111", color: PINK } : message.trim() ? { background: PINK, color: "white" } : { background: "#F0E0E8", color: "#C8A0B0" }}>
                {sent ? "Sent ✓" : "Send →"}
              </button>
            </div>
          </div>
        </div>
        {updates.length > 0 && (
          <div className="px-6 pb-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.3)" }}>HER UPDATES</p>
            <div className="flex flex-col gap-2.5">
              {updates.map((u, i) => (
                <div key={i} className="rounded-2xl px-4 py-3.5" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{u.emoji}</span>
                    <div>
                      <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{u.text}</p>
                      <p className="text-xs mt-1" style={{ color: "#bbb" }}>{u.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {(BLOOMIE_FLOWER_IDS[bloomie.name]?.length ?? 0) > 0 && (
          <div className="px-6 pb-8">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.3)" }}>HER FLOWERS</p>
            <div className="flex gap-2 flex-wrap">
              {BLOOMIE_FLOWER_IDS[bloomie.name].map(fid => {
                const f = ALL_FLOWERS.find(fl => fl.id === fid);
                if (!f) return null;
                return (
                  <div key={fid} className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: f.bg, border: `1px solid ${f.color}44` }}>
                    <span style={{ fontSize: 14 }}>{f.emoji}</span>
                    <span className="text-[10px] font-bold" style={{ color: f.color }}>{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── BLOOMIES LIST SHEET ───────────────────────────────────────────────────────

function BloomiesListSheet({ onClose, onSelect }: { onClose: () => void; onSelect: (b: BloomieProfile) => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: PAPER, maxHeight: "80vh", overflowY: "auto" }}>
        <div className="flex justify-center pt-3 pb-2"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} /></div>
        <div className="px-6 pb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: PINK }}>YOUR BLOOMIES</p>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{ALL_BLOOMIES.length} friends</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        <div className="px-6 pb-8 flex flex-col gap-2.5">
          {ALL_BLOOMIES.map(m => (
            <button key={m.name} onClick={() => { onClose(); setTimeout(() => onSelect(m), 100); }}
              className="rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform w-full"
              style={{ background: "white", boxShadow: "0 2px 10px rgba(255,31,125,0.07)", borderLeft: `3px solid ${m.color}` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${m.color},${m.color}AA)` }}>{m.initial}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#111" }}>{m.name}</p>
                <p className="text-xs mt-0.5 text-gray-400">{m.neighborhood} · since {m.since}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── EDIT PROFILE SHEET ────────────────────────────────────────────────────────

function EditProfileSheet({ name, neighborhood, bio, onClose, onSave }: {
  name: string; neighborhood: string; bio: string;
  onClose: () => void; onSave: (n: string, nb: string, b: string) => void;
}) {
  const [editName, setEditName] = useState(name);
  const [editNbhd, setEditNbhd] = useState(neighborhood);
  const [editBio,  setEditBio]  = useState(bio);
  const [pending,  setPending]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSave() {
    setPending(true); setError(null);
    const fd = new FormData();
    fd.set("first_name", editName.trim());
    fd.set("neighborhood", editNbhd.trim());
    fd.set("bio", editBio.trim());
    const result = await updateProfile(fd);
    setPending(false);
    if (result.error) setError(result.error);
    else { onSave(editName.trim(), editNbhd.trim(), editBio.trim()); onClose(); }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: PAPER, maxHeight: "85vh", overflowY: "auto" }}>
        <div className="flex justify-center pt-3 pb-2"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} /></div>
        <div className="px-6 pb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: PINK }}>EDIT PROFILE</p>
            <p className="text-lg font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Your details.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        <div className="px-6 pb-8 flex flex-col gap-4 mt-4">
          {[
            { label: "NAME",         value: editName, set: setEditName, placeholder: "Your first name"   },
            { label: "NEIGHBORHOOD", value: editNbhd, set: setEditNbhd, placeholder: "Your neighborhood" },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>{f.label}</p>
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111" }} />
            </div>
          ))}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>BIO</p>
            <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="A few words about you" rows={3}
              className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
              style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111" }} />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button onClick={handleSave} disabled={pending}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: pending ? "#F0E0E8" : PINK, color: pending ? "#C8A0B0" : "white" }}>
            {pending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function LoungePage({ user }: { user?: LoungeUser }) {
  const [localName, setLocalName] = useState(user?.name         ?? "");
  const [localNbhd, setLocalNbhd] = useState(user?.neighborhood ?? "NYC");
  const [localBio,  setLocalBio]  = useState(user?.bio          ?? "Part of the world made for women.");
  const [selectedBloomie, setSelectedBloomie] = useState<BloomieProfile | null>(null);
  const [showBloomies,    setShowBloomies]    = useState(false);
  const [showEdit,        setShowEdit]        = useState(false);
  const [copied,          setCopied]          = useState(false);
  const [toast,           setToast]           = useState<string | null>(null);
  const [clubCount,       setClubCount]       = useState<number | null>(null);
  const [gatheringCount,  setGatheringCount]  = useState<number | null>(null);
  const [ownedClub,       setOwnedClub]       = useState<{ slug: string; name: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) return;
      supabase.from("club_memberships").select("club_slug", { count: "exact", head: true })
        .eq("user_id", u.id)
        .then(({ count }) => setClubCount(count ?? 0));
      supabase.from("gathering_attendance").select("gathering_id", { count: "exact", head: true })
        .eq("user_id", u.id)
        .then(({ count }) => setGatheringCount(count ?? 0));
      supabase.from("clubs").select("slug, name").eq("owner_id", u.id).limit(1).single()
        .then(({ data }) => { if (data) setOwnedClub({ slug: (data as { slug: string; name: string }).slug, name: (data as { slug: string; name: string }).name }); });
    });
  }, []);

  const displayName    = localName || user?.name || "";
  const displayInitial = displayName[0]?.toUpperCase() ?? "✦";
  const displayHandle  = localName.split(" ")[0].toLowerCase();
  const memberNum      = getMemberNumber(localName);
  const referralCode   = getReferralCode(localName);
  const earnedFlowers  = ALL_FLOWERS.filter(f => (USER_EARNED_FLOWER_IDS as readonly string[]).includes(f.id));

  void displayInitial;

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2400); }
  function copyLink() {
    navigator.clipboard?.writeText(`https://bloombay.app/${displayHandle}`);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
    showToast("Link copied!");
  }

  const [isFoundingMother, setIsFoundingMother] = useState(false);
  const [contentTab, setContentTab] = useState<"about" | "scrapbook">("about");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) return;
      supabase.from("profiles").select("is_founding_mother").eq("id", u.id).single()
        .then(({ data }) => {
          if ((data as { is_founding_mother?: boolean } | null)?.is_founding_mother) {
            setIsFoundingMother(true);
          }
        });
    });
  }, []);

  const ROOMS = [
    { label: "Bloom Trails",   icon: "🎈", href: "/member/lounge/memories",       num: "01", accentColor: "#FF69B4" },
    { label: "Bouquet",        icon: "💐", href: "/member/lounge/bouquet",         num: "02", accentColor: PINK      },
    { label: "Bloomies",       icon: "🌸", href: "/member/lounge/bloomies",        num: "03", accentColor: "#E8006A" },
    { label: "Clubs",          icon: "🌺", href: "/member/clubs",                 num: "04", accentColor: "#C4005A" },
    ...(ownedClub ? [{ label: "My Club", icon: "👑", href: `/member/clubs/${ownedClub.slug}/manage`, num: "05", accentColor: GOLD }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>

      {/* ══════════ PROFILE PHOTO HERO ══════════ */}
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        {/* Background — richly styled like a chosen profile template */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, #2D0640 0%, #6A1045 35%, #C03060 65%, #E8608A 88%, #F8A8B8 100%)",
        }} />
        {/* Texture glow circles */}
        <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,100,160,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 20, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,200,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Avatar — large photo placeholder */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)", border: "3px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}>
            <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 58, fontWeight: 900, color: "rgba(255,255,255,0.95)" }}>
              {displayInitial}
            </span>
          </div>
        </div>

        {/* Top bar — apt label + action buttons */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "calc(env(safe-area-inset-top, 0px) + 14px) 16px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10,
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.5)" }}>✦ THE APARTMENT</p>
          <div style={{ display: "flex", gap: 7 }}>
            <Link href="/member/you?tab=style" style={{ textDecoration: "none" }}>
              <div style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "6px 12px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "white" }}>Style ✦</p>
              </div>
            </Link>
            <button onClick={() => setShowEdit(true)} style={{
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999,
              padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "white" }}>Edit</span>
            </button>
          </div>
        </div>

        {/* Founding Mother — tiny badge, upper-right corner of photo area */}
        {isFoundingMother && (
          <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 54px)", right: 16, zIndex: 10 }}>
            <div style={{ background: GOLD, borderRadius: 6, padding: "3px 8px", boxShadow: "0 2px 10px rgba(212,168,83,0.6)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: "white", letterSpacing: "0.12em", whiteSpace: "nowrap" as const }}>✦ FOUNDING</p>
            </div>
          </div>
        )}

        {/* Name + info overlay at bottom of photo */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(20,4,32,0.82) 0%, rgba(20,4,32,0.4) 60%, transparent 100%)",
          padding: "48px 20px 18px",
        }}>
          <h1 style={{
            fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900,
            fontSize: "clamp(36px, 10vw, 52px)", color: "white",
            lineHeight: 0.95, margin: 0,
          }}>{displayName.split(" ")[0] || "You"}.</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{localNbhd} · NYC</p>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>#{memberNum}</p>
          </div>
        </div>
      </div>

      {/* ══════════ ABOUT / SCRAPBOOK TOGGLE ══════════ */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(255,31,125,0.1)", display: "flex", padding: "0 20px" }}>
        {(["about", "scrapbook"] as const).map(tab => (
          <button key={tab} onClick={() => setContentTab(tab)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            padding: "14px 0 12px",
            borderBottom: contentTab === tab ? `2.5px solid ${PINK}` : "2.5px solid transparent",
            WebkitTapHighlightColor: "transparent",
          }}>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
              color: contentTab === tab ? PINK : "rgba(0,0,0,0.3)",
              textTransform: "uppercase" as const,
            }}>{tab === "about" ? "About" : "Scrapbook"}</span>
          </button>
        ))}
      </div>

      {/* ══════════ ABOUT TAB ══════════ */}
      {contentTab === "about" && (
        <div style={{ padding: "22px 20px 0" }}>
          {/* Stats row */}
          <div style={{ display: "flex", gap: 0, background: "white", borderRadius: 18, overflow: "hidden", marginBottom: 18, boxShadow: "0 2px 12px rgba(255,31,125,0.07)" }}>
            {[
              { num: gatheringCount !== null ? String(gatheringCount) : "—", label: "Events" },
              { num: clubCount !== null ? String(clubCount) : "—", label: "Clubs" },
              { num: String(ALL_BLOOMIES.length), label: "Bloomies" },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ flex: 1, textAlign: "center" as const, padding: "16px 8px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,31,125,0.08)" : "none" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 24, color: PINK, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)", marginTop: 3 }}>{s.label.toUpperCase()}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          {localBio && (
            <div style={{ background: "white", borderRadius: 18, padding: "16px 18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(255,31,125,0.06)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 8 }}>ABOUT</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#222", lineHeight: 1.6 }}>{localBio}</p>
            </div>
          )}

          {/* Interest tags */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 10 }}>VIBES</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {INTEREST_TAGS.map(t => (
                <div key={t} style={{ background: "#FFF0F5", border: "1px solid rgba(255,31,125,0.18)", borderRadius: 999, padding: "6px 14px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK }}>{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Witness entries */}
          {WITNESS_ENTRIES.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 10 }}>WHAT THEY SAY</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {WITNESS_ENTRIES.map((w, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 8px rgba(255,31,125,0.06)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: w.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 900, color: "white" }}>{w.initial}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#333", lineHeight: 1.5, fontStyle: "italic" }}>&ldquo;{w.text}&rdquo;</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb", marginTop: 4 }}>{w.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════ SCRAPBOOK TAB ══════════ */}
      {contentTab === "scrapbook" && (
        <div style={{ padding: "20px 20px 0" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 14 }}>MEMORIES</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {MEMORIES.map((m, i) => (
              <div key={i} style={{
                background: m.color, borderRadius: 16, padding: "18px 14px",
                transform: `rotate(${m.rotate})`, transformOrigin: "center",
                boxShadow: "0 3px 12px rgba(0,0,0,0.09)",
                minHeight: 100, display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 26 }}>{m.emoji}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>{m.title}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>{m.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, background: "rgba(255,31,125,0.04)", border: "1.5px dashed rgba(255,31,125,0.2)", borderRadius: 16, padding: "20px", textAlign: "center" as const }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: "rgba(255,31,125,0.5)" }}>+ add a memory</p>
          </div>
        </div>
      )}

      {/* ══════════ ROOMS ══════════ */}
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(0,0,0,0.28)" }}>✦ YOUR ROOMS</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: DARK, marginTop: 2 }}>The Apartment.</p>
          </div>
          <Link href="/member/you" style={{ textDecoration: "none" }}>
            <div style={{ background: "#FFF0F5", borderRadius: 999, padding: "6px 14px", border: "1px solid rgba(255,31,125,0.15)", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>Settings</p>
            </div>
          </Link>
        </div>

        {/* Floor */}
        <div style={{
          background: "white",
          borderRadius: 24,
          padding: "28px 12px 20px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(255,31,125,0.05)",
          border: "1px solid rgba(0,0,0,0.05)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Wall paper top strip */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 8,
            background: "repeating-linear-gradient(90deg, #FFE4EF 0px, #FFE4EF 18px, #FFF0F5 18px, #FFF0F5 36px)",
          }} />
          {/* Baseboard bottom strip */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 10,
            background: "linear-gradient(180deg, #E8D8CC 0%, #D4C0B0 100%)",
          }} />

          {/* Hallway floor */}
          <div style={{
            position: "absolute", bottom: 10, left: 0, right: 0, height: 18,
            background: "linear-gradient(180deg, #C8A888 0%, #B89878 100%)",
            opacity: 0.4,
          }} />

          {/* Doors row */}
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", gap: 4, position: "relative", zIndex: 1 }}>
            {ROOMS.map(r => (
              <ApartmentDoor key={r.href} label={r.label} icon={r.icon} href={r.href} num={r.num} accentColor={r.accentColor} />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ FLOWERS ══════════ */}
      <div style={{ padding: "28px 20px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(0,0,0,0.28)", marginBottom: 14 }}>✦ YOUR FLOWERS · {earnedFlowers.length} EARNED</p>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const, margin: "0 -20px", paddingLeft: 20, paddingRight: 20 }}>
          {ALL_FLOWERS.map(flower => {
            const earned = (USER_EARNED_FLOWER_IDS as readonly string[]).includes(flower.id);
            return (
              <div key={flower.id} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 10px", borderRadius: 14, background: earned ? flower.bg : "#F8F8F8", border: `1.5px solid ${earned ? flower.color + "44" : "#EEE"}`, opacity: earned ? 1 : 0.3, minWidth: 58 }}>
                <span style={{ fontSize: 20 }}>{flower.emoji}</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, textAlign: "center" as const, color: earned ? flower.color : "#bbb", lineHeight: 1.3, maxWidth: 50 }}>{flower.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════ PURCHASE HISTORY ══════════ */}
      <PurchaseHistorySection />

      {/* ══════════ SHARE ══════════ */}
      <div style={{ padding: "24px 20px 36px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "white", borderRadius: 20, padding: "16px 18px", boxShadow: "0 2px 12px rgba(255,31,125,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 4 }}>YOUR BLOOMBAY LINK</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>bloombay.app/{displayHandle}</p>
          </div>
          <button onClick={copyLink} style={{ flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "white", background: PINK, border: "none", cursor: "pointer", borderRadius: 999, padding: "8px 16px" }}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        <div style={{ background: DARK, borderRadius: 20, padding: "14px 18px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,31,125,0.22),transparent 70%)" }} />
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.65)", marginBottom: 4 }}>REFERRAL CODE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: "white" }}>{referralCode}</p>
          </div>
          <button onClick={() => { navigator.clipboard?.writeText(referralCode); showToast("Code copied!"); }}
            style={{ flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK, background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.25)", borderRadius: 999, padding: "8px 14px", cursor: "pointer" }}>
            Copy
          </button>
        </div>
      </div>

      {/* ══════════ TOAST ══════════ */}
      {toast && (
        <div style={{ position: "fixed", bottom: 110, left: "50%", transform: "translateX(-50%)", zIndex: 60, background: DARK, color: "white", borderRadius: 999, padding: "10px 20px", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" as const, boxShadow: "0 4px 16px rgba(0,0,0,0.25)", pointerEvents: "none" }}>
          {toast}
        </div>
      )}

      {/* ══════════ SHEETS ══════════ */}
      {selectedBloomie && <BloomieSheet bloomie={selectedBloomie} onClose={() => setSelectedBloomie(null)} />}
      {showBloomies && (
        <BloomiesListSheet
          onClose={() => setShowBloomies(false)}
          onSelect={b => { setShowBloomies(false); setTimeout(() => setSelectedBloomie(b), 100); }}
        />
      )}
      {showEdit && (
        <EditProfileSheet
          name={localName} neighborhood={localNbhd} bio={localBio}
          onClose={() => setShowEdit(false)}
          onSave={(n, nb, b) => { setLocalName(n); setLocalNbhd(nb); setLocalBio(b); }}
        />
      )}
    </div>
  );
}
