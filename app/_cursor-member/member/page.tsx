"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { BloomBayBrand } from "./components/bloombay-logo";
import { BLOOMBAY_SOCIAL } from "@/lib/social-links";

const CLUB_CARDS = [
  { id: "morning-run-club", name: "Morning Run Club", cat: "Fitness", members: 214, color: "#ff0055" },
  { id: "the-page-turners", name: "The Page Turners", cat: "Books", members: 87, color: "#FF69B4" },
  { id: "wander-women", name: "Wander Women", cat: "Travel", members: 340, color: "#0a0a0a" },
  { id: "after-dark", name: "After Dark", cat: "Nightlife", members: 278, color: "#ff0055" },
  { id: "founders-in-the-making", name: "Founders in the Making", cat: "Entrepreneurship", members: 193, color: "#FF69B4" },
];

export default function MemberLandingPage() {
  const [cardIdx, setCardIdx] = useState(0);

  return (
    <div style={s.page}>
      {/* ── Background ── */}
      <div style={s.bg} />
      <div style={s.bgAccent} />

      {/* ── Header ── */}
      <header style={s.header}>
        <BloomBayBrand height={32} href="/member" variant="pink" />
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <a href="/" style={s.waitlistLink}>Join waitlist</a>
        <a href="/member/login" style={s.signInBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          Sign in
        </a>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={s.main}>

        {/* Left — editorial copy */}
        <div style={s.left}>
          <motion.p style={s.eyebrow}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}>
            The social world for women
          </motion.p>

          <motion.h1 style={s.headline}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}>
            Where<br />you<br /><em style={s.bloom}>bloom.</em>
          </motion.h1>

          <motion.p style={s.copy}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22 }}>
            Clubs, gatherings, and real‑life connection —
            built by women, for women, across the world.
          </motion.p>

          {/* Stats */}
          <motion.div style={s.statsRow}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}>
            {[["10+", "cities"], ["2K+", "women"], ["40+", "clubs"]].map(([v, l]) => (
              <div key={l} style={s.stat}>
                <span style={s.statVal}>{v}</span>
                <span style={s.statLabel}>{l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — rotating club cards */}
        <motion.div style={s.right}
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}>

          <div style={s.cardTrack}>
            <AnimatePresence mode="wait">
              <motion.div key={cardIdx} style={s.card}
                initial={{ opacity: 0, y: 20, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}>
                <div style={{ ...s.cardDot, background: CLUB_CARDS[cardIdx].color }} />
                <p style={s.cardCat}>{CLUB_CARDS[cardIdx].cat}</p>
                <p style={s.cardName}>{CLUB_CARDS[cardIdx].name}</p>
                <p style={s.cardMembers}>{CLUB_CARDS[cardIdx].members} members</p>
                <div style={s.cardAvatars}>
                  {["Z","P","M","A"].map((l, i) => (
                    <div key={i} style={{ ...s.avatar, background: i % 2 === 0 ? "#ff0055" : "#FF69B4", marginLeft: i === 0 ? 0 : -8 }}>
                      {l}
                    </div>
                  ))}
                </div>
                <Link href={`/member/clubs/${CLUB_CARDS[cardIdx].id}`} style={s.cardJoinBtn}>
                  Enter club →
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Card nav dots */}
            <div style={s.dots}>
              {CLUB_CARDS.map((_, i) => (
                <button key={i} style={{ ...s.dot, ...(i === cardIdx ? s.dotActive : {}) }}
                  onClick={() => setCardIdx(i)} />
              ))}
            </div>
          </div>

          {/* Floating tag bubbles */}
          <div style={{ ...s.bubble, top: "-12px", right: "20px" }}>✦ Fitness</div>
          <div style={{ ...s.bubble, bottom: "60px", left: "-20px", background: "#0a0a0a", color: "#FF69B4" }}>Books 📚</div>
          <div style={{ ...s.bubble, top: "50%", right: "-24px", background: "#FF69B4", color: "#fff" }}>Travel ✈️</div>
        </motion.div>
      </main>

      {/* ── Bottom bar ── */}
      <footer style={s.footer}>
        <div style={s.footerLeft}>
          <motion.a href="/member/join" style={s.joinBtn}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Join Bloombay
          </motion.a>
          <motion.a href="/member/login" style={s.signinBtn}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.46 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Sign in
          </motion.a>
        </div>

        {/* Social icons — BIG */}
        <motion.div style={s.socials}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.52 }}>
          <a href={BLOOMBAY_SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={s.socialLink} aria-label="Instagram"><InstagramIcon /></a>
          <a href={BLOOMBAY_SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" style={s.socialLink} aria-label="TikTok"><TikTokIcon /></a>
          <a href={BLOOMBAY_SOCIAL.x} target="_blank" rel="noopener noreferrer" style={s.socialLink} aria-label="X"><XIcon /></a>
        </motion.div>
      </footer>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.53V6.79a4.86 4.86 0 0 1-1.02-.1z"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh", position: "relative",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
  },
  bg: {
    position: "absolute", inset: 0,
    background: "linear-gradient(150deg, #ff0055 0%, #ff3d7f 35%, #FF69B4 70%, #ffb3d4 100%)",
    zIndex: 0,
  },
  bgAccent: {
    position: "absolute",
    width: "600px", height: "600px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    top: "-200px", right: "-180px",
    zIndex: 1,
  },

  header: {
    position: "relative", zIndex: 10,
    padding: "28px 32px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: "4px",
  },
  logoBlack: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700,
    color: "#0a0a0a", letterSpacing: "-0.04em",
  },
  logoWhite: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700,
    color: "#ffffff", letterSpacing: "-0.04em",
  },
  logoMark: {
    color: "#ffffff", fontSize: "22px", marginLeft: "6px",
    textShadow: "0 0 12px rgba(255,255,255,0.6)",
  },
  signInBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "14px", fontWeight: 700,
    color: "#ff0055", background: "#ffffff",
    padding: "10px 22px", borderRadius: "100px",
    textDecoration: "none", letterSpacing: "0.02em",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },

  main: {
    position: "relative", zIndex: 5,
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: "20px 32px 0",
    gap: "32px",
    flexWrap: "wrap" as const,
  },
  left: {
    flex: 1, minWidth: "260px",
    display: "flex", flexDirection: "column", gap: "20px",
  },
  eyebrow: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "12px", fontWeight: 700,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.18em", textTransform: "uppercase", margin: 0,
  },
  headline: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "clamp(48px, 9vw, 88px)", fontWeight: 700,
    color: "#ffffff", margin: 0,
    letterSpacing: "-0.045em", lineHeight: 0.95,
    textShadow: "0 4px 32px rgba(0,0,0,0.1)",
  },
  bloom: {
    fontStyle: "italic", fontWeight: 300,
    color: "#0a0a0a",
    textShadow: "none",
  },
  copy: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "16px", fontWeight: 300,
    color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.7,
    maxWidth: "380px",
  },
  statsRow: {
    display: "flex", gap: "28px", flexWrap: "wrap" as const,
  },
  stat: {
    display: "flex", flexDirection: "column", gap: "2px",
  },
  statVal: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "24px", fontWeight: 700, color: "#ffffff",
    letterSpacing: "-0.03em",
  },
  statLabel: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "11px", fontWeight: 500,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase", letterSpacing: "0.1em",
  },

  right: {
    position: "relative",
    width: "300px", flexShrink: 0,
  },
  cardTrack: {
    display: "flex", flexDirection: "column", gap: "16px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
    display: "flex", flexDirection: "column", gap: "8px",
    minHeight: "220px",
  },
  cardDot: {
    width: "10px", height: "10px", borderRadius: "50%",
    alignSelf: "flex-start",
  },
  cardCat: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "11px", fontWeight: 700,
    color: "#FF69B4", margin: 0,
    textTransform: "uppercase", letterSpacing: "0.1em",
  },
  cardName: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "16px", fontWeight: 700, color: "#0a0a0a",
    margin: 0, letterSpacing: "-0.02em", lineHeight: 1.3,
  },
  cardMembers: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "12px", fontWeight: 400,
    color: "rgba(10,10,10,0.4)", margin: 0,
  },
  cardAvatars: {
    display: "flex", alignItems: "center", marginTop: "4px",
  },
  avatar: {
    width: "28px", height: "28px", borderRadius: "50%",
    border: "2px solid #fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "10px", fontWeight: 700, color: "#ffffff",
  },
  cardJoinBtn: {
    marginTop: "auto",
    background: "#ff0055", border: "none",
    borderRadius: "8px", padding: "9px 16px",
    fontSize: "13px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 700, color: "#ffffff", cursor: "pointer",
    alignSelf: "flex-start", letterSpacing: "0.02em",
    textDecoration: "none",
    display: "inline-block",
  },
  waitlistLink: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "13px", fontWeight: 600,
    color: "#ffffff", textDecoration: "none",
    padding: "10px 16px", borderRadius: "100px",
    border: "1.5px solid rgba(255,255,255,0.45)",
  },
  dots: {
    display: "flex", gap: "6px", justifyContent: "center",
  },
  dot: {
    width: "6px", height: "6px", borderRadius: "50%",
    background: "rgba(255,255,255,0.4)", border: "none", cursor: "pointer",
    padding: 0,
  },
  dotActive: {
    background: "#ffffff", width: "18px", borderRadius: "3px",
  },
  bubble: {
    position: "absolute",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "13px", fontWeight: 700,
    background: "#ffffff", color: "#ff0055",
    padding: "8px 14px", borderRadius: "100px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    whiteSpace: "nowrap" as const,
    letterSpacing: "0.02em",
  },

  footer: {
    position: "relative", zIndex: 10,
    padding: "28px 32px 36px",
    display: "flex", alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "20px",
  },
  footerLeft: {
    display: "flex", gap: "12px", alignItems: "center",
  },
  joinBtn: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "14px", fontWeight: 700,
    background: "#0a0a0a", color: "#ffffff",
    padding: "16px 28px", borderRadius: "100px",
    textDecoration: "none",
    boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
    letterSpacing: "-0.01em",
    display: "inline-block",
  },
  signinBtn: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "14px", fontWeight: 700,
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    color: "#ffffff",
    padding: "16px 28px", borderRadius: "100px",
    textDecoration: "none",
    border: "1.5px solid rgba(255,255,255,0.35)",
    letterSpacing: "-0.01em",
    display: "inline-block",
  },
  socials: {
    display: "flex", gap: "24px", alignItems: "center",
  },
  socialLink: {
    color: "rgba(255,255,255,0.85)", textDecoration: "none",
    display: "flex", alignItems: "center",
    transition: "color 0.2s, transform 0.2s",
  },
};
