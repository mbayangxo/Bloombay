"use client";

import { useState } from "react";
import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";

const PINK  = "#FF1F7D";
const INK   = "#111111";
const IVORY = "#fdf4ec";

type Platform = "instagram" | "facebook" | "tiktok" | "whatsapp" | "newsletter" | "other";

const PLATFORMS: { id: Platform; label: string; emoji: string; color: string; bg: string; where: string }[] = [
  { id: "instagram", label: "Instagram",     emoji: "📸", color: "#E1306C", bg: "#FFF0F5", where: "IG community / close friends" },
  { id: "facebook",  label: "Facebook Group", emoji: "👥", color: "#1877F2", bg: "#F0F5FF", where: "Facebook group" },
  { id: "tiktok",    label: "TikTok",         emoji: "🎵", color: "#010101", bg: "#F5F5F5", where: "TikTok audience" },
  { id: "whatsapp",  label: "WhatsApp",        emoji: "💬", color: "#25D366", bg: "#F0FFF4", where: "WhatsApp group" },
  { id: "newsletter",label: "Newsletter / Site",emoji: "✉️", color: "#8B5CF6", bg: "#F5F0FF", where: "email list or website" },
  { id: "other",     label: "Something else",  emoji: "✦",  color: PINK,      bg: "#FFF0F5", where: "your community" },
];

const ONBOARDING: Record<Platform, { title: string; steps: { action: string; detail: string }[] }> = {
  instagram: {
    title: "Bring your IG community to BloomBay",
    steps: [
      { action: "Apply as a Club Owner", detail: "Tell us about your community — we'll set up your club in 24 hours." },
      { action: "Add your club link to your bio", detail: "Your personal BloomBay club URL goes in your IG bio. Women tap once to join." },
      { action: "Post a story announcement", detail: "We'll give you ready-to-post story templates. One swipe up and they're in." },
      { action: "Your community moves with you", detail: "Your followers join your club, RSVP to your events, and find each other in the app." },
    ],
  },
  facebook: {
    title: "Move your Facebook group to BloomBay",
    steps: [
      { action: "Apply as a Club Owner", detail: "We review your group, set up your BloomBay club, and migrate the vibe — not just the names." },
      { action: "Pin an announcement post", detail: "We write the post for you. Pin it. Your members know where to go." },
      { action: "Share your club link in the group", detail: "One link. They click, they join. No onboarding friction." },
      { action: "Keep running both for 30 days", detail: "Let your community settle in before you sunset the FB group. We'll guide the transition." },
    ],
  },
  tiktok: {
    title: "Turn your TikTok audience into a real community",
    steps: [
      { action: "Apply as a Club Owner", detail: "Your audience already knows you. BloomBay gives them a place to meet each other." },
      { action: "Add your club link to your bio", detail: "One tap from your TikTok bio directly into your club." },
      { action: "Post a video announcing the move", detail: "We'll give you a script. Your audience converts because they trust you." },
      { action: "Host your first IRL event", detail: "Your followers finally meet — and BloomBay handles all the logistics." },
    ],
  },
  whatsapp: {
    title: "Give your WhatsApp group a real home",
    steps: [
      { action: "Apply as a Club Owner", detail: "WhatsApp groups get chaotic. BloomBay gives your community structure and events." },
      { action: "Share your club link in the chat", detail: "Drop the link. Women join in one tap. No app download required to RSVP." },
      { action: "Move events and planning to BloomBay", detail: "Stop coordinating in thread. Events, RSVPs, and attendance all in one place." },
      { action: "Keep WhatsApp for casual chat", detail: "They work together. BloomBay for plans, WhatsApp for the fun stuff." },
    ],
  },
  newsletter: {
    title: "Bring your readers into a real room",
    steps: [
      { action: "Apply as a Club Owner", detail: "Your readers already love your voice. A club gives them a place to connect with each other." },
      { action: "Dedicate one email to the launch", detail: "We write the copy. You send it. Your readers join your club in one click." },
      { action: "Add the club link to your site and every email footer", detail: "Passive discovery — readers find you on their own timeline." },
      { action: "Host your first reader meetup", detail: "The event every newsletter writer wants to throw. BloomBay makes it easy." },
    ],
  },
  other: {
    title: "Whatever you've built, bring it here",
    steps: [
      { action: "Apply as a Club Owner", detail: "Tell us about your community. We'll figure out the right onboarding path together." },
      { action: "We'll set up your club", detail: "Your club is live in 24 hours. Customized for how your community actually works." },
      { action: "Share your club link wherever your community is", detail: "One link works everywhere — IG, Twitter, Reddit, Discord, email, anywhere." },
      { action: "We support the transition", detail: "You don't have to figure this out alone. We've done this before." },
    ],
  },
};

