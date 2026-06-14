"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";
const IVORY = "#fdf4ec";
const INK   = "#111111";

// ── Types ─────────────────────────────────────────────────────────────────────
type ListingType = "room" | "apartment" | "roommate-wanted" | "co-search";

interface PublicListing {
  id: string;
  listing_type: ListingType;
  city: string;
  neighborhood_name: string | null;
  price_cents: number | null;
  available_from: string | null;
  available_to: string | null;
  furnished: boolean;
  private_bathroom: boolean;
  pets: boolean;
  weed_ok: boolean;
  halal_kitchen: boolean;
  wfh_friendly: boolean;
  description: string | null;
  display_name: string | null;
  lifestyle_tags: string[] | null;
  profile: { id: string; first_name: string | null; full_name: string | null } | null;
}

const LISTING_LABEL: Record<ListingType, string> = {
  "room":            "Room Available",
  "apartment":       "Full Apartment",
  "roommate-wanted": "Looking for Roommate",
  "co-search":       "Co-Searching",
};

const CITIES = ["New York City", "London", "Los Angeles", "Atlanta", "Chicago"];

// ── GirlMate logo ────────────────────────────────────────────────────────────
function GMLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="GirlMate">
      {/* circle with a small heart inside */}
      <circle cx="16" cy="14" r="10" stroke={PINK} strokeWidth="2.2" />
      <path d="M12 13.5c0-1.5 1.2-2.5 2.5-2.5.8 0 1.4.4 1.8.9.4-.5 1-.9 1.8-.9 1.3 0 2.4 1 2.4 2.5 0 1.8-2 3.5-4.2 4.8-2.2-1.3-4.3-3-4.3-4.8z" fill={PINK} />
      <line x1="16" y1="24" x2="16" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="29" x2="20" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// ── Listing card ─────────────────────────────────────────────────────────────
