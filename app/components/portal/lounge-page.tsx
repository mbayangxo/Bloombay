"use client";

import "@/app/styles/bloom-entrance.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { startConversation } from "@/lib/actions/direct-messages";
import { FriendshipHealthSection } from "./friendship-health-section";
import { SocialProofSection } from "./social-proof-section";
import { MyPortalsCard } from "@/app/components/portal/my-portals-card";
import { portalLinksForAccount } from "@/lib/auth/portal-access";
import type { UserRole } from "@/lib/auth/roles";
import { normalizeRole } from "@/lib/auth/roles";

// ── CONSTANTS ──────────────────────────────────────────────────────────────────

const PINK   = "#FF1F7D";

const DARK   = "#1C1B1C";
const PAPER  = "#FEFCF7";

const PROFILE_TEMPLATES = [
  { id: "bloom",    name: "Bloom",     gradient: "linear-gradient(160deg, #3A0020 0%, #6A0035 35%, #C03060 65%, #E8608A 88%, #F8A8B8 100%)" },
  { id: "midnight", name: "Midnight",  gradient: "linear-gradient(160deg, #0A0008 0%, #1A0015 40%, #2A0020 70%, #4A0035 100%)" },
  { id: "sakura",   name: "Sakura",    gradient: "linear-gradient(160deg, #4A0030 0%, #8B1455 35%, #D4406A 60%, #F28090 85%, #FFB8C8 100%)" },
  { id: "noir",     name: "Noir",      gradient: "linear-gradient(160deg, #0A0A0A 0%, #1A1010 40%, #2D1520 70%, #3A1A25 100%)" },
  { id: "rose",     name: "Rose Gold", gradient: "linear-gradient(160deg, #1A0010 0%, #5A1830 35%, #A83860 60%, #C4005A 85%, #FF5FA5 100%)" },
];

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

const USER_EARNED_FLOWER_IDS: FlowerId[] = [];

const BLOOMIE_FLOWER_IDS: Record<string, FlowerId[]> = {};


const BLOOMIE_COLORS = ["#FF1F7D", "#FF69B4", "#C084FC", "#E07040", "#5070C8"];

function colorForBloomieId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % BLOOMIE_COLORS.length;
  return BLOOMIE_COLORS[h]!;
}

