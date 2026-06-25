"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PostEventBloomiePrompt } from "./post-event-bloomie-prompt";
import { GirlMatePage } from "./girlmate-page";
import "@/app/styles/bloom-entrance.css";

// ── Real data types ───────────────────────────────────────────────────────────

interface RealIntro {
  id: string;
  bio: string;
  arrival_status: string;
  neighborhood: string | null;
  interests: string[];
  flower_count: number;
  created_at: string;
  user_id: string;
  profiles: { first_name: string | null; full_name: string | null; avatar_url: string | null };
}

interface RealComeWith {
  id: string;
  post: string;
  activity: string;
  when_text: string | null;
  emoji: string;
  spots_left: number;
  created_at: string;
  user_id: string;
  profiles: { first_name: string | null; full_name: string | null; avatar_url: string | null; neighborhood: string | null };
}

// ── Real bloom request type ────────────────────────────────────────────────────

interface RealBloomRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  context: string | null;
  note: string | null;
  compatibility_score: number | null;
  created_at: string;
  data: { template?: string } | null;
  sender: { id: string; first_name: string | null; full_name: string | null; avatar_url: string | null; neighborhood: string | null } | null;
  recipient: { id: string; first_name: string | null; full_name: string | null; avatar_url: string | null; neighborhood: string | null } | null;
}

function reqDisplayName(profile: RealBloomRequest["sender"]): string {
  return profile?.first_name || profile?.full_name?.split(" ")[0] || "Her";
}

function reqInitial(profile: RealBloomRequest["sender"]): string {
  return reqDisplayName(profile).charAt(0).toUpperCase();
}

interface OrbitProfile {
  id: number;
  initial: string;
  name: string;
  neighborhood: string;
  color: string;
  clubs: string[];
  vibe: string;
  yandeNote: string;
}

interface ComeWithPost {
  id: number;
  initial: string;
  name: string;
  neighborhood: string;
  color: string;
  emoji: string;
  activity: string;
  post: string;
  when: string;
  timeAgo: string;
}

interface ClusterProfile {
  id: number;
  initial: string;
  name: string;
  neighborhood: string;
  color: string;
  vibe: string;
}

interface InterestCluster {
  id: number;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  count: number;
  desc: string;
  avatars: { initial: string; color: string }[];
  profiles: ClusterProfile[];
}

interface NewInTownProfile {
  id: number;
  initial: string;
  name: string;
  color: string;
  status: string;
  since: string;
  neighborhood: string;
  note: string;
  clubs: string[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProfileAvatar({ initial, color, size = 44 }: { initial: string; color: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        fontSize: size / 2.6, boxShadow: `0 3px 10px ${color}44` }}>
      {initial}
    </div>
  );
}

function SectionHeader({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="mb-4">
      <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ {eyebrow}</p>
      <p className="font-black italic text-lg leading-tight mt-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{title}</p>
      {note && <p className="text-xs italic mt-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#aaa" }}>{note}</p>}
    </div>
  );
}

// ── Bloom Request — Sealed Envelope (list) ───────────────────────────────────

