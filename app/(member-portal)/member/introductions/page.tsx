"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getIntros, postIntro, flowerIntro, type IntroPost } from "@/lib/actions/introductions";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD  = "#D4A853";

const ARRIVAL_LABELS: Record<string, string> = {
  just_moved:   "Just moved here",
  new_6mo:      "New (< 6 months)",
  fresh_start:  "Fresh start",
  local:        "NYC local",
  native:       "Born & raised",
};

const ARRIVAL_EMOJIS: Record<string, string> = {
  just_moved:  "📦",
  new_6mo:     "🌱",
  fresh_start: "✨",
  local:       "🗽",
  native:      "⭐",
};

const ARRIVAL_COLORS: Record<string, string> = {
  just_moved:  "#FF1F7D",
  new_6mo:     "#83C5A0",
  fresh_start: "#A855F7",
  local:       "#0EA5E9",
  native:      GOLD,
};

const INTEREST_COLORS = ["#FF1F7D","#A855F7","#0EA5E9","#83C5A0","#D4A853","#FF69B4"];

function IntroCard({ intro, onFlower }: { intro: IntroPost; onFlower: (id: string) => void }) {
  const [flowered, setFlowered] = useState(intro.my_flower);
  const [count, setCount] = useState(intro.flowers);
  const arrivalColor = ARRIVAL_COLORS[intro.arrival_status] ?? PINK;
  const arrivalEmoji = ARRIVAL_EMOJIS[intro.arrival_status] ?? "🌸";

  function handleFlower() {
    const next = !flowered;
    setFlowered(next);
    setCount(c => c + (next ? 1 : -1));
    onFlower(intro.id);
  }

  return (
    <div style={{
      background: "white", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: 12,
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${arrivalColor}, ${arrivalColor}66)` }} />

      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${intro.color}, ${intro.color}BB)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 16, fontWeight: 800, color: "white" }}>{intro.initial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 700, color: DARK }}>{intro.name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa", marginTop: 1 }}>
              {intro.neighborhood ? `📍 ${intro.neighborhood} · ` : ""}{intro.time}
            </p>
          </div>
          <div style={{
            flexShrink: 0, background: `${arrivalColor}14`, border: `1px solid ${arrivalColor}30`,
            borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 10 }}>{arrivalEmoji}</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: arrivalColor, letterSpacing: "0.04em" }}>
              {ARRIVAL_LABELS[intro.arrival_status]}
            </p>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#444", lineHeight: 1.55, marginBottom: 12 }}>
          {intro.bio}
        </p>

        {intro.interests.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {intro.interests.map((tag, i) => (
              <div key={tag} style={{
                background: `${INTEREST_COLORS[i % INTEREST_COLORS.length]}12`,
                border: `1px solid ${INTEREST_COLORS[i % INTEREST_COLORS.length]}25`,
                borderRadius: 999, padding: "3px 10px",
              }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: INTEREST_COLORS[i % INTEREST_COLORS.length] }}>{tag}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleFlower}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 999, border: "none", cursor: "pointer",
              background: flowered ? `${PINK}15` : "rgba(0,0,0,0.05)",
              transition: "all 0.15s",
            }}>
            <span style={{ fontSize: 13 }}>🌸</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: flowered ? PINK : "#888" }}>{count}</p>
          </button>
          <button style={{
            marginLeft: "auto", padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${PINK},#FF69B4)`,
            fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white",
            boxShadow: `0 2px 10px ${PINK}33`,
          }}>
            Connect →
          </button>
        </div>
      </div>
    </div>
  );
}