export default function GroupsPage() {
  const [selected, setSelected] = useState<Platform | null>(null);
  const plan = selected ? ONBOARDING[selected] : null;

  return (
    <div style={{ minHeight: "100vh", background: IVORY, fontFamily: "var(--font-jost)" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253,244,236,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ecddd4" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 22px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <BBLogo size={26} />
            <span style={{ fontWeight: 900, fontSize: "12px", letterSpacing: "0.2em", color: INK }}>BLOOMBAY</span>
          </Link>
          <Link href="/start-a-club" style={{ padding: "8px 20px", borderRadius: 999, background: PINK, color: "white", fontSize: "10px", fontWeight: 900, letterSpacing: "0.12em", textDecoration: "none" }}>
            APPLY NOW
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: INK, padding: "72px 22px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>✦ FOR GROUP OWNERS · BLOOMBAY</p>
          <h1 style={{ margin: "0 0 16px", lineHeight: 0.9 }}>
            <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(38px, 8vw, 72px)", color: "white", letterSpacing: "-0.02em" }}>Your group deserves</span>
            <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(38px, 8vw, 72px)", color: PINK, letterSpacing: "-0.03em", lineHeight: 0.88 }}>a real home.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "clamp(15px, 2.5vw, 20px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginTop: 20, maxWidth: 520 }}>
            Facebook groups get chaotic. Instagram DMs get lost. WhatsApp threads go quiet.
            BloomBay gives your community a structured, beautiful, IRL-first home.
          </p>
        </div>
      </section>

      {/* Question: Where is your community? */}
      <section style={{ padding: "60px 22px", background: IVORY }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 10 }}>STEP 1</p>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(22px, 4vw, 34px)", color: INK, marginBottom: 6, lineHeight: 1.1 }}>
            Where is your community right now?
          </h2>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", color: "#999", fontSize: "16px", marginBottom: 32 }}>
            We&apos;ll show you exactly how to bring them in.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {PLATFORMS.map(p => {
              const active = selected === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{
                    padding: "18px 14px", borderRadius: 18, border: active ? `2px solid ${p.color}` : "2px solid #ecddd4",
                    background: active ? p.bg : "white", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s", boxShadow: active ? `0 4px 20px ${p.color}22` : "none",
                  }}
                >
                  <span style={{ fontSize: 26, display: "block", marginBottom: 10 }}>{p.emoji}</span>
                  <p style={{ fontWeight: 800, fontSize: "12px", color: active ? p.color : INK, lineHeight: 1.2 }}>{p.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Onboarding plan — shown after selection */}
      {plan && selected && (
        <section style={{ padding: "8px 22px 64px", background: IVORY }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>

            <div style={{ borderRadius: 24, background: INK, padding: "36px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${PLATFORMS.find(p => p.id === selected)?.color ?? PINK}33 0%, transparent 70%)`, pointerEvents: "none" }} />
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.24em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>YOUR ONBOARDING PLAN · STEP 2</p>
              <h3 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 4vw, 30px)", color: "white", lineHeight: 1.2, margin: "0 0 28px", position: "relative" }}>
                {plan.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
                {plan.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontWeight: 900, fontSize: "11px", color: "white" }}>{i + 1}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: "13px", color: "white", marginBottom: 3 }}>{step.action}</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ borderRadius: 20, background: `linear-gradient(135deg,${PINK},#c4005a)`, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16, boxShadow: `0 12px 40px ${PINK}44` }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>READY?</p>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px, 3vw, 26px)", color: "white", lineHeight: 1.2 }}>
                  Apply as a Club Owner. We&apos;ll have your community set up within 24 hours.
                </p>
              </div>
              <Link href="/start-a-club" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 999, background: "white", color: PINK, fontWeight: 900, fontSize: "12px", letterSpacing: "0.12em", textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                APPLY NOW
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Social proof — why it works */}
      {!selected && (
        <section style={{ padding: "8px 22px 80px", background: IVORY }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { stat: "24h", label: "Your club is live", note: "We set it up. You focus on your community." },
                { stat: "1 link", label: "To onboard everyone", note: "Works on every platform. No friction." },
                { stat: "IRL first", label: "Real gatherings", note: "Events, RSVPs, and attendance all handled." },
              ].map(item => (
                <div key={item.stat} style={{ padding: "24px 20px", borderRadius: 18, background: "white", border: "1px solid #ecddd4" }}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "36px", color: PINK, lineHeight: 1, marginBottom: 6 }}>{item.stat}</p>
                  <p style={{ fontWeight: 800, fontSize: "12px", color: INK, marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: "12px", color: "#aaa", lineHeight: 1.5 }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer strip */}
      <div style={{ background: INK, padding: "32px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "18px", color: "white" }}>Questions? We answer fast.</p>
          <a href="mailto:hello@bloombay.co" style={{ fontSize: "13px", color: PINK, textDecoration: "none", fontWeight: 600 }}>hello@bloombay.co</a>
        </div>
        <Link href="/start-a-club" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 999, background: PINK, color: "white", fontWeight: 900, fontSize: "11px", letterSpacing: "0.12em", textDecoration: "none" }}>
          APPLY AS CLUB OWNER →
        </Link>
      </div>

    </div>
  );
}
