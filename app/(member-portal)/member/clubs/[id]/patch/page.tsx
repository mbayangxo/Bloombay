"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CrestSVG } from "@/app/components/portal/club-crest-generator";
import type { CrestConfig } from "@/app/components/portal/club-crest-generator";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const GOLD  = "#D4A853";
const PAPER = "#FEFCF7";

const DEFAULT_CREST: CrestConfig = {
  shape: "oval", symbol: "flower", font: "serif",
  colorPrimary: DARK, colorSecondary: PAPER, colorAccent: GOLD,
  showBannerText: true, bannerText: "EST. 2026",
};

interface ClubInfo {
  name: string;
  customization?: {
    crest_shape: string;
    crest_symbol: string;
    crest_color_primary: string;
    crest_color_secondary: string;
    crest_color_accent: string;
  };
  months_in_club?: number;
  days_remaining?: number;
}

export default function PatchOrderPage() {
  const params  = useParams();
  const router  = useRouter();
  const clubId  = params.id as string;

  const [club,       setClub]       = useState<ClubInfo | null>(null);
  const [crest,      setCrest]      = useState<CrestConfig>(DEFAULT_CREST);
  const [eligible,   setEligible]   = useState<boolean | null>(null);
  const [daysLeft,   setDaysLeft]   = useState<number>(0);
  const [existingOrder, setExisting] = useState<{ status: string } | null>(null);

  const [name,    setName]    = useState("");
  const [addr1,   setAddr1]   = useState("");
  const [addr2,   setAddr2]   = useState("");
  const [city,    setCity]    = useState("");
  const [state,   setState]   = useState("");
  const [zip,     setZip]     = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [clubRes, orderRes] = await Promise.all([
        fetch(`/api/clubs/${clubId}/customization`),
        fetch(`/api/clubs/${clubId}/patch-order`),
      ]);

      if (clubRes.ok) {
        const data = await clubRes.json();
        if (data) {
          setClub({ name: data.club_name ?? "Your Club", customization: data });
          if (data.crest_shape) {
            setCrest({
              shape:          data.crest_shape          ?? "oval",
              symbol:         data.crest_symbol         ?? "flower",
              font:           "serif",
              colorPrimary:   data.crest_color_primary  ?? DARK,
              colorSecondary: data.crest_color_secondary ?? PAPER,
              colorAccent:    data.crest_color_accent   ?? GOLD,
              showBannerText: true,
              bannerText:     "EST. 2026",
            });
          }
        }
      }

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData) setExisting(orderData);
      }

      // Check tenure via a simple membership check
      const membershipRes = await fetch(`/api/clubs/${clubId}/membership`);
      if (membershipRes.ok) {
        const m = await membershipRes.json();
        const months = m?.months_in_club ?? 0;
        setEligible(months >= 3);
        if (months < 3) setDaysLeft(Math.ceil((3 - months) * 30));
      } else {
        setEligible(false);
      }
    }
    load();
  }, [clubId]);

  async function handleOrder() {
    if (!name || !addr1 || !city || !state || !zip) {
      setError("Please fill in all required shipping fields.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/clubs/${clubId}/patch-order`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recipient_name: name, address_line1: addr1, address_line2: addr2, city, state, zip }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Done state ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ minHeight: "100svh", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <CrestSVG config={crest} clubName={club?.name ?? "Club"} size={140} />
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: DARK, margin: "28px 0 12px" }}>
          Your patch is ordered. ✦
        </h2>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, color: "#666", lineHeight: 1.6, maxWidth: 300 }}>
          It'll arrive within 2–3 weeks. Wear it well.
        </p>
        <button onClick={() => router.back()} style={{ marginTop: 32, padding: "14px 32px", borderRadius: "100px", border: "none", background: PINK, color: "white", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          Back to club →
        </button>
      </div>
    );
  }

  // ── Existing order ────────────────────────────────────────────────────────
  if (existingOrder) {
    const statusLabel: Record<string, string> = {
      pending:       "Order received",
      confirmed:     "Confirmed",
      in_production: "Being made",
      shipped:       "On its way ✦",
      delivered:     "Delivered",
    };
    return (
      <div style={{ minHeight: "100svh", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <CrestSVG config={crest} clubName={club?.name ?? "Club"} size={130} />
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: DARK, margin: "24px 0 10px" }}>You already ordered your patch.</h2>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, color: "#888" }}>Status: <strong style={{ color: PINK }}>{statusLabel[existingOrder.status] ?? existingOrder.status}</strong></p>
        <button onClick={() => router.back()} style={{ marginTop: 28, padding: "14px 32px", borderRadius: "100px", border: "none", background: PINK, color: "white", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          Back to club
        </button>
      </div>
    );
  }

  // ── Not eligible yet ──────────────────────────────────────────────────────
  if (eligible === false) {
    return (
      <div style={{ minHeight: "100svh", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <CrestSVG config={crest} clubName={club?.name ?? "Club"} size={130} />
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: DARK, margin: "24px 0 10px" }}>Almost earned. ✦</h2>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, color: "#666", lineHeight: 1.6, maxWidth: 300 }}>
          Patches are earned after 3 months in a club. You're <strong style={{ color: PINK }}>{daysLeft} days away</strong> from yours.
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#aaa", marginTop: 16 }}>Keep showing up. The crest will be waiting. — Yande ✦</p>
        <button onClick={() => router.back()} style={{ marginTop: 28, padding: "14px 32px", borderRadius: "100px", border: "none", background: PINK, color: "white", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Back</button>
      </div>
    );
  }

  // ── Order form ────────────────────────────────────────────────────────────
  const input: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: 14,
    border: "1.5px solid #E0D8CF", background: "white",
    fontFamily: "var(--font-jost)", fontSize: 15, color: DARK,
    outline: "none", boxSizing: "border-box",
  };
  const label: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-jost)", fontSize: 11,
    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#888", marginBottom: 8,
  };

  return (
    <div style={{ minHeight: "100svh", background: PAPER, paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 32px", textAlign: "center", borderBottom: "1px solid #F0EBE3" }}>
        <CrestSVG config={crest} clubName={club?.name ?? "Club"} size={150} />
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: DARK, margin: "24px 0 8px" }}>
          Order your patch. ✦
        </h1>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#888", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
          You've earned it. Your {club?.name ?? "club"} crest, embroidered and delivered to your door. 2–3 weeks.
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: "28px 24px" }}>
        {error && (
          <div style={{ padding: "14px 16px", background: "#FFE0EE", borderRadius: 12, marginBottom: 20, fontFamily: "var(--font-jost)", fontSize: 14, color: "#C00055" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={label}>Full name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Maya Johnson" style={input} />
          </div>
          <div>
            <label style={label}>Address *</label>
            <input value={addr1} onChange={e => setAddr1(e.target.value)} placeholder="123 Bloom Street" style={input} />
          </div>
          <div>
            <label style={label}>Apt, suite, etc.</label>
            <input value={addr2} onChange={e => setAddr2(e.target.value)} placeholder="Apt 4B" style={input} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div>
              <label style={label}>City *</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="New York" style={input} />
            </div>
            <div>
              <label style={label}>State *</label>
              <input value={state} onChange={e => setState(e.target.value)} placeholder="NY" style={input} />
            </div>
          </div>
          <div>
            <label style={label}>ZIP *</label>
            <input value={zip} onChange={e => setZip(e.target.value)} placeholder="10001" style={{ ...input, maxWidth: 160 }} />
          </div>
        </div>

        <div style={{ marginTop: 12, padding: "14px 16px", background: "#FFF8EE", borderRadius: 14, border: `1px solid ${GOLD}33` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#886600", margin: 0 }}>
            ✦ Complimentary for members who've been here 3+ months. No charge.
          </p>
        </div>

        <button
          onClick={handleOrder}
          disabled={submitting}
          style={{
            width: "100%", marginTop: 28, padding: "18px", borderRadius: "100px",
            border: "none", background: submitting ? "#FFB6D0" : PINK,
            color: "white", fontFamily: "var(--font-jost)", fontWeight: 700,
            fontSize: 15, cursor: submitting ? "default" : "pointer", letterSpacing: "0.04em",
          }}
        >
          {submitting ? "Placing order…" : "Order my patch →"}
        </button>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#bbb", textAlign: "center", marginTop: 20, lineHeight: 1.5 }}>
          "Your people are already here. They're just looking for you too." — Yande ✦
        </p>
      </div>
    </div>
  );
}