function BloomRequestEnvelope({ req, isIncoming, accepted, onOpen }: {
  req: RealBloomRequest; isIncoming: boolean; accepted: boolean; onOpen: () => void;
}) {
  const profile = isIncoming ? req.sender : req.recipient;
  const name = reqDisplayName(profile);
  const initial = reqInitial(profile);
  const neighborhood = profile?.neighborhood;
  const template = req.data?.template ?? "classic";

  if (accepted) {
    return (
      <div className="rounded-2xl px-5 py-4 flex items-center gap-3"
        style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1.5px solid rgba(255,31,125,0.12)" }}>
        {profile?.avatar_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={profile.avatar_url} alt={name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          : <ProfileAvatar initial={initial} color="#FF1F7D" size={40} />
        }
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: "#111" }}>{name}</p>
          {neighborhood && <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{neighborhood}</p>}
        </div>
        <span className="text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
          Bloomies ✿
        </span>
      </div>
    );
  }

  // ── Sealed envelope variants by template ─────────────────────────────────

  if (template === "dark") {
    return (
      <button onClick={onOpen} className="w-full text-left transition-transform active:scale-[0.98]"
        style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        <div style={{ height: 28, background: "#FF1F7D", clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} />
        <div className="px-5 pt-2 pb-4" style={{ background: "#111" }}>
          <p className="text-[8px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(255,31,125,0.5)" }}>
            BLOOM REQUEST · AN INVITATION TO A REAL CONNECTION
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,31,125,0.15)", border: "1.5px solid rgba(255,31,125,0.3)" }}>
              <span className="font-black italic" style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "#FF1F7D" }}>B</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black italic text-white leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: 18 }}>
                She sees something<br/>in you.
              </p>
              <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Open to read her letter.</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#1a1a1a", borderTop: "1px solid rgba(255,31,125,0.15)" }}>
          <div>
            <p className="text-[9px] font-bold" style={{ color: "rgba(255,31,125,0.5)" }}>From</p>
            <p className="text-sm font-bold text-white">{name}{neighborhood ? ` · ${neighborhood}` : ""}</p>
          </div>
          <span className="text-[11px] font-bold" style={{ color: "#FF1F7D" }}>Open →</span>
        </div>
      </button>
    );
  }

  if (template === "cream") {
    return (
      <button onClick={onOpen} className="w-full text-left transition-transform active:scale-[0.98]"
        style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(255,31,125,0.15)", border: "1.5px solid rgba(255,31,125,0.2)" }}>
        <div style={{ height: 26, background: "#FFD6E8", clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} />
        <div className="px-5 pt-2 pb-4" style={{ background: "#FFF8F0" }}>
          <p className="text-[8px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(255,31,125,0.4)" }}>
            BLOOM REQUEST · A PERSONAL INVITATION
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,31,125,0.08)", border: "1.5px dashed rgba(255,31,125,0.3)" }}>
              <span style={{ fontSize: 20 }}>✉️</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black italic leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: 17, color: "#444" }}>
                She wrote you<br/>a little letter.
              </p>
              <p className="text-[10px] mt-1" style={{ color: "#bbb" }}>Tap to open it.</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#FFF0E4", borderTop: "1px dashed rgba(255,31,125,0.18)" }}>
          <div>
            <p className="text-[9px] font-bold" style={{ color: "#bbb" }}>From</p>
            <p className="text-sm font-bold" style={{ color: "#444" }}>{name}{neighborhood ? ` · ${neighborhood}` : ""}</p>
          </div>
          <span className="text-[11px] font-bold" style={{ color: "#FF1F7D" }}>Open →</span>
        </div>
      </button>
    );
  }

  if (template === "minimal") {
    return (
      <button onClick={onOpen} className="w-full text-left transition-transform active:scale-[0.98]"
        style={{ borderRadius: 16, background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1.5px solid rgba(255,31,125,0.25)", overflow: "hidden" }}>
        <div className="px-5 py-4 flex items-center gap-4">
          {profile?.avatar_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={profile.avatar_url} alt={name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            : <ProfileAvatar initial={initial} color="#FF1F7D" size={48} />
          }
          <div className="flex-1 min-w-0">
            <p className="text-[8px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>BLOOM REQUEST</p>
            <p className="font-black italic text-base leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
              {name} would like<br/>to connect.
            </p>
            {neighborhood && <p className="text-[10px] mt-1" style={{ color: "#bbb" }}>{neighborhood}</p>}
          </div>
          <span className="text-[11px] font-bold flex-shrink-0" style={{ color: "#FF1F7D" }}>Open →</span>
        </div>
        <div className="h-0.5" style={{ background: "rgba(255,31,125,0.12)" }} />
        <div className="px-5 py-2.5">
          <p className="text-[9px]" style={{ color: "#ccc" }}>AN INVITATION TO A REAL CONNECTION</p>
        </div>
      </button>
    );
  }

  // classic (default)
  return (
    <button onClick={onOpen} className="w-full text-left transition-transform active:scale-[0.98]"
      style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 32px rgba(255,31,125,0.22)" }}>
      <div style={{ background: "#FF69B4", height: "32px", clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} />
      <div className="px-5 pt-2 pb-4" style={{ background: "#FF1F7D" }}>
        <p className="text-[8px] font-bold tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.55)" }}>BLOOM REQUEST · AN INVITATION TO A REAL CONNECTION</p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FF69B4, #C0185F)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}>
            <span className="font-black italic text-white" style={{ fontFamily: "var(--font-playfair)", fontSize: "20px" }}>B</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black italic text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "18px" }}>
              She sees something<br/>in you.
            </p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              And she&apos;d love to get to know the real you.
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ background: "#C0185F" }}>
        <div>
          <p className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>From</p>
          <p className="text-sm font-bold text-white">{name}{neighborhood ? ` · ${neighborhood}` : ""}</p>
        </div>
        <span className="text-[11px] font-bold text-white">Open →</span>
      </div>
    </button>
  );
}

// ── Bloom Request — Letter (full-page reading) ────────────────────────────────

const COMPATIBILITY_POINTS = ["Values aligned", "Lifestyle aligned", "Energy aligned", "Vibe aligned"];

