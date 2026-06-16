"use client";

import { useState } from "react";

const PINK = "#FF1F7D";
const PLUM = "#1A0A2E";

const PLANS = [
  {
    id: "monthly" as const,
    label: "Monthly",
    price: "£9",
    per: "/ month",
    desc: "Full access. Cancel anytime.",
    badge: null,
  },
  {
    id: "biannual" as const,
    label: "6 Months",
    price: "£44",
    per: "/ 6 months",
    desc: "Half-year commitment. Save £10.",
    badge: null,
  },
  {
    id: "annual" as const,
    label: "Annual",
    price: "£79",
    per: "/ year",
    desc: "Save £29 — that's 2 months free.",
    badge: "BEST VALUE",
  },
];

const PERKS = [
  { icon: "✦", text: "Access to every gathering & ticketed event" },
  { icon: "♡", text: "Join any club on The Avenue" },
  { icon: "◦", text: "BloomBay Matchmaking — find your Bloomies" },
  { icon: "✦", text: "The Hanger, Book Club, Bloom Trips & more" },
  { icon: "♡", text: "Early access to new cities and features" },
  { icon: "◦", text: "Founding member pricing locked in forever" },
];

export default function UpgradePage() {
  const [selected, setSelected] = useState<"monthly" | "biannual" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "membership", plan: selected }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, #FFF5F8 0%, #FFF0F5 40%, #F8F0FF 100%)`, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "48px 24px 0", maxWidth: 480, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: PINK, letterSpacing: "0.18em", marginBottom: 8 }}>
          BLOOMBAY MEMBERSHIP
        </p>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 34, color: PLUM, lineHeight: 1.15, marginBottom: 10 }}>
          Your table is here.
        </h1>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#666", lineHeight: 1.6 }}>
          Join thousands of women gathering, connecting, and building a life they love.
        </p>
      </div>

      {/* Perks */}
      <div style={{ maxWidth: 480, margin: "32px auto 0", padding: "0 24px" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "20px 20px", boxShadow: "0 2px 20px rgba(255,31,125,0.06)" }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < PERKS.length - 1 ? "1px solid #FFF0F5" : "none" }}>
              <span style={{ color: PINK, fontSize: 14, flexShrink: 0, width: 16, textAlign: "center" }}>{p.icon}</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#333", fontWeight: 500 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan selector */}
      <div style={{ maxWidth: 480, margin: "28px auto 0", padding: "0 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "#aaa", letterSpacing: "0.14em", marginBottom: 14 }}>
          CHOOSE YOUR PLAN
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                width: "100%", textAlign: "left", padding: "18px 20px",
                borderRadius: 16, border: `2px solid ${selected === plan.id ? PINK : "#EEE"}`,
                background: selected === plan.id ? "rgba(255,31,125,0.04)" : "white",
                cursor: "pointer", position: "relative",
                boxShadow: selected === plan.id ? "0 0 0 3px rgba(255,31,125,0.1)" : "none",
                transition: "all 0.15s",
              }}
            >
              {plan.badge && (
                <span style={{
                  position: "absolute", top: -10, right: 16,
                  background: PINK, color: "white",
                  fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                  padding: "3px 10px", borderRadius: 99,
                }}>
                  {plan.badge}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 3 }}>{plan.label}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888" }}>{plan.desc}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, color: selected === plan.id ? PINK : "#111", fontWeight: 900 }}>{plan.price}</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", marginLeft: 2 }}>{plan.per}</span>
                </div>
              </div>
              {/* Radio indicator */}
              <div style={{
                position: "absolute", top: 18, left: -8,
                width: 16, height: 16, borderRadius: "50%",
                border: `2px solid ${selected === plan.id ? PINK : "#DDD"}`,
                background: selected === plan.id ? PINK : "white",
                display: "none", // hidden — border on card is enough
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 480, margin: "28px auto 0", padding: "0 24px" }}>
        {error && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", marginBottom: 12, textAlign: "center" }}>
            {error}
          </p>
        )}
        <button
          onClick={() => void handleCheckout()}
          disabled={loading}
          style={{
            width: "100%", padding: "18px", borderRadius: 999,
            background: loading ? "rgba(255,31,125,0.5)" : PINK,
            color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 800,
            boxShadow: "0 6px 24px rgba(255,31,125,0.35)",
            transition: "all 0.15s",
          }}
        >
          {loading ? "Taking you to checkout…" : `Join — ${selected === "annual" ? "£79 / year" : selected === "biannual" ? "£44 / 6 months" : "£9 / month"} →`}
        </button>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
          Secure payment via Stripe. Cancel anytime. No hidden fees.
        </p>
      </div>

      {/* Testimonial */}
      <div style={{ maxWidth: 480, margin: "32px auto 0", padding: "0 24px" }}>
        <div style={{ background: PLUM, borderRadius: 20, padding: "24px 20px" }}>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 18, color: "white", lineHeight: 1.5, marginBottom: 12 }}>
            &ldquo;BloomBay is the first place I&apos;ve felt like I belong in a new city. I made my three best friends here.&rdquo;
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>
            AMARA · LONDON
          </p>
        </div>
      </div>
    </div>
  );
}
