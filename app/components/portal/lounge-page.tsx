"use client";

import { useState } from "react";
import Link from "next/link";
import { updateProfile } from "@/lib/auth/actions";

// ── CONSTANTS ──────────────────────────────────────────────────────────────────

const PINK   = "#FF1F7D";
const PAPER  = "#FEFCF7";
const CREAM  = "#F6F1EB";

// ── DATA ──────────────────────────────────────────────────────────────────────

const ALL_FLOWERS = [
  { id: "host",      emoji: "🌹", label: "Host",      color: "#E63946", bg: "#FFF0F0" },
  { id: "connector", emoji: "🌸", label: "Connector", color: "#FF69B4", bg: "#FFF0F8" },
  { id: "community", emoji: "🌺", label: "Community", color: "#FF1F7D", bg: "#FFF0F5" },
  { id: "explorer",  emoji: "🌷", label: "Explorer",  color: "#E86A45", bg: "#FFF5F0" },
  { id: "culture",   emoji: "🌼", label: "Culture",   color: "#D4A853", bg: "#FDFAF0" },
  { id: "adventure", emoji: "🌻", label: "Adventure", color: "#E89A3C", bg: "#FFFBF0" },
  { id: "wisdom",    emoji: "🪷", label: "Wisdom",    color: "#C084FC", bg: "#FDF0FF" },
  { id: "founding",  emoji: "🌺", label: "Founding",  color: "#D4A853", bg: "#FDF9F0" },
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

const WITNESS_ENTRIES = [
  { initial: "A", color: "#FF1F7D", text: "She lights up the whole table when she talks about food.",  date: "Apr 2026" },
  { initial: "Z", color: "#FF69B4", text: "The most thoughtful woman I've met at a BloomBay event.",   date: "Mar 2026" },
  { initial: "N", color: "#C084FC", text: "She made everyone feel welcome that Sunday morning walk.",  date: "Mar 2026" },
  { initial: "M", color: "#FB923C", text: "Real, grounded, and completely herself — rare.",            date: "Feb 2026" },
];

const MEMORIES = [
  { emoji: "🌅", title: "Williamsburg morning", date: "May 12", color: "#FFF0F5", rotate: "-2.5deg" },
  { emoji: "🍷", title: "Rooftop wine hour",    date: "May 8",  color: "#FFE8F3", rotate:  "2deg"   },
  { emoji: "🎨", title: "Paint + sip night",    date: "Apr 30", color: "#FFF5F8", rotate: "-1.5deg" },
  { emoji: "🏃‍♀️", title: "Run club Sunday",  date: "Apr 27", color: "#FFE0EE", rotate:  "3deg"   },
  { emoji: "🧘", title: "Pilates morning",      date: "Apr 20", color: "#FFF0F5", rotate: "-2deg"   },
  { emoji: "☕", title: "Matcha café crawl",    date: "Apr 14", color: "#FFF5F8", rotate:  "1.5deg" },
];

const INTEREST_TAGS = ["Soft Life", "Art", "Wellness", "Food", "Music", "Travel"];

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
              style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111", lineHeight: 1.6 }} />
          </div>
          {error && <p className="text-xs" style={{ color: "#e53e3e" }}>{error}</p>}
          <button onClick={handleSave} disabled={pending} className="w-full py-4 rounded-2xl font-bold text-sm"
            style={{ background: pending ? "#FFB6D0" : PINK, color: "white" }}>
            {pending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── SECTION DIVIDER ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ padding: "6px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,31,125,0.14)" }} />
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: "rgba(255,31,125,0.45)" }}>{label}</p>
        <div style={{ flex: 1, height: 1, background: "rgba(255,31,125,0.14)" }} />
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export function LoungePage({ user }: { user?: LoungeUser }) {
  const [localName, setLocalName] = useState(user?.name         ?? "May");
  const [localNbhd, setLocalNbhd] = useState(user?.neighborhood ?? "NYC");
  const [localBio,  setLocalBio]  = useState(user?.bio          ?? "Part of the world made for women.");
  const [selectedBloomie, setSelectedBloomie] = useState<BloomieProfile | null>(null);
  const [showBloomies,    setShowBloomies]    = useState(false);
  const [showEdit,        setShowEdit]        = useState(false);
  const [copied,          setCopied]          = useState(false);
  const [toast,           setToast]           = useState<string | null>(null);

  const displayName    = localName;
  const displayInitial = localName[0]?.toUpperCase() ?? "M";
  const displayHandle  = localName.split(" ")[0].toLowerCase();
  const memberNum      = getMemberNumber(localName);
  const referralCode   = getReferralCode(localName);
  const earnedFlowers  = ALL_FLOWERS.filter(f => (USER_EARNED_FLOWER_IDS as readonly string[]).includes(f.id));
  const today          = new Date();
  const issueDate      = today.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2400); }
  function copyLink() {
    navigator.clipboard?.writeText(`https://bloombay.app/${displayHandle}`);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
    showToast("Link copied!");
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)", paddingBottom: 96 }}>

      {/* ── FIXED TOP BAR ─────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 54, zIndex: 51, background: PAPER, borderBottom: "1px solid rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href="/member/home" style={{ display: "flex", alignItems: "center", gap: 3, textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: PINK }}>BB</span>
          <span style={{ color: PINK, fontSize: 11, opacity: 0.6 }}>✿</span>
        </Link>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>EDITORIAL</p>
        <button onClick={copyLink} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Share profile">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      <div style={{ paddingTop: 54 }}>

        {/* ── COVER SPREAD — folder/dossier style ───────────────────────────── */}
        <div style={{ background: "#EDE4D4", padding: "0 0 0" }}>

          {/* Folder top tab */}
          <div style={{ height: 32, background: "#E0D5C0", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", paddingLeft: 20, gap: 8 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.3)" }}>{issueDate}</p>
            <div style={{ flex: 1 }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.3)", paddingRight: 20 }}>MEMBER #{memberNum}</p>
          </div>

          {/* Folder body */}
          <div style={{ padding: "24px 20px 0", background: "#EDE4D4", position: "relative" }}>

            {/* Polaroid photo clipped at top-right — avatar as polaroid */}
            <div style={{ position: "absolute", top: 16, right: 20, zIndex: 2 }}>
              {/* Paper clip SVG */}
              <svg width="18" height="36" viewBox="0 0 18 36" style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", zIndex: 3 }}>
                <path d="M9 2 C5 2 2 5 2 9 L2 28 C2 30 3.5 32 5.5 32 L12.5 32 C14.5 32 16 30 16 28 L16 11 C16 9 14.5 7 12 7 L7 7 C5.5 7 4.5 8 4.5 9.5 L4.5 26 C4.5 27 5.2 27.5 6 27.5 L12 27.5" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              {/* Polaroid */}
              <div style={{ transform: "rotate(4deg)", background: "white", padding: "8px 8px 28px", boxShadow: "0 6px 22px rgba(0,0,0,0.16)", borderRadius: 2, marginTop: 12 }}>
                <div style={{ width: 80, height: 80, background: `linear-gradient(135deg,${PINK},#FF69B4)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 32, color: "white" }}>
                  {displayInitial}
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#777", textAlign: "center" as const, marginTop: 6, lineHeight: 1.2 }}>{displayName.split(" ")[0]}</p>
              </div>
            </div>

            {/* Name section */}
            <div style={{ paddingRight: 115, marginBottom: 14 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 6 }}>YOUR EDITORIAL</p>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px,10vw,54px)", color: "#1A1A1A", lineHeight: 0.92, letterSpacing: "-0.02em", marginBottom: 8 }}>
                {displayName.split(" ")[0]}.
              </h1>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#887060", marginBottom: 10 }}>{localNbhd} · NYC</p>

              {/* Info blocks — like the reference file boxes */}
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 6, padding: "6px 10px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(0,0,0,0.4)" }}>MEMBER SINCE</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>Jan 2026</p>
                </div>
                <div style={{ background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)", borderRadius: 6, padding: "6px 10px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.12em", color: PINK }}>STATUS</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK }}>Founding</p>
                </div>
              </div>
            </div>

            {/* Founding mother chip */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: "linear-gradient(135deg,#1A1208,#2D1E08)", border: "1px solid rgba(212,168,83,0.4)", marginBottom: 18 }}>
              <span style={{ fontSize: 8, color: "#D4A853" }}>✦</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: "#D4A853" }}>FOUNDING MOTHER #{memberNum}</span>
            </div>

            {/* Pink accent bar */}
            <div style={{ height: 3, background: `linear-gradient(90deg,${PINK},rgba(255,105,180,0.35))`, borderRadius: 2, marginBottom: 0 }} />
          </div>

          {/* White section below fold */}
          <div style={{ background: PAPER, padding: "18px 20px 0" }}>

          {/* Bio pull-quote */}
          <div style={{ borderLeft: `3px solid ${PINK}`, paddingLeft: 14, marginBottom: 20 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#333", lineHeight: 1.65 }}>
              &ldquo;{localBio}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#aaa", marginTop: 4 }}>— {displayName.split(" ")[0]}</p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", background: "#FFF5F8", borderRadius: 16, overflow: "hidden", marginBottom: 22 }}>
            {[{ num: "12", label: "Events" }, { num: "3", label: "Clubs" }, { num: String(ALL_BLOOMIES.length), label: "Bloomies" }].map((s, i) => (
              <div key={s.label} style={{ flex: 1, padding: "14px 0", textAlign: "center" as const, borderRight: i < 2 ? "1px solid rgba(255,31,125,0.12)" : "none" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 26, color: PINK, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(0,0,0,0.32)", marginTop: 4 }}>{s.label.toUpperCase()}</p>
              </div>
            ))}
          </div>

          {/* Interest tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 24 }}>
            {INTEREST_TAGS.map(tag => (
              <span key={tag} style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 999, background: "#FFF0F5", color: PINK, border: `1px solid rgba(255,31,125,0.15)` }}>{tag}</span>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,31,125,0.1)" }} />
          </div>{/* end white section */}
        </div>{/* end folder */}

        {/* ── FLOWERS ───────────────────────────────────────────────────────── */}
        <SectionDivider label="RECOGNITION" />
        <div style={{ padding: "0 20px 24px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 12 }}>✦ YOUR FLOWERS · {earnedFlowers.length} EARNED</p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const, margin: "0 -20px", paddingLeft: 20, paddingRight: 20 }}>
            {ALL_FLOWERS.map(flower => {
              const earned = (USER_EARNED_FLOWER_IDS as readonly string[]).includes(flower.id);
              return (
                <div key={flower.id} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "12px 10px", borderRadius: 16, background: earned ? flower.bg : "#F8F8F8", border: `1.5px solid ${earned ? flower.color + "44" : "#EEE"}`, opacity: earned ? 1 : 0.38, minWidth: 64 }}>
                  <span style={{ fontSize: 24 }}>{flower.emoji}</span>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, textAlign: "center" as const, color: earned ? flower.color : "#bbb", lineHeight: 1.3, maxWidth: 56 }}>{flower.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── WHAT THEY SAY ─────────────────────────────────────────────────── */}
        <SectionDivider label="WHAT THEY SAY" />
        <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {WITNESS_ENTRIES.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "14px 16px", background: "white", borderRadius: 18, boxShadow: "0 2px 10px rgba(255,31,125,0.06)", borderLeft: `3px solid ${w.color}` }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${w.color},${w.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, color: "white" }}>{w.initial}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "#333", lineHeight: 1.55 }}>&ldquo;{w.text}&rdquo;</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#bbb", marginTop: 4 }}>{w.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── HER WORLD ─────────────────────────────────────────────────────── */}
        <SectionDivider label="HER WORLD" />
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>BLOOMIES · {ALL_BLOOMIES.length} FRIENDS</p>
            <button onClick={() => setShowBloomies(true)} style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, background: "none", border: "none", cursor: "pointer" }}>See all →</button>
          </div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const }}>
            {ALL_BLOOMIES.map(m => (
              <button key={m.name} onClick={() => setSelectedBloomie(m)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", background: "none", border: "none", flexShrink: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${m.color},${m.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white", boxShadow: `0 4px 12px ${m.color}33` }}>{m.initial}</div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#aaa" }}>{m.name.split(" ")[0]}</p>
              </button>
            ))}
            <Link href="/member/match" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", border: `1.5px dashed rgba(255,31,125,0.3)`, background: "rgba(255,31,125,0.04)", display: "flex", alignItems: "center", justifyContent: "center", color: PINK, fontSize: 22 }}>+</div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#ccc" }}>Invite</p>
            </Link>
          </div>
        </div>

        {/* ── MOMENTS ───────────────────────────────────────────────────────── */}
        <SectionDivider label="MOMENTS" />
        <div style={{ padding: "0 0 24px" }}>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 20px 12px", scrollbarWidth: "none" as const }}>
            {MEMORIES.map((m, i) => (
              <div key={i} style={{ flexShrink: 0, transform: `rotate(${m.rotate})`, transformOrigin: "center top" }}>
                <div style={{ padding: "10px 10px 32px", background: m.color, borderRadius: 4, width: 132, boxShadow: "0 6px 24px rgba(0,0,0,0.12)" }}>
                  <div style={{ width: "100%", height: 100, background: `${m.color}88`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 44, opacity: 0.75 }}>{m.emoji}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#555", textAlign: "center" as const, lineHeight: 1.35, marginTop: 8 }}>{m.title}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#bbb", textAlign: "center" as const, marginTop: 3 }}>{m.date}</p>
                </div>
              </div>
            ))}
            <div style={{ flexShrink: 0, transform: "rotate(1deg)" }}>
              <button onClick={() => showToast("Memory feature coming soon ✦")}
                style={{ padding: "10px 10px 32px", background: "rgba(255,31,125,0.04)", border: "1.5px dashed rgba(255,31,125,0.2)", borderRadius: 4, width: 132, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "100%", height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 32, color: PINK, opacity: 0.35 }}>+</span>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,31,125,0.4)", marginTop: 8 }}>Add a memory</p>
              </button>
            </div>
          </div>
        </div>

        {/* ── SHARE / REFERRAL ──────────────────────────────────────────────── */}
        <SectionDivider label="YOUR LINK" />
        <div style={{ padding: "0 20px 36px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "white", borderRadius: 20, padding: "16px 18px", boxShadow: "0 2px 12px rgba(255,31,125,0.07)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 8 }}>YOUR BLOOMBAY LINK</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFF5F8", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>bloombay.app/{displayHandle}</p>
              <button onClick={copyLink} style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "white", background: PINK, border: "none", cursor: "pointer", borderRadius: 999, padding: "4px 12px" }}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { navigator.clipboard?.writeText(`https://bloombay.app/${displayHandle}`); showToast("Link copied!"); }}
                style={{ flex: 1, padding: "11px 0", borderRadius: 999, border: `2px solid ${PINK}`, background: "transparent", color: PINK, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                Share
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(`https://bloombay.app/${displayHandle}`); showToast("Invite link copied!"); }}
                style={{ flex: 1, padding: "11px 0", borderRadius: 999, border: "none", background: PINK, color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                Invite Girls
              </button>
            </div>
          </div>

          <div style={{ background: "#1A1A1A", borderRadius: 20, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,31,125,0.25),transparent 70%)" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.65)", marginBottom: 6 }}>REFERRAL CODE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white" }}>{referralCode}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Invite women you actually know.</p>
          </div>
        </div>
      </div>

      {/* ── FLOATING EDIT BUTTON ──────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 88, right: 20, zIndex: 40 }}>
        <button onClick={() => setShowEdit(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px 10px 14px", borderRadius: 999, background: PINK, color: "white", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,31,125,0.45)", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
      </div>

      {/* ── TOAST ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 110, left: "50%", transform: "translateX(-50%)", zIndex: 60, background: "#1A1A1A", color: "white", borderRadius: 999, padding: "10px 20px", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" as const, boxShadow: "0 4px 16px rgba(0,0,0,0.25)", pointerEvents: "none" }}>
          {toast}
        </div>
      )}

      {/* ── SHEETS ────────────────────────────────────────────────────────── */}
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