function PostIntroSheet({ onClose, onPost }: {
  onClose: () => void;
  onPost: (data: { bio: string; arrival_status: string; neighborhood: string; interests: string[] }) => Promise<void>;
}) {
  const [bio, setBio] = useState("");
  const [arrivalStatus, setArrival] = useState<string>("just_moved");
  const [neighborhood, setNeighborhood] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const INTEREST_OPTIONS = ["Art","Music","Tech","Books","Fitness","Food","Fashion","Travel","Film","Business","Wellness","Dance"];

  function toggleInterest(i: string) {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : prev.length < 5 ? [...prev, i] : prev);
  }

  async function handlePost() {
    if (!bio.trim()) return;
    setPosting(true);
    setErr(null);
    try {
      await onPost({ bio, arrival_status: arrivalStatus, neighborhood, interests });
    } catch {
      setErr("Something went wrong. Try again.");
      setPosting(false);
    }
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 61, borderRadius: "24px 24px 0 0", background: "white", maxHeight: "92dvh", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ padding: "8px 20px 14px", borderBottom: "1px solid #F5F5F5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>✦ INTRODUCE YOURSELF</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#aaa", marginTop: 2 }}>Tell the community who you are</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 8 }}>YOUR STORY</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {Object.entries(ARRIVAL_LABELS).map(([val, label]) => {
                const active = arrivalStatus === val;
                const c = ARRIVAL_COLORS[val] ?? PINK;
                return (
                  <button key={val} onClick={() => setArrival(val)} style={{
                    padding: "7px 12px", borderRadius: 999, border: active ? `2px solid ${c}` : "2px solid transparent",
                    background: active ? `${c}12` : "#F8F8F8", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 12 }}>{ARRIVAL_EMOJIS[val]}</span>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: active ? c : "#888" }}>{label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 7 }}>YOUR NEIGHBORHOOD</p>
            <input
              value={neighborhood}
              onChange={e => setNeighborhood(e.target.value)}
              placeholder="Bed-Stuy, Harlem, Williamsburg…"
              style={{ width: "100%", padding: "11px 14px", borderRadius: 14, background: "#FFF5F8", border: "1.5px solid #FFE0EE", fontFamily: "var(--font-jost)", fontSize: 13, color: DARK, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 7 }}>INTRODUCE YOURSELF</p>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, 500))}
              placeholder="Tell the community who you are, where you're from, what you're looking for in NYC…"
              rows={4}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 14, background: "#FFF5F8", border: "1.5px solid #FFE0EE", fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, outline: "none", resize: "none", lineHeight: 1.5, boxSizing: "border-box" }}
            />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#ccc", marginTop: 4, textAlign: "right" }}>{bio.length}/500</p>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 8 }}>YOUR INTERESTS (up to 5)</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {INTEREST_OPTIONS.map((interest, i) => {
                const on = interests.includes(interest);
                const c = INTEREST_COLORS[i % INTEREST_COLORS.length];
                return (
                  <button key={interest} onClick={() => toggleInterest(interest)} style={{
                    padding: "6px 12px", borderRadius: 999, border: on ? `2px solid ${c}` : "2px solid transparent",
                    background: on ? `${c}12` : "#F8F8F8", cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: on ? c : "#888" }}>{interest}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {err && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#EF4444" }}>{err}</p>}
        </div>

        <div style={{ padding: "12px 20px", paddingBottom: "calc(12px + env(safe-area-inset-bottom,0px))", borderTop: "1px solid #F5F5F5", flexShrink: 0 }}>
          <button onClick={handlePost} disabled={!bio.trim() || posting} style={{
            width: "100%", padding: "13px 0", borderRadius: 999, border: "none", cursor: "pointer",
            background: bio.trim() ? `linear-gradient(135deg,${PINK},#FF69B4)` : "#F5E8EE",
            color: bio.trim() ? "white" : "#C8A0B0",
            fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800,
            opacity: posting ? 0.7 : 1,
          }}>
            {posting ? "Posting…" : "Post Introduction →"}
          </button>
        </div>
      </div>
    </>
  );
}

type Filter = "all" | "just_moved" | "new_6mo" | "fresh_start" | "local" | "native";

