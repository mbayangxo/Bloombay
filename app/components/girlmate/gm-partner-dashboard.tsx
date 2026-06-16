"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PINK  = "#FF1F7D";
const IVORY = "#fdf4ec";
const INK   = "#111111";

interface PartnerApp {
  id: string;
  contact_name: string;
  email: string;
  group_name: string;
  platform: string;
  group_size: string;
  cities: string[];
  status: string;
  partner_code: string | null;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, color: "rgba(0,0,0,0.3)", letterSpacing: "0.15em", marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 32, color: PINK, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.35)", marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

export function GMPartnerDashboard() {
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerApp | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/girlmate/login"); return; }

      // Find partner application by email
      const res = await fetch(`/api/girlmate/partner?email=${encodeURIComponent(user.email ?? "")}`);
      if (res.ok) {
        const apps = await res.json() as PartnerApp[];
        const approved = apps.find((a: PartnerApp) => a.status === "approved");
        setPartner(approved ?? null);
      }
      setLoading(false);
    });
  }, [router]);

  function copyRefLink() {
    if (!partner?.partner_code) return;
    const url = `${window.location.origin}/girlmate?ref=${partner.partner_code}`;
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: IVORY, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(0,0,0,0.3)" }}>Loading…</p>
      </div>
    );
  }

  if (!partner) {
    return (
      <div style={{ minHeight: "100vh", background: IVORY, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>💌</p>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: INK, marginBottom: 8 }}>Not a partner yet.</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "rgba(0,0,0,0.45)", marginBottom: 24, maxWidth: 320 }}>
          Apply to become a GirlMate housing partner. We'll review your community within 48 hours.
        </p>
        <Link href="/girlmate/partner" style={{ background: PINK, color: "white", fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 14, padding: "13px 28px", borderRadius: 99, textDecoration: "none" }}>
          Apply to become a partner →
        </Link>
        <Link href="/girlmate/home" style={{ marginTop: 16, fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.35)", textDecoration: "none" }}>
          ← Back to GirlMate
        </Link>
      </div>
    );
  }

  const refUrl = partner.partner_code ? `${typeof window !== "undefined" ? window.location.origin : "https://girlmate.app"}/girlmate?ref=${partner.partner_code}` : null;

  return (
    <div style={{ minHeight: "100vh", background: IVORY, color: INK }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 18, color: INK }}>GirlMate</p>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, color: PINK, background: "rgba(255,31,125,0.1)", borderRadius: 99, padding: "2px 8px", letterSpacing: "0.1em" }}>PARTNER</span>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.35)" }}>{partner.group_name}</p>
        </div>
        <Link href="/girlmate/home" style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", textDecoration: "none" }}>← My listings</Link>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 6 }}>PARTNER DASHBOARD</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 28, color: INK, lineHeight: 1.1 }}>
            Welcome, {partner.contact_name.split(" ")[0]}.
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(0,0,0,0.45)", marginTop: 6 }}>
            {partner.group_name} · {partner.platform} · {partner.group_size} members
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
          <StatCard label="REFERRALS" value={String(memberCount)} sub="Total sign-ups via your link" />
          <StatCard label="CITIES" value={String(partner.cities?.length ?? 1)} sub="Your housing markets" />
          <StatCard label="STATUS" value="✦" sub="Approved partner" />
        </div>

        {/* Referral link */}
        {refUrl && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(0,0,0,0.07)", marginBottom: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: PINK, marginBottom: 10 }}>YOUR REFERRAL LINK</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: 12 }}>
              Share this with your community. Every signup via this link is tracked to your group.
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 12, padding: "12px 14px", overflow: "hidden" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{refUrl}</p>
              </div>
              <button
                onClick={copyRefLink}
                style={{ flexShrink: 0, background: copied ? "#22c55e" : PINK, color: "white", border: "none", borderRadius: 12, padding: "12px 18px", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "background 0.2s" }}
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* How to use */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(0,0,0,0.07)", marginBottom: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: PINK, marginBottom: 12 }}>HOW TO USE YOUR PARTNERSHIP</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { step: "01", text: "Share your referral link in your group when members ask about housing." },
              { step: "02", text: "Women who sign up via your link get a 'verified community member' badge." },
              { step: "03", text: "Post a GirlMate listing yourself — your group name will appear as the source." },
              { step: "04", text: "Track referrals above. We'll send a monthly digest to " + partner.email + "." },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 18, color: PINK, lineHeight: 1.2, flexShrink: 0, width: 28 }}>{step}</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.55 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Post listing for community */}
        <Link href="/girlmate/post" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ background: PINK, borderRadius: 18, padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>ADD A LISTING</p>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, color: "white" }}>Post a housing listing</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>Represent your community with a vetted listing.</p>
            </div>
            <p style={{ fontSize: 28, flexShrink: 0 }}>🏡</p>
          </div>
        </Link>

        {/* Cities covered */}
        {(partner.cities?.length ?? 0) > 0 && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(0,0,0,0.07)", marginTop: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: PINK, marginBottom: 12 }}>YOUR CITIES</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(partner.cities ?? []).map(c => (
                <span key={c} style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)", background: "rgba(255,31,125,0.07)", borderRadius: 99, padding: "6px 14px", border: "1px solid rgba(255,31,125,0.15)" }}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