function ListingCard({ listing, idx }: { listing: PublicListing; idx: number }) {
  const price = listing.price_cents ? `$${Math.round(listing.price_cents / 100).toLocaleString()}/mo` : null;
  const firstName = listing.display_name ?? listing.profile?.first_name ?? "A member";
  const colors = ["#FF1F7D", "#C084FC", "#34D399", "#60A5FA", "#F59E0B", "#F87171"];
  const avatarColor = colors[idx % colors.length];

  const tags: string[] = [];
  if (listing.furnished)       tags.push("Furnished");
  if (listing.private_bathroom) tags.push("Private bath");
  if (listing.pets)            tags.push("Pet-friendly");
  if (listing.wfh_friendly)   tags.push("WFH-friendly");
  if (listing.halal_kitchen)   tags.push("Halal kitchen");
  if (listing.weed_ok)         tags.push("420-ok");

  return (
    <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #f0e8e0" }}>
      {/* Color band */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${avatarColor}, ${PINK})` }} />

      <div style={{ padding: "18px 18px 16px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div>
            <span style={{ display: "inline-block", fontSize: "9px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, background: "#FFE8F1", padding: "3px 9px", borderRadius: 999, marginBottom: 6 }}>
              {LISTING_LABEL[listing.listing_type]}
            </span>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "14px", color: INK, lineHeight: 1.2 }}>
              {listing.neighborhood_name ?? listing.city}
            </p>
            <p style={{ fontSize: "11px", color: "#aaa", marginTop: 2 }}>{listing.city}</p>
          </div>
          {price && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontWeight: 900, fontSize: "17px", color: INK, lineHeight: 1 }}>{price}</p>
              <p style={{ fontSize: "10px", color: "#bbb", marginTop: 2 }}>per month</p>
            </div>
          )}
        </div>

        {/* Description */}
        {listing.description && (
          <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.55, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {listing.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
            {tags.slice(0, 4).map(tag => (
              <span key={tag} style={{ fontSize: "9px", fontWeight: 700, color: "#888", background: "#f5f5f5", padding: "3px 8px", borderRadius: 999, letterSpacing: "0.06em" }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #f5f0eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 800, fontSize: "11px" }}>{firstName[0].toUpperCase()}</span>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: INK }}>{firstName}</p>
              {listing.available_from && (
                <p style={{ fontSize: "10px", color: "#bbb" }}>From {listing.available_from}</p>
              )}
            </div>
          </div>
          {/* Locked match score — teaser for sign-up */}
          <Link href="/girlmate/signup" style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, background: "#FFF0F5", border: `1px solid ${PINK}20`, textDecoration: "none" }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="3" y="6" width="8" height="7" rx="1.5" stroke={PINK} strokeWidth="1.4" /><path d="M5 6V4.5a2 2 0 014 0V6" stroke={PINK} strokeWidth="1.4" strokeLinecap="round" /></svg>
            <span style={{ fontSize: "9px", fontWeight: 800, color: PINK, letterSpacing: "0.06em" }}>SEE MATCH</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #f0e8e0" }}>
      <div style={{ height: 6, background: "#f0e0e8" }} />
      <div style={{ padding: "18px 18px 16px" }}>
        <div style={{ height: 10, width: "40%", background: "#f5f0eb", borderRadius: 999, marginBottom: 10 }} />
        <div style={{ height: 16, width: "70%", background: "#f5f0eb", borderRadius: 8, marginBottom: 6 }} />
        <div style={{ height: 11, width: "50%", background: "#f5f0eb", borderRadius: 8, marginBottom: 14 }} />
        <div style={{ height: 11, width: "90%", background: "#f5f0eb", borderRadius: 8, marginBottom: 5 }} />
        <div style={{ height: 11, width: "75%", background: "#f5f0eb", borderRadius: 8, marginBottom: 14 }} />
        <div style={{ display: "flex", gap: 5 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 20, width: 64, background: "#f5f0eb", borderRadius: 999 }} />)}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function GirlMatePublicPage() {
  const [city, setCity]         = useState("New York City");
  const [tab, setTab]           = useState<"available" | "looking">("available");
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/girlmate?tab=${tab}&city=${encodeURIComponent(city)}`)
      .then(r => r.json())
      .then((data: PublicListing[] | { error: string }) => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city, tab]);

  return (
    <div style={{ minHeight: "100vh", background: IVORY, fontFamily: "var(--font-jost)" }}>

      <style>{`
        .gm-nav-desktop { display: none; }
        @media (min-width: 768px) { .gm-nav-desktop { display: flex; } }
        .gm-hero-mobile { display: flex; }
        @media (min-width: 768px) { .gm-hero-mobile { display: none; } }
        .gm-hero-desktop { display: none; }
        @media (min-width: 768px) { .gm-hero-desktop { display: flex; } }
      `}</style>

      {/* ── DESKTOP NAV ── */}
      <nav className="gm-nav-desktop" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253,244,236,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ecddd4", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60, gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GMLogo size={28} />
          <span style={{ fontWeight: 900, fontSize: "17px", letterSpacing: "0.06em", color: INK }}>GirlMate</span>
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", color: "#bbb", paddingLeft: 8, borderLeft: "1px solid #e0d8d0" }}>by BloomBay</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/girlmate/partner" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "#888", textDecoration: "none" }}>PARTNERS</Link>
          <Link href="/girlmate/login" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "#888", textDecoration: "none", padding: "7px 16px", border: "1.5px solid #ddd", borderRadius: 999 }}>LOG IN</Link>
          <Link href="/girlmate/signup" style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.1em", color: "white", textDecoration: "none", padding: "9px 20px", borderRadius: 999, background: `linear-gradient(135deg,${PINK},#c4005a)`, boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }}>POST A LISTING</Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          MOBILE HERO
      ══════════════════════════════════════════════════════ */}
      <section className="gm-hero-mobile" style={{ background: PLUM, flexDirection: "column", padding: "0 0 32px" }}>
        {/* Mobile top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GMLogo size={22} />
            <div>
              <p style={{ fontWeight: 900, fontSize: "14px", color: "white", lineHeight: 1 }}>GirlMate</p>
              <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>by BloomBay</p>
            </div>
          </div>
          <Link href="/girlmate/login" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: 999 }}>LOG IN</Link>
        </div>

        {/* Hero copy */}
        <div style={{ padding: "0 20px" }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.32em", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>✦ &nbsp;WOMEN-ONLY · VERIFIED · SAFE</p>

          <h1 style={{ margin: "0 0 14px", lineHeight: 0.9 }}>
            <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 11vw, 52px)", color: "white", lineHeight: 0.95 }}>Find a room</span>
            <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(38px, 12vw, 58px)", color: PINK, lineHeight: 0.88, letterSpacing: "-0.02em" }}>from women</span>
            <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(34px, 10vw, 50px)", color: "rgba(255,255,255,0.65)", lineHeight: 0.95 }}>you can trust.</span>
          </h1>

          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 22 }}>
            Rooms, sublets &amp; roommates — women-only, background-checked, real.
          </p>

          <div style={{ display: "flex", gap: 9 }}>
            <Link href="/girlmate/signup" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "15px 20px", borderRadius: 14, background: PINK, color: "white", fontWeight: 900, fontSize: "12px", letterSpacing: "0.1em", textDecoration: "none", boxShadow: "0 6px 24px rgba(255,31,125,0.4)" }}>
              POST A LISTING
            </Link>
            <a href="#browse" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "15px 20px", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: "12px", letterSpacing: "0.08em", textDecoration: "none" }}>
              BROWSE
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESKTOP HERO
      ══════════════════════════════════════════════════════ */}
      <section className="gm-hero-desktop" style={{ background: PLUM, padding: "72px 32px 64px", alignItems: "center", gap: 48, justifyContent: "center" }}>
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>✦ &nbsp;WOMEN-ONLY · VERIFIED · SAFE</p>
          <h1 style={{ margin: "0 0 20px", lineHeight: 0.9 }}>
            <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(44px,6vw,68px)", color: "white", lineHeight: 0.95 }}>Find a room</span>
            <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(50px,7vw,80px)", color: PINK, lineHeight: 0.85, letterSpacing: "-0.03em" }}>from women</span>
            <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(42px,6vw,66px)", color: "rgba(255,255,255,0.6)", lineHeight: 0.95 }}>you can trust.</span>
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
            Rooms, sublets &amp; roommates — women-only, background-checked, real. No sketchy Craigslist. No Facebook group chaos.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/girlmate/signup" style={{ padding: "15px 32px", borderRadius: 999, fontWeight: 900, fontSize: "12px", letterSpacing: "0.14em", background: PINK, color: "white", textDecoration: "none", boxShadow: "0 6px 24px rgba(255,31,125,0.4)" }}>POST A LISTING</Link>
            <a href="#browse" style={{ padding: "15px 28px", borderRadius: 999, fontWeight: 600, fontSize: "12px", border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Browse listings</a>
          </div>
        </div>

        {/* Right: trust signals */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 280 }}>
          {[
            { icon: "🔒", title: "Women-only", body: "Every poster verified female. Always." },
            { icon: "💜", title: "Real community", body: "BloomBay members with shared clubs and history." },
            { icon: "✦", title: "Yande match", body: "AI matches you based on lifestyle, not just price." },
            { icon: "📍", title: "NYC, London & more", body: "Starting in NYC — expanding city by city." },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", gap: 12, padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: "12px", color: "white", marginBottom: 2 }}>{item.title}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BROWSE LISTINGS
      ══════════════════════════════════════════════════════ */}
      <section id="browse" style={{ padding: "48px 20px 64px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Filters row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: "22px", color: INK, marginBottom: 2 }}>Browse listings</h2>
              <p style={{ fontSize: "12px", color: "#aaa" }}>Sign up to see your compatibility score with each listing</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {/* City select */}
              <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: "8px 14px", borderRadius: 999, border: "1.5px solid #e0d8d0", background: "white", fontSize: "11px", fontWeight: 700, color: INK, fontFamily: "var(--font-jost)", cursor: "pointer" }}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Tab toggle */}
              <div style={{ display: "flex", background: "#f5f0eb", borderRadius: 999, padding: 3 }}>
                {(["available","looking"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-jost)", transition: "all 0.15s", background: tab === t ? PINK : "transparent", color: tab === t ? "white" : "#888" }}>
                    {t === "available" ? "Available" : "Looking"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Listing grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : listings.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {listings.map((listing, i) => <ListingCard key={listing.id} listing={listing} idx={i} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "20px", color: "#ccc", marginBottom: 8 }}>No listings yet in {city}.</p>
              <p style={{ fontSize: "13px", color: "#bbb", marginBottom: 24 }}>Be the first to post — or check another city.</p>
              <Link href="/girlmate/signup" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: 999, background: PINK, color: "white", fontWeight: 800, fontSize: "12px", letterSpacing: "0.1em", textDecoration: "none" }}>
                POST A LISTING →
              </Link>
            </div>
          )}

          {/* Sign-up nudge */}
          {listings.length > 0 && (
            <div style={{ marginTop: 32, padding: "24px 28px", background: PLUM, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: 4 }}>See who you actually match with.</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>Sign up to unlock Yande match scores, contact listings, and post your own.</p>
              </div>
              <Link href="/girlmate/signup" style={{ flexShrink: 0, padding: "13px 26px", borderRadius: 999, background: PINK, color: "white", fontWeight: 900, fontSize: "11px", letterSpacing: "0.1em", textDecoration: "none", boxShadow: "0 4px 16px rgba(255,31,125,0.4)" }}>
                CREATE ACCOUNT →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "64px 20px", background: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(24px,4vw,36px)", color: INK, marginBottom: 8 }}>
            How <span style={{ color: PINK, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 400 }}>GirlMate</span> works
          </h2>
          <div style={{ width: 32, height: 2, background: PINK, margin: "0 auto 40px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 28 }}>
            {[
              { step: "01", title: "Create your profile", body: "Sign up with BloomBay. Your clubs, interests, and lifestyle answers power your matches." },
              { step: "02", title: "Browse or post", body: "Browse verified listings — or post your room/sublet in under 2 minutes." },
              { step: "03", title: "Yande matches you", body: "Our AI looks at clubs, schedule, lifestyle, and shared connections to rank your fit." },
              { step: "04", title: "Connect safely", body: "Message your match inside BloomBay. Every conversation stays in our verified network." },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "left", padding: "22px 20px", background: IVORY, borderRadius: 18 }}>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "28px", fontWeight: 300, color: PINK, marginBottom: 8, lineHeight: 1 }}>{item.step}</p>
                <p style={{ fontWeight: 800, fontSize: "13px", color: INK, marginBottom: 6 }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PARTNERS SECTION
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "64px 20px", background: IVORY }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ background: INK, borderRadius: 24, padding: "48px 36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: `radial-gradient(circle, rgba(255,31,125,0.2) 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>✦ &nbsp;FOR GROUP OWNERS</p>
              <h2 style={{ fontWeight: 900, fontSize: "clamp(22px,4vw,34px)", color: "white", marginBottom: 12, lineHeight: 1.15 }}>
                Run a housing group?<br />
                <span style={{ color: PINK, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 400 }}>Bring your women here.</span>
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 480, marginBottom: 28 }}>
                If you manage a Facebook group, WhatsApp chat, or sublet company for women, you can become a <strong style={{ color: "white" }}>GirlMate Partner</strong>. Your members get a verified, safer space — and you get tools to manage it.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                {["Partner badge on all listings", "Bulk onboarding link", "Group dashboard", "Priority support"].map(feat => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ color: PINK, fontSize: "10px" }}>✦</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/girlmate/partner" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 999, background: PINK, color: "white", fontWeight: 900, fontSize: "12px", letterSpacing: "0.12em", textDecoration: "none", boxShadow: "0 6px 24px rgba(255,31,125,0.4)" }}>
                BECOME A PARTNER
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: PLUM, padding: "40px 20px 32px", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <GMLogo size={24} />
              <div>
                <p style={{ fontWeight: 900, fontSize: "15px", color: "white", lineHeight: 1 }}>GirlMate</p>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>by BloomBay</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[{ l: "Browse", h: "#browse" }, { l: "Partners", h: "/girlmate/partner" }, { l: "Safety", h: "/safety" }, { l: "BloomBay", h: "/" }].map(link => (
                <Link key={link.l} href={link.h} style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{link.l}</Link>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>© 2026 BloomBay, Inc. GirlMate is a women-only platform.</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>All members verified female. Listings moderated.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