function mapBloomie(m: { id: string; first_name: string | null; full_name: string | null; neighborhood: string | null }): BloomieProfile {
  const name = m.full_name?.trim() || m.first_name?.trim() || "Bloomie";
  return {
    id: m.id,
    name,
    neighborhood: m.neighborhood?.trim() || "NYC",
    color: colorForBloomieId(m.id),
    initial: (name[0] ?? "?").toUpperCase(),
    since: "Your bouquet",
  };
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface LoungeUser { id?: string; name: string; initial: string; neighborhood: string; bio?: string; avatarUrl?: string; }
interface BloomieProfile { id: string; name: string; neighborhood: string; color: string; initial: string; since: string; }

// ── APARTMENT DOOR ────────────────────────────────────────────────────────────

function ApartmentDoor({ label, icon, href, num, accentColor = PINK }: {
  label: string; icon: string; href: string; num: string; accentColor?: string;
}) {
  const doorWood = "#FFF0F5";
  const doorPanel = "#FFFFFF";
  const frameColor = "#FF1F7D";

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

          {/* Number plate */}
          <rect x="19" y="14" width="20" height="12" rx="2" fill="#FF1F7D" opacity="0.9"/>
          <text x="29" y="23" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fontWeight="bold" fill="white">{num}</text>

          {/* Door knob */}
          <circle cx="44" cy="44" r="4.5" fill="#C4005A" opacity="0.9"/>
          <circle cx="44" cy="44" r="3" fill="url(#knobGrad)"/>
          <circle cx="43" cy="43" r="1.2" fill="rgba(255,255,255,0.5)"/>

          <defs>
            <radialGradient id="knobGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FF5FA5"/>
              <stop offset="100%" stopColor="#8A003A"/>
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
  const router = useRouter();
  const [messaging, setMessaging] = useState(false);

  async function handleMessage() {
    if (messaging) return;
    setMessaging(true);
    try {
      await startConversation(bloomie.id);
      onClose();
      router.push("/member/chat");
    } catch {
      setMessaging(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl overflow-hidden" style={{ background: PAPER, boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "85vh", overflowY: "auto" }}>
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
        <div className="px-6 pb-8">
          <button onClick={() => void handleMessage()} disabled={messaging} className="block w-full py-3.5 rounded-2xl text-center text-sm font-bold disabled:opacity-60"
            style={{ background: PINK, color: "white", border: "none" }}>
            {messaging ? "Opening…" : `Message ${bloomie.name.split(" ")[0]} →`}
          </button>
        </div>
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

function BloomiesListSheet({ bloomies, onClose, onSelect }: { bloomies: BloomieProfile[]; onClose: () => void; onSelect: (b: BloomieProfile) => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl overflow-hidden" style={{ background: PAPER, maxHeight: "80vh", overflowY: "auto" }}>
        <div className="flex justify-center pt-3 pb-2"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} /></div>
        <div className="px-6 pb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: PINK }}>YOUR BLOOMIES</p>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{bloomies.length} friends</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        {bloomies.length === 0 ? (
          <div className="px-6 pb-8 text-center">
            <p className="text-sm" style={{ color: "#bbb" }}>No Bloomies yet. Add friends from your connections and they&apos;ll show up here.</p>
          </div>
        ) : (
          <div className="px-6 pb-8 flex flex-col gap-2.5">
            {bloomies.map(m => (
              <button key={m.id} onClick={() => { onClose(); setTimeout(() => onSelect(m), 100); }}
                className="rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform w-full"
                style={{ background: "white", boxShadow: "0 2px 10px rgba(255,31,125,0.07)", borderLeft: `3px solid ${m.color}` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${m.color},${m.color}AA)` }}>{m.initial}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "#111" }}>{m.name}</p>
                  <p className="text-xs mt-0.5 text-gray-400">{m.neighborhood}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── EDIT PROFILE — inline collapsible panel, not a full-screen sheet ─────────

function EditProfilePanel({ open, name, neighborhood, bio, onClose, onSave }: {
  open: boolean; name: string; neighborhood: string; bio: string;
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

  if (!open) return null;

  return (
    <div style={{ background: "white", borderRadius: 18, padding: "18px 18px 20px", margin: "10px 16px 0", boxShadow: "0 2px 16px rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.1)" }}>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: PINK }}>EDIT PROFILE</p>
      <p className="text-base font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Your details.</p>
      <div className="flex flex-col gap-4">
        {[
          { label: "NAME",         value: editName, set: setEditName, placeholder: "Your first name"   },
          { label: "NEIGHBORHOOD", value: editNbhd, set: setEditNbhd, placeholder: "Your neighborhood" },
        ].map(f => (
          <div key={f.label}>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>{f.label}</p>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: "#FDFAF5", border: "1.5px solid #F0E0E8", color: "#111" }} />
          </div>
        ))}
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>BIO</p>
          <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="A few words about you" rows={3}
            className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
            style={{ background: "#FDFAF5", border: "1.5px solid #F0E0E8", color: "#111" }} />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button onClick={onClose}
            className="py-3.5 px-5 rounded-2xl font-bold text-sm"
            style={{ background: "rgba(0,0,0,0.05)", color: "#666" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={pending}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: pending ? "#F0E0E8" : PINK, color: pending ? "#C8A0B0" : "white" }}>
            {pending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TEMPLATE PICKER SHEET ─────────────────────────────────────────────────────

function TemplatePickerSheet({ current, displayName, onSelect, onClose }: {
  current: string;
  displayName: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const firstName = displayName.split(" ")[0] || "You";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#06000E", overflowY: "auto" }}>
      {/* Header */}
      <div style={{
        padding: "calc(env(safe-area-inset-top,0px) + 16px) 20px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,31,125,0.7)", marginBottom: 3 }}>✦ PROFILE TEMPLATES</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white", lineHeight: 1 }}>Choose your look.</p>
        </div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
        </button>
      </div>

      {/* Template cards — 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "20px 16px 8px" }}>
        {PROFILE_TEMPLATES.map(t => {
          const isActive = current === t.id;
          return (
            <button key={t.id} onClick={() => { onSelect(t.id); onClose(); }}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 0, textAlign: "left" as const }}>
              {/* Full profile mini-preview */}
              <div style={{
                borderRadius: 20, overflow: "hidden",
                border: isActive ? `3px solid ${PINK}` : "3px solid rgba(255,255,255,0.08)",
                boxShadow: isActive ? `0 0 0 3px ${PINK}44, 0 12px 32px rgba(255,31,125,0.3)` : "0 6px 24px rgba(0,0,0,0.5)",
                position: "relative" as const,
              }}>
                {/* Hero area */}
                <div style={{ height: 140, background: t.gradient, position: "relative" as const, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "flex-end", padding: "0 0 12px" }}>
                  {/* Glow circle */}
                  <div style={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,100,160,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />
                  {/* Avatar ring */}
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}>
                    <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.9)" }}>{firstName[0]?.toUpperCase()}</span>
                  </div>
                  {/* Name overlay */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(20,4,32,0.75) 0%, transparent 100%)", padding: "24px 10px 8px" }}>
                    <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: 14, color: "white", lineHeight: 1, textAlign: "center" as const }}>{firstName}.</p>
                  </div>
                  {/* Selected check */}
                  {isActive && (
                    <div style={{ position: "absolute" as const, top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(255,31,125,0.5)" }}>
                      <svg width="9" height="9" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 4 7 9 1"/></svg>
                    </div>
                  )}
                </div>
                {/* Tab bar preview */}
                <div style={{ background: "white", padding: "8px 10px 9px", display: "flex", gap: 8 }}>
                  {["About","Vibe","Code"].map((tab, i) => (
                    <div key={tab} style={{ flex: 1, textAlign: "center" as const, paddingBottom: 3, borderBottom: i === 0 ? `2px solid ${PINK}` : "2px solid transparent" }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: i === 0 ? PINK : "#ccc" }}>{tab}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: isActive ? PINK : "rgba(255,255,255,0.5)", marginTop: 8, textAlign: "center" as const }}>{t.name}{isActive ? " ✦" : ""}</p>
            </button>
          );
        })}
      </div>

      {/* A real photo (not a background swap) is set from the camera button
          on your Apartment hero — these are just the gradient looks. */}
      <div style={{ padding: "4px 16px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" as const, lineHeight: 1.6 }}>
          Want your own photo instead of a gradient? Tap the camera icon on your Apartment page.
        </p>
        <div style={{ height: "calc(env(safe-area-inset-bottom,0px) + 20px)" }} />
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function ApartmentPage({ user }: { user?: LoungeUser }) {
  const [localName, setLocalName] = useState(user?.name         ?? "");
  const [localNbhd, setLocalNbhd] = useState(user?.neighborhood ?? "NYC");
  const [localBio,  setLocalBio]  = useState(user?.bio          ?? "Part of the world made for women.");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl    ?? null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedBloomie, setSelectedBloomie] = useState<BloomieProfile | null>(null);
  const [showBloomies,    setShowBloomies]    = useState(false);
  const [showEdit,        setShowEdit]        = useState(false);
  const [copied,          setCopied]          = useState(false);
  const [toast,           setToast]           = useState<string | null>(null);
  const [clubCount,       setClubCount]       = useState<number | null>(null);
  const [gatheringCount,  setGatheringCount]  = useState<number | null>(null);
  const [ownedClub,       setOwnedClub]       = useState<{ slug: string; name: string } | null>(null);
  const [currentUserId,   setCurrentUserId]   = useState<string | null>(null);
  const [bloomies,        setBloomies]        = useState<BloomieProfile[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) return;
      setCurrentUserId(u.id);
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

  useEffect(() => {
    fetch("/api/member/bouquet")
      .then(r => (r.ok ? r.json() : { members: [] }))
      .then((data: { members?: Array<{ id: string; first_name: string | null; full_name: string | null; neighborhood: string | null }> }) => {
        setBloomies((data.members ?? []).map(mapBloomie));
      })
      .catch(() => setBloomies([]));
  }, []);

  const displayName    = localName || user?.name || "";
  const displayInitial = displayName[0]?.toUpperCase() ?? "✦";
  const displayHandle  = localName.split(" ")[0].toLowerCase();
  const earnedFlowers  = ALL_FLOWERS.filter(f => (USER_EARNED_FLOWER_IDS as readonly string[]).includes(f.id));

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2400); }
  function copyLink() {
    navigator.clipboard?.writeText(`https://bloombay.app/${displayHandle}`);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
    showToast("Link copied!");
  }

  const [isFoundingMother, setIsFoundingMother] = useState(false);
  const [memberRole, setMemberRole] = useState<UserRole>("member");
  const [hasHosted, setHasHosted] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [contentTab, setContentTab] = useState<"about" | "vibes" | "bloom_code">("about");
  const [templateId, setTemplateId] = useState<string>("bloom");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [photoCount, setPhotoCount] = useState<number | null>(null);

  // Real, persisted style choice — this used to only ever write to
  // localStorage, so it silently reset on any other device/session.
  useEffect(() => {
    if (!currentUserId) return;
    const supabase = createClient();
    supabase.from("profiles").select("profile_template_id").eq("id", currentUserId).single()
      .then(
        ({ data }) => {
          const saved = (data as { profile_template_id?: string } | null)?.profile_template_id;
          if (saved) setTemplateId(saved);
        },
        () => { /* column may not be migrated yet — falls back to default */ }
      );
    supabase.from("profile_photos").select("id", { count: "exact", head: true }).eq("user_id", currentUserId)
      .then(
        ({ count }) => setPhotoCount(count ?? 0),
        () => setPhotoCount(0)
      );
  }, [currentUserId]);

  async function handleTemplateSelect(id: string) {
    setTemplateId(id);
    if (!currentUserId) return;
    const supabase = createClient();
    await supabase.from("profiles").update({ profile_template_id: id }).eq("id", currentUserId).then(
      () => {},
      () => { /* column may not be migrated yet — selection still applies for this session */ }
    );
  }

  async function handleAvatarFile(file: File) {
    if (!currentUserId) return;
    setUploadingPhoto(true);
    try {
      const { uploadAvatar } = await import("@/lib/storage/upload");
      const url = await uploadAvatar(file, currentUserId);
      setAvatarUrl(url);
    } catch {
      showToast("Couldn't upload that photo — try again.");
    }
    setUploadingPhoto(false);
  }

  const currentTemplate = PROFILE_TEMPLATES.find(t => t.id === templateId) ?? PROFILE_TEMPLATES[0];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) return;
      supabase.from("profiles").select("is_founding_mother, role, is_host").eq("id", u.id).single()
        .then(({ data }) => {
          const row = data as { is_founding_mother?: boolean; role?: string; is_host?: boolean } | null;
          if (row?.is_founding_mother) setIsFoundingMother(true);
          if (row?.role) setMemberRole(normalizeRole(row.role));
          if (row?.is_host) setIsHost(true);
        });
      supabase.from("gatherings").select("id", { count: "exact", head: true }).eq("host_id", u.id)
        .then(({ count }) => {
          const n = count ?? 0;
          setHasHosted(n > 0);
          if (n > 0) setIsHost(true);
        });
    });
  }, []);

  const ROOMS = [
    { label: "Bloom Trails",   icon: "🎈", href: "/member/lounge/memories",       num: "01", accentColor: "#FF69B4" },
    { label: "Bouquet",        icon: "💐", href: "/member/lounge/bouquet",         num: "02", accentColor: PINK      },
    { label: "Bloomies",       icon: "🌸", href: "/member/lounge/bloomies",        num: "03", accentColor: "#E8006A" },
    { label: "Clubs",          icon: "🌺", href: "/member/clubs",                 num: "04", accentColor: "#C4005A" },
    ...(ownedClub ? [{ label: "My Club", icon: "👑", href: `/member/clubs/${ownedClub.slug}/manage`, num: "05", accentColor: PINK }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingTop: "calc(env(safe-area-inset-top, 0px) + 54px)", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>

      {/* ══════════ PROFILE PHOTO HERO ══════════ */}
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        {/* Background — a real photo once you have one, otherwise the
            chosen template gradient (no more fake localStorage-only photo) */}
        <div style={{
          position: "absolute", inset: 0,
          ...(avatarUrl
            ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: currentTemplate.gradient }
          ),
        }} />
        {/* Texture glow circles */}
        <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,100,160,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 20, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,200,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Initial placeholder — only when there's genuinely no photo, so it
            never sits on top of one */}
        {!avatarUrl && (
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
        )}

        {/* Real photo upload — the only "add a photo" control on this hero */}
        <label style={{
          position: "absolute", bottom: 66, right: 18, zIndex: 11,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(20,4,20,0.55)", backdropFilter: "blur(6px)",
          border: "1.5px solid rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: uploadingPhoto ? "wait" : "pointer",
        }}>
          {uploadingPhoto ? (
            <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          )}
          <input
            type="file" accept="image/*" disabled={uploadingPhoto}
            style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) void handleAvatarFile(f); e.target.value = ""; }}
          />
        </label>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Apt label only — edit/template actions live below the hero so portal top icons never cover them */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "14px 16px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10,
          pointerEvents: "none",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.5)" }}>✦ THE APARTMENT</p>
          {isFoundingMother && (
            <div style={{ background: PINK, borderRadius: 6, padding: "3px 8px", boxShadow: "0 2px 10px rgba(255,31,125,0.5)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: "white", letterSpacing: "0.12em", whiteSpace: "nowrap" as const }}>✦ FOUNDING</p>
            </div>
          )}
        </div>

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
          </div>
        </div>
      </div>

      {/* Edit + Templates — below hero, clear of fixed portal top icons */}
      <div style={{
        display: "flex", gap: 8, padding: "12px 16px 4px",
        background: PAPER,
      }}>
        <button
          type="button"
          onClick={() => setShowTemplatePicker(true)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px 14px", borderRadius: 14, cursor: "pointer",
            background: "white", border: "1.5px solid rgba(255,31,125,0.18)",
            boxShadow: "0 2px 10px rgba(255,31,125,0.06)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "#1C1B1C" }}>TEMPLATES</span>
        </button>
        <button
          type="button"
          onClick={() => setShowEdit(v => !v)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px 14px", borderRadius: 14, cursor: "pointer",
            background: showEdit ? "rgba(255,31,125,0.1)" : PINK,
            border: showEdit ? `1.5px solid ${PINK}` : "none",
            boxShadow: showEdit ? "none" : "0 4px 14px rgba(255,31,125,0.28)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={showEdit ? PINK : "white"} strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: showEdit ? PINK : "white" }}>{showEdit ? "CLOSE" : "EDIT PROFILE"}</span>
        </button>
      </div>

      <EditProfilePanel
        open={showEdit}
        name={localName} neighborhood={localNbhd} bio={localBio}
        onClose={() => setShowEdit(false)}
        onSave={(n, nb, b) => { setLocalName(n); setLocalNbhd(nb); setLocalBio(b); }}
      />

      {/* Work portals linked to this personal account */}
      <div style={{ padding: "12px 16px 0", background: PAPER }}>
        <MyPortalsCard
          links={portalLinksForAccount({
            role: memberRole,
            ownsClub: !!ownedClub,
            hasHosted,
            isHost,
          })}
        />
      </div>

      {/* ══════════ FLOWERS — small chips under hero ══════════ */}
      {earnedFlowers.length > 0 && (
        <div style={{ background: PAPER, padding: "10px 20px 0" }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" as const, paddingBottom: 2 }}>
            {earnedFlowers.map(flower => (
              <div key={flower.id} style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
                background: flower.bg, border: `1px solid ${flower.color}33`,
                borderRadius: 999, padding: "4px 9px",
              }}>
                <span style={{ fontSize: 11 }}>{flower.emoji}</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: flower.color, whiteSpace: "nowrap" as const }}>{flower.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ TABS ══════════ */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(255,31,125,0.1)", display: "flex", padding: "0 20px" }}>
        {(["about", "vibes", "bloom_code"] as const).map(tab => (
          <button key={tab} onClick={() => setContentTab(tab)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            padding: "14px 0 12px",
            borderBottom: contentTab === tab ? `2.5px solid ${PINK}` : "2.5px solid transparent",
            WebkitTapHighlightColor: "transparent",
          }}>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.10em",
              color: contentTab === tab ? PINK : "rgba(0,0,0,0.3)",
              textTransform: "uppercase" as const,
            }}>{tab === "about" ? "About" : tab === "vibes" ? "Your Vibe" : "Bloom Code"}</span>
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
              { num: String(bloomies.length), label: "Bloomies" },
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

          {/* Social proof — real witness/flower activity */}
          {currentUserId && <SocialProofSection userId={currentUserId} />}
        </div>
      )}

      {/* ══════════ YOUR VIBE TAB ══════════ */}
      {contentTab === "vibes" && (
        <div style={{ padding: "20px 20px 0" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 10 }}>VIBES</p>
          <div style={{
            background: "rgba(255,31,125,0.04)", border: "1px dashed rgba(255,31,125,0.2)",
            borderRadius: 16, padding: "20px 16px", marginBottom: 22, textAlign: "center",
          }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#888", marginBottom: 4 }}>No vibes set yet</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#bbb" }}>Interest tags will show here when profile vibes ship.</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)" }}>YOUR PHOTOS{photoCount !== null && photoCount > 0 ? ` · ${photoCount}` : ""}</p>
            <Link href="/member/you" style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, textDecoration: "none" }}>manage →</Link>
          </div>
          {photoCount !== null && photoCount > 0 ? (
            <div style={{ background: "rgba(255,31,125,0.04)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 16, padding: "18px 16px", marginBottom: 22, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#666" }}>{photoCount} photo{photoCount === 1 ? "" : "s"} on your profile</p>
              <Link href="/member/you" style={{ display: "inline-block", marginTop: 8, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, textDecoration: "none" }}>View your gallery →</Link>
            </div>
          ) : (
            <div style={{
              background: "rgba(255,31,125,0.04)", border: "1px dashed rgba(255,31,125,0.2)",
              borderRadius: 16, padding: "28px 16px", marginBottom: 22, textAlign: "center",
            }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#888" }}>No photos yet</p>
              <Link href="/member/you" style={{ display: "inline-block", marginTop: 6, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, textDecoration: "none" }}>Add photos on your Profile →</Link>
            </div>
          )}
        </div>
      )}

      {/* ══════════ BLOOM CODE TAB ══════════ */}
      {contentTab === "bloom_code" && (
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", marginBottom: 24 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 14 }}>YOUR QR CODE</p>
            <div style={{ width: 180, height: 180, borderRadius: 20, background: "white", boxShadow: "0 4px 20px rgba(255,31,125,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid white", overflow: "hidden" }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=174x174&color=1A0010&bgcolor=FFFFFF&data=https://bloombay.app/${displayHandle}&qzone=2`}
                alt="Your QR Code"
                width={174} height={174}
                style={{ borderRadius: 14 }}
              />
            </div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.4)", marginTop: 10 }}>Scan to find me on BloomBay</p>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 12px rgba(255,31,125,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 4 }}>YOUR BLOOM LINK</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>bloombay.app/{displayHandle}</p>
            </div>
            <button onClick={copyLink} style={{ flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "white", background: PINK, border: "none", cursor: "pointer", borderRadius: 999, padding: "8px 16px" }}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <div style={{ background: DARK, borderRadius: 20, padding: "16px 18px", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute" as const, top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,31,125,0.22),transparent 70%)" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.65)", marginBottom: 6 }}>GIRL CODE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,0.55)" }}>
              Your invite code isn’t available yet.
            </p>
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

      {/* ══════════ BLOOM PASSPORT ══════════ */}
      <div style={{ padding: "20px 20px 0" }}>
        <Link href="/member/passport" style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            borderRadius: 22,
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(145deg, #0A0008 0%, #1E0028 35%, #3A0048 65%, #5C0060 85%, #7B0070 100%)",
            boxShadow: "0 12px 40px rgba(120,0,100,0.35), 0 4px 16px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,80,200,0.18)",
          }}>
            {/* Shimmer top stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #FF1F7D 30%, #FF80D0 55%, #FF1F7D 75%, transparent)", pointerEvents: "none" }}/>
            {/* Glow orb */}
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.25) 0%, transparent 70%)", pointerEvents: "none" }}/>
            {/* Bloom watermark */}
            <div style={{ position: "absolute", right: 12, bottom: -6, width: 72, height: 72, opacity: 0.08, pointerEvents: "none" }}>
              <svg viewBox="0 0 100 100" fill="white"><ellipse cx="50" cy="20" rx="10" ry="22"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(60 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(120 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(180 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(240 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(300 50 50)"/><circle cx="50" cy="50" r="11"/></svg>
            </div>

            <div style={{ padding: "20px 20px 18px", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,140,220,0.65)", marginBottom: 4 }}>✦ BLOOM PASSPORT</p>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 24, color: "white", lineHeight: 1, margin: 0 }}>Your world,</p>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 24, color: "#FF80D0", lineHeight: 1.1, margin: 0 }}>documented.</p>
                </div>
                {/* Mini passport icon */}
                <div style={{
                  width: 52, height: 68, borderRadius: 7,
                  background: "linear-gradient(160deg,#6B001A,#C4005A)",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0,
                }}>
                  <div style={{ width: 22, height: 22, opacity: 0.85 }}>
                    <svg viewBox="0 0 100 100" fill="white"><ellipse cx="50" cy="20" rx="10" ry="22"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(60 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(120 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(180 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(240 50 50)"/><ellipse cx="50" cy="20" rx="10" ry="22" transform="rotate(300 50 50)"/><circle cx="50" cy="50" r="11"/></svg>
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 5, fontWeight: 900, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em" }}>BLOOM</p>
                </div>
              </div>

              <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,31,125,0.22)", borderRadius: 999, padding: "6px 14px", border: "1px solid rgba(255,31,125,0.35)" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "#FF80D0" }}>Open Passport</p>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF80D0" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ══════════ PROFILE TEMPLATES ══════════ */}
      <div style={{ padding: "16px 0 0" }}>
        <div style={{ padding: "0 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>✦ PROFILE LOOK</p>
          <button onClick={() => setShowTemplatePicker(true)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: "0.04em" }}>see all →</button>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" as const, paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
          {PROFILE_TEMPLATES.map(t => {
            const isActive = templateId === t.id;
            return (
              <button key={t.id} onClick={() => handleTemplateSelect(t.id)}
                style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 52, height: 74, borderRadius: 12, overflow: "hidden",
                  background: t.gradient,
                  border: isActive ? `2.5px solid ${PINK}` : "2.5px solid rgba(0,0,0,0.08)",
                  boxShadow: isActive ? `0 0 0 2px ${PINK}44, 0 4px 14px rgba(255,31,125,0.3)` : "0 2px 10px rgba(0,0,0,0.1)",
                  position: "relative" as const,
                  display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6,
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.9)" }}>
                      {displayName[0]?.toUpperCase() ?? "Y"}
                    </span>
                  </div>
                  {isActive && (
                    <div style={{ position: "absolute" as const, top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="7" height="7" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 4 7 9 1"/></svg>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: isActive ? 800 : 600, color: isActive ? PINK : "rgba(0,0,0,0.4)", letterSpacing: "0.04em" }}>{t.name}</p>
              </button>
            );
          })}
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

      {/* ══════════ FRIENDSHIP PULSE ══════════ */}
      <FriendshipHealthSection />

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
          bloomies={bloomies}
          onClose={() => setShowBloomies(false)}
          onSelect={b => { setShowBloomies(false); setTimeout(() => setSelectedBloomie(b), 100); }}
        />
      )}
      {showTemplatePicker && (
        <TemplatePickerSheet
          current={templateId}
          displayName={displayName}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </div>
  );
}

// ── LOUNGE CHAT PAGE ──────────────────────────────────────────────────────────

export function LoungePage({ user }: { user?: LoungeUser }) {
  void user;
  const PINK_C = "#FF1F7D";

  return (
    <div className="bloom-world-enter" style={{ minHeight: "100vh", background: "#FF1F7D", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)", overflowX: "hidden" }}>
      {/* ── Header ── */}
      <div style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)", padding: "calc(env(safe-area-inset-top, 0px) + 64px) 22px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>THE LOUNGE</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(26px, 9vw, 36px)", color: "white", lineHeight: 1, margin: 0, marginBottom: 24 }}>Chats.</h1>
      </div>

      {/* ── Honest empty state ── */}
      <div style={{ padding: "0 22px" }}>
        <div style={{ background: "white", borderRadius: 22, padding: "32px 24px", textAlign: "center" as const, boxShadow: "0 16px 48px rgba(0,0,0,0.22), 0 4px 0 rgba(0,0,0,0.08)" }}>
          <p style={{ fontSize: 32 }}>✉️</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "#111", marginTop: 10, marginBottom: 8 }}>No messages yet</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", lineHeight: 1.6 }}>
            When you join clubs, RSVP to happenings, or connect with a Bloomie, your real conversations will show here.
          </p>
          <Link href="/member/clubs" style={{ display: "inline-block", marginTop: 16, padding: "10px 20px", borderRadius: 999, background: PINK_C, color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
            Browse clubs →
          </Link>
        </div>
      </div>
    </div>
  );
}