export default function IntroductionsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [intros, setIntros] = useState<IntroPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPost, setShowPost] = useState(false);
  const [posted, setPosted] = useState(false);

  const fetchIntros = useCallback(async (f: Filter) => {
    setLoading(true);
    const data = await getIntros(f === "all" ? undefined : f);
    setIntros(data);
    setLoading(false);
  }, []);

  useEffect(() => { void fetchIntros(filter); }, [filter, fetchIntros]);

  async function handlePost(data: { bio: string; arrival_status: string; neighborhood: string; interests: string[] }) {
    const result = await postIntro(data);
    if (!result.ok) throw new Error(result.error);
    setShowPost(false);
    setPosted(true);
    await fetchIntros(filter);
  }

  function handleFlower(id: string) {
    void flowerIntro(id);
  }

  const FILTER_OPTS: { val: Filter; label: string; emoji: string }[] = [
    { val: "all", label: "All", emoji: "🌸" },
    { val: "just_moved", label: "Just arrived", emoji: "📦" },
    { val: "new_6mo", label: "New (< 6mo)", emoji: "🌱" },
    { val: "fresh_start", label: "Fresh start", emoji: "✨" },
    { val: "local", label: "Locals", emoji: "🗽" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>

      <div style={{
        background: `linear-gradient(155deg, ${DARK} 0%, #2A0818 50%, rgba(255,31,125,0.2) 100%)`,
        paddingTop: "calc(env(safe-area-inset-top,0px) + 54px)",
        paddingBottom: 24, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.15) 0%, transparent 70%)" }} />

        <div style={{ padding: "0 20px 14px" }}>
          <Link href="/member/happenings" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>HAPPENINGS</span>
          </Link>
        </div>

        <div style={{ padding: "0 20px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: PINK, marginBottom: 6 }}>🌸 INTRODUCTIONS</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(28px,8vw,38px)", color: "rgba(255,238,220,0.95)", lineHeight: 0.95, margin: 0, marginBottom: 8 }}>
            Meet the Women.
          </h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.4, marginBottom: 16 }}>
            New arrivals, fresh starts, and locals who love this city — introduce yourself and find your people.
          </p>

          <button onClick={() => setShowPost(true)} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)",
            borderRadius: 14, padding: "12px 16px", cursor: "pointer", width: "100%",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>👋</span>
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Introduce yourself to the community</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Tap to share your story</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <div style={{ margin: "16px 16px 0" }}>
        <div style={{
          borderRadius: 18, overflow: "hidden",
          background: `linear-gradient(135deg, ${PINK}22 0%, rgba(192,0,96,0.28) 100%)`,
          border: `1px solid ${PINK}30`, padding: "16px 18px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: 28 }}>📍</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: DARK, lineHeight: 1.1 }}>New in NYC?</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#888", marginTop: 3, lineHeight: 1.4 }}>We have dinners, open seats & clubs just for new arrivals</p>
          </div>
          <Link href="/member/match?new_in_town=1" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ background: PINK, borderRadius: 999, padding: "8px 14px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white" }}>JOIN →</p>
            </div>
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", gap: 7, padding: "14px 16px 0", overflowX: "auto", scrollbarWidth: "none" }}>
        {FILTER_OPTS.map(opt => {
          const active = filter === opt.val;
          return (
            <button key={opt.val} onClick={() => setFilter(opt.val)} style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
              padding: "7px 12px", borderRadius: 999, border: "none", cursor: "pointer",
              background: active ? PINK : "rgba(0,0,0,0.06)", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 11 }}>{opt.emoji}</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: active ? "white" : "#888" }}>{opt.label}</p>
            </button>
          );
        })}
      </div>

      {posted && (
        <div style={{ margin: "14px 16px 0", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🌸</span>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#16A34A" }}>Your introduction is live! Women in your area can see it now.</p>
        </div>
      )}

      <div style={{ padding: "14px 16px 10px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>
          {filter === "all" ? "ALL INTRODUCTIONS" : `${FILTER_OPTS.find(f => f.val === filter)?.label?.toUpperCase()} INTRODUCTIONS`}
          {!loading && <span style={{ color: PINK }}> · {intros.length}</span>}
        </p>
      </div>

      <div style={{ padding: "0 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,31,125,0.4)" }}>Loading introductions…</p>
          </div>
        ) : intros.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,31,125,0.4)" }}>No introductions yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#ccc", marginTop: 6 }}>Be the first to introduce yourself!</p>
          </div>
        ) : intros.map(intro => (
          <IntroCard key={intro.id} intro={intro} onFlower={handleFlower} />
        ))}
      </div>

      {showPost && (
        <PostIntroSheet
          onClose={() => setShowPost(false)}
          onPost={handlePost}
        />
      )}
    </div>
  );
}