function BloomRequestLetterPage({ req, onAccept, onDecline, onBack, accepting }: {
  req: RealBloomRequest;
  onAccept: () => void;
  onDecline: () => void;
  onBack: () => void;
  accepting?: boolean;
}) {
  const senderProfile = req.sender;
  const senderName = reqDisplayName(senderProfile);
  const senderInitial = reqInitial(senderProfile);
  const template = req.data?.template ?? "classic";
  const bgColor = template === "dark" ? "#111" : template === "cream" ? "#FDF4EC" : template === "minimal" ? "#fff" : "#FDF4EC";
  const accentColor = "#FF1F7D";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: bgColor }}>
      <div className="sticky top-0 z-10 px-5 pt-4 pb-3 flex items-center justify-between"
        style={{ background: bgColor, borderBottom: template === "dark" ? "1px solid rgba(255,31,125,0.1)" : "1px solid rgba(0,0,0,0.05)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: accentColor }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <p className="text-[8px] font-bold tracking-[0.3em] uppercase" style={{ color: accentColor }}>BLOOMBAY</p>
        <div style={{ width: 48 }} />
      </div>

      <div className="px-5 pt-2 pb-28">
        <div className="text-center py-6">
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: accentColor }}>You just received a</p>
          <h1 className="font-black uppercase leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "36px", color: template === "dark" ? "#fff" : "#111" }}>
            BLOOM<br/>REQUEST
          </h1>
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase mt-1" style={{ color: "#aaa" }}>AN INVITATION TO A REAL CONNECTION</p>
        </div>

        <div className="rounded-3xl overflow-hidden mb-5"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)", background: template === "dark" ? "#1a1a1a" : "white" }}>
          <div className="flex items-center justify-center py-4"
            style={{ background: template === "dark" ? "#222" : "linear-gradient(135deg, #FF69B4 0%, #FF1F7D 100%)" }}>
            {senderProfile?.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={senderProfile.avatar_url} alt={senderName} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)" }} />
              : <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: template === "dark" ? "rgba(255,31,125,0.2)" : "radial-gradient(circle at 35% 35%, #FF69B4, #C0185F)", boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}>
                  <span className="font-black italic" style={{ fontFamily: "var(--font-playfair)", fontSize: 24, color: template === "dark" ? "#FF1F7D" : "white" }}>
                    {senderInitial}
                  </span>
                </div>
            }
          </div>
          <div className="px-7 py-6">
            <p className="font-black italic leading-tight mb-2 text-center"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "#FF1F7D" }}>
              She sees something<br/>in you.
            </p>
            <p className="text-sm text-center mb-5 leading-relaxed" style={{ color: template === "dark" ? "rgba(255,255,255,0.5)" : "#555" }}>
              And she&apos;d love to get<br/>to know the real you.
            </p>
            {req.note && (
              <div className="rounded-2xl px-5 py-4 mb-2"
                style={{ background: template === "dark" ? "rgba(255,31,125,0.08)" : "#FFF5F8", borderLeft: "3px solid #FF1F7D" }}>
                <p className="text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: template === "dark" ? "rgba(255,255,255,0.75)" : "#444" }}>
                  &ldquo;{req.note}&rdquo;
                </p>
              </div>
            )}
            {req.context && (
              <div className="mt-3 flex items-center gap-2">
                <span style={{ fontSize: 12 }}>🌸</span>
                <p className="text-[10px]" style={{ color: "#FF1F7D", fontWeight: 600 }}>{req.context}</p>
              </div>
            )}
            <div className="mt-4 pt-4" style={{ borderTop: "1px dashed rgba(255,31,125,0.18)" }}>
              <p className="text-xs italic leading-relaxed" style={{ color: "#999", fontSize: "13px" }}>
                This feels like a friendship worth exploring.
              </p>
              <p className="text-[9px] mt-1" style={{ color: accentColor, letterSpacing: "0.05em" }}>— Yande ✦</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-5 mb-4" style={{ background: template === "dark" ? "#1a1a1a" : "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p className="text-[8px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: accentColor }}>ABOUT HER</p>
          <div className="flex items-center gap-4">
            {senderProfile?.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={senderProfile.avatar_url} alt={senderName} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              : <ProfileAvatar initial={senderInitial} color="#FF1F7D" size={56} />
            }
            <div className="flex-1 min-w-0">
              <p className="font-black text-xl italic" style={{ fontFamily: "var(--font-playfair)", color: template === "dark" ? "#fff" : "#111" }}>
                {senderName}
              </p>
              {senderProfile?.neighborhood && (
                <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{senderProfile.neighborhood}</p>
              )}
            </div>
          </div>
        </div>

        {req.compatibility_score && (
          <div className="rounded-3xl p-5 mb-6" style={{ background: template === "dark" ? "#1a1a1a" : "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[8px] font-bold tracking-[0.22em] uppercase mb-0.5" style={{ color: accentColor }}>COMPATIBILITY</p>
                <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "48px", color: accentColor }}>
                  {req.compatibility_score}<span style={{ fontSize: "24px" }}>%</span>
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                {COMPATIBILITY_POINTS.map(pt => (
                  <div key={pt} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#FF1F7D" fillOpacity="0.12"/>
                      <polyline points="3.5,7 5.5,9.5 10.5,4.5" stroke="#FF1F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs" style={{ color: template === "dark" ? "rgba(255,255,255,0.6)" : "#444" }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button onClick={onAccept} disabled={accepting}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: accepting ? "#ffb0d0" : "#FF1F7D", boxShadow: "0 6px 24px rgba(255,31,125,0.35)", fontSize: "15px", letterSpacing: "0.04em" }}>
            {accepting ? "Accepting…" : "Accept Bloom Request"}
            <span style={{ fontSize: "18px" }}>✿</span>
          </button>
          <button onClick={onDecline}
            className="w-full py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98]"
            style={{ background: "transparent", border: template === "dark" ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #E8E8E8", color: "#888", fontSize: "14px" }}>
            Not now
          </button>
          <p className="text-center text-[9px]" style={{ color: "#ccc" }}>
            This request is private. You decide what happens next.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Both Bloomies — celebration overlay ───────────────────────────────────────

function BothBloomiesOverlay({ senderName, senderInitial, onDone }: {
  senderName: string; senderInitial: string; onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-8"
      style={{ background: "#FF1F7D" }}>
      <style>{`
        @keyframes bloomFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.06)} }
        @keyframes petalFall  { 0%{opacity:0;transform:translateY(-30px) rotate(0deg)} 20%{opacity:1} 100%{opacity:0;transform:translateY(100vh) rotate(360deg)} }
        @keyframes bloomIn    { 0%{opacity:0;transform:scale(0.6)} 60%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
      `}</style>

      {["10%","25%","40%","60%","75%","88%"].map((left, i) => (
        <div key={i} className="fixed pointer-events-none"
          style={{ left, top: 0, fontSize: "20px", opacity: 0,
            animation: `petalFall ${2.5 + i * 0.4}s ease-in ${i * 0.3}s infinite` }}>
          🌸
        </div>
      ))}

      <div className="flex items-center gap-0 mb-10" style={{ animation: "bloomIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-white border-4 border-white"
          style={{ background: "#C0185F", fontSize: "28px", boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
          {senderInitial}
        </div>
        <div className="flex items-center justify-center mx-[-8px] z-10"
          style={{ animation: "bloomFloat 2s ease-in-out infinite" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
            <span style={{ fontSize: "24px" }}>✿</span>
          </div>
        </div>
        <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-white border-4 border-white"
          style={{ background: "#FF69B4", fontSize: "28px", boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
          Y
        </div>
      </div>

      <div className="text-center mb-8" style={{ animation: "bloomIn 0.5s 0.15s cubic-bezier(0.34,1.56,0.64,1) both", opacity: 0 }}>
        <p className="font-bold tracking-[0.2em] uppercase text-white mb-2" style={{ fontSize: "11px", opacity: 0.7 }}>
          YOU&apos;RE BOTH
        </p>
        <p className="font-black italic text-white leading-tight"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "42px", lineHeight: 0.95 }}>
          Bloomies<br/>now.
        </p>
        <p className="italic mt-3 leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>
          You and {senderName} are now connected.<br/>Say hello.
        </p>
      </div>

      <div className="w-full flex flex-col gap-3" style={{ animation: "bloomIn 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both", opacity: 0 }}>
        <button
          className="w-full py-4 rounded-2xl font-bold text-[#FF1F7D] transition-all active:scale-[0.97]"
          style={{ background: "white", fontSize: "15px", boxShadow: "0 6px 24px rgba(0,0,0,0.15)" }}
          onClick={onDone}>
          Message {senderName} →
        </button>
        <button onClick={onDone} className="w-full py-3 font-semibold" style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ── Orbit Card (horizontal scroll) ───────────────────────────────────────────

function OrbitCard({ girl, connected, shaking, onConnect }: {
  girl: OrbitProfile; connected: boolean; shaking: boolean; onConnect: () => void;
}) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0" style={{ width: 210, background: "white", boxShadow: "0 4px 20px rgba(255,31,125,0.10)" }}>
      <div className="h-[68px] relative" style={{ background: `linear-gradient(135deg, ${girl.color} 0%, ${girl.color}88 100%)` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
        <p className="absolute top-2.5 right-3 text-[7px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>IN YOUR ORBIT</p>
        <div className="absolute bottom-0 left-4" style={{ transform: "translateY(50%)" }}>
          <ProfileAvatar initial={girl.initial} color={girl.color} size={44} />
        </div>
      </div>
      <div className="px-4 pt-8 pb-4">
        <p className="font-black text-sm italic leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{girl.name}</p>
        <p className="text-[10px] mt-0.5 mb-1.5" style={{ color: "#aaa" }}>{girl.neighborhood}</p>
        <div className="flex flex-wrap gap-1 mb-2.5">
          {girl.clubs.slice(0, 2).map(c => (
            <span key={c} className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${girl.color}14`, color: girl.color }}>{c}</span>
          ))}
        </div>
        <p className="text-[10px] mb-3 leading-snug italic" style={{ fontFamily: "var(--font-playfair)", color: "#777", borderLeft: `2px solid ${girl.color}33`, paddingLeft: "8px" }}>
          ✦ {girl.yandeNote}
        </p>
        <button
          onClick={() => !connected && onConnect()}
          className="w-full py-2.5 rounded-full text-[11px] font-bold"
          style={
            connected
              ? { background: "#eee", color: "#aaa", transition: "all 0.2s ease" }
              : shaking
                ? { background: girl.color, color: "white", boxShadow: `0 4px 12px ${girl.color}44`, animation: "shakePop 0.65s cubic-bezier(0.36,0.07,0.19,0.97) both" }
                : { background: girl.color, color: "white", boxShadow: `0 4px 12px ${girl.color}44`, transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)" }
          }
        >
          {connected ? "Sent ✓" : "Introduce me"}
        </button>
      </div>
    </div>
  );
}

// ── Come With Me Card ─────────────────────────────────────────────────────────

function ComeWithMeCard({ post, joined, onJoin }: {
  post: ComeWithPost; joined: boolean; onJoin: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `3px solid ${post.color}` }}>
      <div className="flex items-start gap-3 mb-3">
        <ProfileAvatar initial={post.initial} color={post.color} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm" style={{ color: "#111" }}>{post.name}</p>
            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${post.color}15`, color: post.color }}>
              {post.emoji} {post.activity}
            </span>
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: "#bbb" }}>{post.neighborhood} · {post.timeAgo}</p>
        </div>
      </div>
      <p className="text-sm italic leading-relaxed mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>
        &ldquo;{post.post}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.04)", color: "#888" }}>
          {post.when}
        </span>
        <button onClick={onJoin}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
          style={joined ? { background: "#FFF0F5", color: "#FF1F7D" } : { background: "#111", color: "white" }}>
          {joined ? "You're in ✓" : "Join her →"}
        </button>
      </div>
    </div>
  );
}

// ── Interest Cluster Tile ─────────────────────────────────────────────────────

function InterestClusterTile({ cluster, onOpen }: {
  cluster: InterestCluster; onOpen: () => void;
}) {
  return (
    <button onClick={onOpen}
      className="rounded-3xl p-4 text-left transition-transform active:scale-[0.97]"
      style={{ background: cluster.bg, boxShadow: `0 2px 14px ${cluster.color}15` }}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: "20px" }}>{cluster.emoji}</span>
        <span className="text-[8px] font-bold tracking-wider uppercase" style={{ color: cluster.color }}>{cluster.count} women</span>
      </div>
      <p className="font-black italic text-base leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{cluster.label}</p>
      <p className="text-[10px] mt-0.5 mb-3" style={{ color: "#aaa" }}>{cluster.desc}</p>
      <div className="flex">
        {cluster.avatars.map((a, i) => (
          <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
            style={{ background: a.color, marginLeft: i > 0 ? "-7px" : "0", zIndex: cluster.avatars.length - i }}>
            {a.initial}
          </div>
        ))}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white" style={{ background: "#f5f5f5", color: "#aaa", marginLeft: "-7px" }}>
          +{cluster.count - 3}
        </div>
      </div>
    </button>
  );
}

// ── Cluster Bottom Sheet ──────────────────────────────────────────────────────

function ClusterSheet({ cluster, onClose, connected, shaking, onConnect }: {
  cluster: InterestCluster; onClose: () => void;
  connected: Set<number>; shaking: Set<number>;
  onConnect: (id: number, name: string) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: "#FDFAF5", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "80vh", overflowY: "auto" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>
        <div className="px-6 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ fontSize: "22px" }}>{cluster.emoji}</span>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: cluster.color }}>{cluster.count} women</p>
            </div>
            <p className="font-black italic text-xl" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{cluster.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{cluster.desc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        <div className="px-6 pb-8 flex flex-col gap-3 mt-2">
          {cluster.profiles.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderLeft: `3px solid ${p.color}` }}>
              <ProfileAvatar initial={p.initial} color={p.color} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#111" }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{p.neighborhood}</p>
                <p className="text-[10px] mt-1 italic" style={{ color: "#bbb", fontFamily: "var(--font-playfair)" }}>{p.vibe}</p>
              </div>
              <button
                onClick={() => !connected.has(p.id) && onConnect(p.id, p.name)}
                className="flex-shrink-0 px-3 py-2 rounded-full text-[11px] font-bold transition-all"
                style={
                  connected.has(p.id)
                    ? { background: "#eee", color: "#aaa" }
                    : shaking.has(p.id)
                      ? { background: p.color, color: "white", animation: "shakePop 0.65s cubic-bezier(0.36,0.07,0.19,0.97) both" }
                      : { background: p.color, color: "white", boxShadow: `0 3px 10px ${p.color}33` }
                }>
                {connected.has(p.id) ? "Sent ✓" : "Introduce me"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function IntroductionsPage() {
  // ── Real bloom request state ───────────────────────────────────────────────
  const [incoming, setIncoming] = useState<RealBloomRequest[]>([]);
  const [sent, setSent] = useState<RealBloomRequest[]>([]);
  const [acceptedBloom, setAcceptedBloom] = useState<RealBloomRequest[]>([]);
  const [openLetter, setOpenLetter] = useState<RealBloomRequest | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [bloomiesOf, setBloomiesOf] = useState<{ name: string; initial: string } | null>(null);

  // ── Other state ────────────────────────────────────────────────────────────
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [orbitConnected, setOrbitConnected] = useState<Set<number>>(new Set());
  const [orbitShaking, setOrbitShaking] = useState<Set<number>>(new Set());
  const [newInTownConnected, setNewInTownConnected] = useState<Set<number>>(new Set());
  const [newInTownShaking, setNewInTownShaking] = useState<Set<number>>(new Set());
  const [clusterConnected, setClusterConnected] = useState<Set<number>>(new Set());
  const [clusterShaking, setClusterShaking] = useState<Set<number>>(new Set());
  const [activeCluster, setActiveCluster] = useState<InterestCluster | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [realIntros, setRealIntros] = useState<RealIntro[]>([]);
  const [comeWithPosts, setComeWithPosts] = useState<RealComeWith[]>([]);
  const [sentBloomRequests, setSentBloomRequests] = useState<Set<string>>(new Set());
  const [showPostIntroSheet, setShowPostIntroSheet] = useState(false);
  const [showGirlMate, setShowGirlMate] = useState(false);

  useEffect(() => {
    fetch("/api/member/bloom-requests")
      .then(r => r.ok ? r.json() : { incoming: [], sent: [], accepted: [] })
      .then(d => {
        setIncoming(d.incoming ?? []);
        setSent(d.sent ?? []);
        setAcceptedBloom(d.accepted ?? []);
      })
      .catch(() => undefined);

    fetch("/api/introductions").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRealIntros(data);
    }).catch(() => undefined);
    fetch("/api/come-with-me").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setComeWithPosts(data);
    }).catch(() => undefined);
  }, []);

  async function handleAcceptRequest(req: RealBloomRequest) {
    setAccepting(true);
    try {
      const res = await fetch(`/api/member/bloom-requests/${req.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (res.ok) {
        setIncoming(prev => prev.filter(r => r.id !== req.id));
        setAcceptedBloom(prev => [{ ...req, status: "accepted" }, ...prev]);
        const name = reqDisplayName(req.sender);
        setBloomiesOf({ name, initial: name.charAt(0).toUpperCase() });
        setOpenLetter(null);
      }
    } finally {
      setAccepting(false);
    }
  }

  async function handleDeclineRequest(req: RealBloomRequest) {
    await fetch(`/api/member/bloom-requests/${req.id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "declined" }),
    });
    setIncoming(prev => prev.filter(r => r.id !== req.id));
    setOpenLetter(null);
  }

  async function sendBloomRequest(recipientId: string) {
    if (sentBloomRequests.has(recipientId)) return;
    setSentBloomRequests(prev => new Set([...prev, recipientId]));
    await fetch("/api/member/bloom-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ toUserId: recipientId }),
    });
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function introduceOrbit(id: number, name: string) {
    setOrbitConnected(p => new Set([...p, id]));
    setOrbitShaking(p => new Set([...p, id]));
    showToast(`Bloom request sent to ${name.split(" ")[0]} ✓`);
    setTimeout(() => setOrbitShaking(p => { const n = new Set(p); n.delete(id); return n; }), 650);
  }

  function introduceNewInTown(id: number, name: string) {
    setNewInTownConnected(p => new Set([...p, id]));
    setNewInTownShaking(p => new Set([...p, id]));
    showToast(`Bloom request sent to ${name.split(" ")[0]} ✓`);
    setTimeout(() => setNewInTownShaking(p => { const n = new Set(p); n.delete(id); return n; }), 650);
  }

  function introduceCluster(id: number, name: string) {
    setClusterConnected(p => new Set([...p, id]));
    setClusterShaking(p => new Set([...p, id]));
    showToast(`Bloom request sent to ${name.split(" ")[0]} ✓`);
    setTimeout(() => setClusterShaking(p => { const n = new Set(p); n.delete(id); return n; }), 650);
  }

  const incomingCount = incoming.length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bb-page-bg, #FFF0F6)", paddingTop: "calc(env(safe-area-inset-top, 0px) + 54px)" }}>
      <style>{`
        @keyframes slideUpToast { from { opacity:0; transform:translateX(-50%) translateY(14px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes fadeSlideIn  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shakePop {
          0%   { transform: scale(1)    translateX(0); }
          12%  { transform: scale(1.08) translateX(-5px); }
          24%  { transform: scale(1.08) translateX(5px); }
          36%  { transform: scale(1.05) translateX(-4px); }
          48%  { transform: scale(1.05) translateX(4px); }
          60%  { transform: scale(1.03) translateX(-2px); }
          72%  { transform: scale(1.03) translateX(2px); }
          86%  { transform: scale(1.01) translateX(-1px); }
          100% { transform: scale(1)    translateX(0); }
        }
      `}</style>

      <div className="px-5 pt-14 pb-6" style={{ animation: "fadeSlideIn 0.25s ease-out" }}>
        <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "#FF1F7D" }}>✦ INTRODUCTIONS</p>
        <h1 className="font-black italic leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,6vw,40px)", color: "#111" }}>
          Women who may belong<br/>in your story.
        </h1>
        <p className="text-xs italic" style={{ fontFamily: "var(--font-playfair)", color: "#bbb" }}>
          Not dating. Not swiping. Relationship-building.
        </p>
      </div>

      <div className="flex flex-col gap-10 pb-4">

        {/* Post-event: suggest becoming bloomies with people you just met */}
        <section className="px-5">
          <PostEventBloomiePrompt />
        </section>

        <section className="px-5">
          <div className="flex items-start justify-between mb-4">
            <SectionHeader
              eyebrow={`BLOOM REQUESTS${incomingCount > 0 ? ` · ${incomingCount}` : ""}`}
              title="Women intentionally reaching out."
            />
          </div>

          {incoming.length === 0 && acceptedBloom.length === 0 ? (
            <div className="rounded-2xl p-5 text-center" style={{ background: "#FFF5F8" }}>
              <p className="text-sm italic" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)", fontSize: "17px" }}>
                The invitations are coming. Your energy precedes you.
              </p>
              <p className="text-xs mt-1" style={{ color: "#bbb" }}>— Yande ✦</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {incoming.map(req => (
                <BloomRequestEnvelope key={req.id} req={req} isIncoming accepted={false}
                  onOpen={() => setOpenLetter(req)} />
              ))}
              {acceptedBloom.map(req => (
                <BloomRequestEnvelope key={req.id} req={req} isIncoming accepted onOpen={() => {}} />
              ))}
            </div>
          )}

          {sent.length > 0 && (
            <div className="mt-4">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#ccc" }}>WAITING FOR REPLY</p>
              <div className="flex flex-col gap-2">
                {sent.map(r => {
                  const recip = r.recipient;
                  const rName = reqDisplayName(recip);
                  const rInitial = reqInitial(recip);
                  const daysAgo = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000);
                  return (
                    <div key={r.id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
                      {recip?.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={recip.avatar_url} alt={rName} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        : <ProfileAvatar initial={rInitial} color="#FF1F7D" size={36} />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: "#111" }}>{rName}</p>
                        {recip?.neighborhood && <p className="text-[10px]" style={{ color: "#bbb" }}>{recip.neighborhood}</p>}
                      </div>
                      <span className="text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#F5F5F5", color: "#ccc" }}>
                        {daysAgo === 0 ? "today" : `${daysAgo}d ago`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="px-5">
            <SectionHeader
              eyebrow="IN YOUR ORBIT"
              title="Discovery. Serendipity."
              note="Not active searching."
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 px-5" style={{ scrollbarWidth: "none" }}>
          </div>
        </section>

        <section className="px-5">
          <SectionHeader
            eyebrow="NEW IN TOWN"
            title="Just arrived. Ready to belong."
            note="Women who recently moved — looking for people and places."
          />
          <div className="flex flex-col gap-3">
            {realIntros.map(intro => {
              const name = intro.profiles.full_name ?? intro.profiles.first_name ?? "Member";
              const initial = name.charAt(0).toUpperCase();
              const isSent = sentBloomRequests.has(intro.user_id);
              return (
                <div key={intro.id} style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: "3px solid #FF1F7D" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <ProfileAvatar initial={initial} color="#FF1F7D" size={44} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{name}</p>
                      {intro.neighborhood && <p style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{intro.neighborhood}</p>}
                      <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 100, marginTop: 6, background: "rgba(255,31,125,0.1)", color: "#FF1F7D" }}>
                        ✦ {intro.arrival_status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontStyle: "italic", lineHeight: 1.6, color: "#555", marginBottom: 12 }}>
                    &ldquo;{intro.bio}&rdquo;
                  </p>
                  <button
                    onClick={() => sendBloomRequest(intro.user_id)}
                    style={isSent
                      ? { padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: "#eee", color: "#aaa", border: "none", cursor: "default" }
                      : { padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: "#FF1F7D", color: "white", border: "none", cursor: "pointer" }
                    }>
                    {isSent ? "Sent ✦" : "Bloom Request →"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-5">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <SectionHeader
              eyebrow="COME WITH ME"
              title="Activity companions."
              note="Women looking for someone to go with."
            />
            <Link href="/member/introductions/come-with-me/new" style={{ textDecoration: "none", flexShrink: 0, marginTop: -16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "#FF1F7D",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 12px rgba(255,31,125,0.4)",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {comeWithPosts.map(cwp => {
              const posterName = cwp.profiles.full_name ?? cwp.profiles.first_name ?? "Member";
              return (
                <div key={cwp.id} style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: "3px solid #FF1F7D" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <ProfileAvatar initial={posterName.charAt(0).toUpperCase()} color="#FF1F7D" size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{posterName}</p>
                        <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: "rgba(255,31,125,0.1)", color: "#FF1F7D" }}>
                          {cwp.emoji} {cwp.activity}
                        </span>
                      </div>
                      {cwp.profiles.neighborhood && <p style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>{cwp.profiles.neighborhood}</p>}
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontStyle: "italic", lineHeight: 1.6, color: "#444", marginBottom: 12 }}>
                    &ldquo;{cwp.post}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {cwp.when_text && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "6px 12px", borderRadius: 100, background: "rgba(0,0,0,0.04)", color: "#888" }}>
                        {cwp.when_text}
                      </span>
                    )}
                    <button style={{ padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: "#111", color: "white", border: "none", cursor: "pointer", marginLeft: "auto" }}>
                      I&apos;m In →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/member/pin-drops" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 14, padding: "12px 18px", borderRadius: 16,
            background: "rgba(255,31,125,0.06)", border: "1.5px solid rgba(255,31,125,0.14)",
            textDecoration: "none",
          }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", color: "#FF1F7D", marginBottom: 2 }}>LIVE FEED</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: "#111" }}>See real-time pins from your Bloomies</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        </section>

        <section className="px-5">
          <SectionHeader
            eyebrow="YOUR KIND OF GIRLS"
            title="Interest-based discovery."
            note="Women intentionally looking for more women like themselves."
          />
          <div className="grid grid-cols-2 gap-3">
          </div>
        </section>

        {/* ── GirlMates ─────────────────────────────────────────────────────── */}
        <section className="px-5">
          <SectionHeader eyebrow="GIRLMATES" title="Roommate matching." />
          <button onClick={() => setShowGirlMate(true)} style={{ textDecoration: "none", display: "block", width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "#111", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <div className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #FF1F7D, transparent 70%)", opacity: 0.13, transform: "translate(30%,-30%)" }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #FF69B4, transparent 70%)", opacity: 0.1, transform: "translate(-30%,30%)" }} />
                <div className="relative">
                  <span className="inline-block text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full mb-4" style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}>
                    NEW ✦
                  </span>
                  <h3 className="font-black italic text-2xl leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)", color: "white" }}>
                    GirlMates.
                  </h3>
                  <p className="text-sm leading-relaxed mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Housing compatibility. Lifestyle compatibility.
                  </p>
                  <p className="text-xs italic mb-5" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.25)" }}>
                    For when you want to share more than a city.
                  </p>
                  <span className="inline-block px-5 py-2.5 rounded-full text-xs font-bold" style={{ background: "#FF1F7D", color: "#fff" }}>
                    Find your GirlMate →
                  </span>
                </div>
              </div>
            </div>
          </button>
        </section>

        {/* ── Find a Room ─────────────────────────────────────────────────────── */}
        <section className="px-5">
          <Link href="/member/girlmate/rooms" style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              background: "linear-gradient(135deg, #1A0A2E 0%, #2D1050 100%)",
              borderRadius: 20, padding: "18px 20px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
              position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.25) 0%, transparent 70%)" }} />
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,31,125,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,31,125,0.25)" }}>
                <span style={{ fontSize: 20 }}>🏠</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.7)", marginBottom: 3 }}>ROOMS</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, fontWeight: 900, color: "white", lineHeight: 1.1 }}>Find a Room.</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Look for a room with women you can trust.</p>
              </div>
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path d="M1 1l8 7-8 7" stroke="rgba(255,31,125,0.6)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
        </section>

        {/* ── Coming soon: Hanger · Book · Bloom Trip ───────────────────────── */}
        <section className="px-5">
          <SectionHeader eyebrow="MORE FOR YOU" title="More for you." note="Built for Bloombay women. Dropping soon." />
          <div className="flex flex-col gap-3">
            {[
              { href: "/member/hanger", label: "The Hanger", sub: "Sell & swap fashion with women in the city.", accent: "#C084FC" },
              { href: "/member/book",   label: "The Book",   sub: "Book women-owned services. Hair. Nails. Art. More.", accent: "#34D399" },
              { href: "/member/bloom-trip", label: "Bloom Trip", sub: "Organize travel with women who get it.", accent: "#F59E0B" },
            ].map(({ href, label, sub, accent }) => (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: `${accent}22` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight" style={{ fontFamily: "var(--font-jost)", color: "white" }}>{label}</p>
                    <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: accent }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {activeCluster && (
        <ClusterSheet
          cluster={activeCluster}
          onClose={() => setActiveCluster(null)}
          connected={clusterConnected}
          shaking={clusterShaking}
          onConnect={introduceCluster}
        />
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 px-5 py-3.5 rounded-full text-sm font-semibold text-white"
          style={{ background: "#111", transform: "translateX(-50%)", boxShadow: "0 8px 24px rgba(0,0,0,0.28)", animation: "slideUpToast 0.28s cubic-bezier(0.34,1.56,0.64,1)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {openLetter && (
        <BloomRequestLetterPage
          req={openLetter}
          accepting={accepting}
          onBack={() => setOpenLetter(null)}
          onAccept={() => handleAcceptRequest(openLetter)}
          onDecline={() => handleDeclineRequest(openLetter)}
        />
      )}

      {bloomiesOf && (
        <BothBloomiesOverlay
          senderName={bloomiesOf.name}
          senderInitial={bloomiesOf.initial}
          onDone={() => setBloomiesOf(null)}
        />
      )}

      {/* Post Intro FAB */}
      <div style={{ position: "fixed", bottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)", right: 18, zIndex: 50 }}>
        <button onClick={() => setShowPostIntroSheet(true)} style={{ width: 52, height: 52, borderRadius: "50%", background: "#FF1F7D", border: "none", boxShadow: "0 4px 18px rgba(255,31,125,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      {showPostIntroSheet && <PostIntroSheet onClose={() => setShowPostIntroSheet(false)} />}

      {/* GirlMate full-screen slide-up sheet */}
      {showGirlMate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          animation: "gmSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <style>{`
            @keyframes gmSlideUp {
              from { transform: translateY(100%); }
              to   { transform: translateY(0); }
            }
          `}</style>
          <div style={{ width: "100%", height: "100%", overflowY: "auto", WebkitOverflowScrolling: "touch" as unknown as undefined }}>
            <GirlMatePage onBack={() => setShowGirlMate(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Post Intro Sheet ──────────────────────────────────────────────────────────

function PostIntroSheet({ onClose }: { onClose: () => void }) {
  const [bio, setBio] = useState("");
  const [arrivalStatus, setArrivalStatus] = useState("local");
  const [neighborhood, setNeighborhood] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (bio.length < 10) return;
    setSubmitting(true);
    const res = await fetch("/api/introductions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bio, arrival_status: arrivalStatus, neighborhood }),
    });
    if (res.ok) setDone(true);
    setSubmitting(false);
  }

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "32px 24px", textAlign: "center", maxWidth: 320, width: "100%" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, fontStyle: "italic", color: "#FF1F7D", marginBottom: 8 }}>You&apos;re in the room. ✦</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#666", marginBottom: 24 }}>Your introduction is live.</p>
        <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 100, background: "#FF1F7D", color: "white", border: "none", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Done</button>
      </div>
    </div>
  );

  const ARRIVAL_OPTIONS = [
    { value: "just_moved", label: "Just moved here" },
    { value: "new_6mo", label: "New (< 6 months)" },
    { value: "fresh_start", label: "Fresh start" },
    { value: "local", label: "Local" },
    { value: "native", label: "Native" },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1.5px solid #E0D8CF", background: "white",
    fontFamily: "var(--font-jost)", fontSize: 14, color: "#1C1B1C",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, fontStyle: "italic", color: "#1C1B1C" }}>Introduce yourself.</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" }}>×</button>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", marginBottom: 20 }}>Tell the community who you are. This appears in the introductions feed.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Who are you? *</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="I just moved to Brooklyn from Lagos. I'm a graphic designer who loves museums, good food, and finding community." rows={4} style={{ ...inputStyle, resize: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: bio.length < 10 ? "#FF6B6B" : "#aaa", marginTop: 4 }}>{bio.length}/500 — at least 10 characters</p>
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Your story *</label>
            <select value={arrivalStatus} onChange={e => setArrivalStatus(e.target.value)} style={{ ...inputStyle }}>
              {ARRIVAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Neighborhood</label>
            <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Williamsburg, Crown Heights, SoHo…" style={inputStyle} />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={submitting || bio.length < 10} style={{ width: "100%", marginTop: 24, padding: "16px", borderRadius: 100, border: "none", background: bio.length < 10 ? "#FFB6D0" : "#FF1F7D", color: "white", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 15, cursor: bio.length < 10 ? "default" : "pointer" }}>
          {submitting ? "Posting…" : "Post My Introduction →"}
        </button>
      </div>
    </div>
  );
}
