"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { HangerListing } from "@/lib/actions/hanger";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

// ─── Category icons ────────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  All:         "🛍️",
  Tops:        "👕",
  Bottoms:     "👖",
  Dresses:     "👗",
  Shoes:       "👟",
  Bags:        "👜",
  Accessories: "💍",
  Vintage:     "✨",
};

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Shoes", "Bags", "Accessories", "Vintage"] as const;
type Category = typeof CATEGORIES[number];

// ─── Extended mock type ────────────────────────────────────────────────────────
type MockListing = HangerListing & {
  size_display: string;
  seller_initials: string;
  seller_gradient: string;
  card_gradient: string;
};

// ─── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_LISTINGS: MockListing[] = [
  {
    id: "1",
    seller_id: "u2",
    seller_name: "Amara K",
    seller_avatar: null,
    title: "Silk Slip Dress",
    description: "Bias-cut ivory slip dress, barely worn. Perfect for summer nights.",
    price_cents: 9500,
    size: "S",
    category: "Dresses",
    condition: "like new",
    image_url: null,
    status: "active",
    created_at: "2026-06-01T00:00:00Z",
    size_display: "S",
    seller_initials: "AK",
    seller_gradient: "linear-gradient(135deg, #7B2FF7, #C77DFF)",
    card_gradient: "linear-gradient(160deg, #1a0533 0%, #3d1a6e 100%)",
  },
  {
    id: "2",
    seller_id: "u1",
    seller_name: "Zara M",
    seller_avatar: null,
    title: "Vintage Levi's 501",
    description: "Classic 501s, waist 27. High-rise, great fade. True vintage find.",
    price_cents: 6500,
    size: "27",
    category: "Bottoms",
    condition: "good",
    image_url: null,
    status: "active",
    created_at: "2026-06-02T00:00:00Z",
    size_display: "27",
    seller_initials: "ZM",
    seller_gradient: "linear-gradient(135deg, #FF1F7D, #FF9ECA)",
    card_gradient: "linear-gradient(160deg, #2a0a14 0%, #5c1a33 100%)",
  },
  {
    id: "3",
    seller_id: "u4",
    seller_name: "Nia B",
    seller_avatar: null,
    title: "YSL Tote (dupe)",
    description: "High-quality YSL-inspired tote in camel. Goes with everything.",
    price_cents: 4500,
    size: "-",
    category: "Bags",
    condition: "good",
    image_url: null,
    status: "active",
    created_at: "2026-06-03T00:00:00Z",
    size_display: "O/S",
    seller_initials: "NB",
    seller_gradient: "linear-gradient(135deg, #00C6A7, #3B82F6)",
    card_gradient: "linear-gradient(160deg, #001a17 0%, #003d33 100%)",
  },
  {
    id: "4",
    seller_id: "u3",
    seller_name: "Sade T",
    seller_avatar: null,
    title: "Reformation Linen Top",
    description: "Soft linen button-down in sage. XS. Worn twice.",
    price_cents: 3800,
    size: "XS",
    category: "Tops",
    condition: "like new",
    image_url: null,
    status: "active",
    created_at: "2026-06-04T00:00:00Z",
    size_display: "XS",
    seller_initials: "ST",
    seller_gradient: "linear-gradient(135deg, #FF6B35, #FFB347)",
    card_gradient: "linear-gradient(160deg, #1a0f00 0%, #3d2600 100%)",
  },
  {
    id: "5",
    seller_id: "u5",
    seller_name: "Lena P",
    seller_avatar: null,
    title: "Nike Air Force 1 White",
    description: "Size 7.5. Worn a handful of times — still clean.",
    price_cents: 8000,
    size: "7.5",
    category: "Shoes",
    condition: "good",
    image_url: null,
    status: "active",
    created_at: "2026-06-05T00:00:00Z",
    size_display: "7.5",
    seller_initials: "LP",
    seller_gradient: "linear-gradient(135deg, #E91E8C, #F48FB1)",
    card_gradient: "linear-gradient(160deg, #1a0011 0%, #400028 100%)",
  },
  {
    id: "6",
    seller_id: "u2",
    seller_name: "Amara K",
    seller_avatar: null,
    title: "Beaded Clutch (Thrift)",
    description: "Vintage beaded clutch, silver and white. Unique piece.",
    price_cents: 2800,
    size: "-",
    category: "Bags",
    condition: "good",
    image_url: null,
    status: "active",
    created_at: "2026-06-06T00:00:00Z",
    size_display: "O/S",
    seller_initials: "AK",
    seller_gradient: "linear-gradient(135deg, #7B2FF7, #C77DFF)",
    card_gradient: "linear-gradient(160deg, #0d0d1a 0%, #1a1a40 100%)",
  },
  {
    id: "7",
    seller_id: "u4",
    seller_name: "Nia B",
    seller_avatar: null,
    title: "Blazer (H&M Studio)",
    description: "Oversized black blazer, S. Tags still attached. Never worn.",
    price_cents: 5500,
    size: "S",
    category: "Tops",
    condition: "new with tags",
    image_url: null,
    status: "active",
    created_at: "2026-06-07T00:00:00Z",
    size_display: "S",
    seller_initials: "NB",
    seller_gradient: "linear-gradient(135deg, #00C6A7, #3B82F6)",
    card_gradient: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 100%)",
  },
  {
    id: "8",
    seller_id: "u1",
    seller_name: "Zara M",
    seller_avatar: null,
    title: "Floral Midi Skirt",
    description: "Floaty midi skirt with pink floral print. M. Barely worn.",
    price_cents: 4200,
    size: "M",
    category: "Bottoms",
    condition: "like new",
    image_url: null,
    status: "active",
    created_at: "2026-06-08T00:00:00Z",
    size_display: "M",
    seller_initials: "ZM",
    seller_gradient: "linear-gradient(135deg, #FF1F7D, #FF9ECA)",
    card_gradient: "linear-gradient(160deg, #1a0011 0%, #400028 100%)",
  },
];

const CONDITION_COLORS: Record<string, string> = {
  "like new":      "#10B981",
  "new with tags": "#3B82F6",
  "good":          "#F59E0B",
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface EarningsRow {
  id: string;
  item_name: string | null;
  listing_id: string | null;
  amount_cents: number;
  seller_receives_cents: number;
  bloombay_fee_cents: number;
  created_at: string;
}

interface SellerBalance {
  pending_cents: number;
  paid_out_cents: number;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function HangerPage() {
  const [activeCategory, setActiveCategory]   = useState<Category>("All");
  const [sellSheetOpen,  setSellSheetOpen]     = useState(false);
  const [buyingId,       setBuyingId]          = useState<string | null>(null);
  const [buyError,       setBuyError]          = useState<string | null>(null);
  const [earnings,       setEarnings]          = useState<EarningsRow[]>([]);
  const [balance,        setBalance]           = useState<SellerBalance | null>(null);
  const [showEarnings,   setShowEarnings]      = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [{ data: earningsData }, { data: balanceData }] = await Promise.all([
          supabase
            .from("hanger_earnings")
            .select("id, item_name, listing_id, amount_cents, seller_receives_cents, bloombay_fee_cents, created_at")
            .eq("seller_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50),
          supabase
            .from("hanger_seller_balance")
            .select("pending_cents, paid_out_cents")
            .eq("seller_id", user.id)
            .single(),
        ]);

        setEarnings((earningsData as EarningsRow[]) ?? []);
        if (balanceData) setBalance(balanceData as SellerBalance);
      } catch { /* no sales yet */ }
    })();
  }, []);

  async function handleBuy(listingId: string) {
    setBuyingId(listingId);
    setBuyError(null);
    try {
      const res = await fetch("/api/hanger/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setBuyError(data.error ?? "Something went wrong");
        setBuyingId(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setBuyError("Network error");
      setBuyingId(null);
    }
  }

  // Sell form state
  const [sellTitle,       setSellTitle]       = useState("");
  const [sellCategory,    setSellCategory]    = useState("");
  const [sellSize,        setSellSize]        = useState("");
  const [sellCondition,   setSellCondition]   = useState("");
  const [sellPrice,       setSellPrice]       = useState("");
  const [sellDescription, setSellDescription] = useState("");

  const filtered =
    activeCategory === "All"
      ? MOCK_LISTINGS
      : MOCK_LISTINGS.filter((l) => l.category === activeCategory);

  const sharedInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    fontFamily: "var(--font-jost), sans-serif",
    fontSize: 14,
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  const fieldLabelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-jost), sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0D0D0D",
        backgroundImage: PAPER,
        backgroundRepeat: "repeat",
        fontFamily: "var(--font-jost), sans-serif",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* ── Sticky header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(13,13,13,0.88)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "14px 16px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/member/match"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              textDecoration: "none",
              fontSize: 16,
              flexShrink: 0,
            }}
            aria-label="Back to match"
          >
            ←
          </Link>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 22,
                margin: 0,
                lineHeight: 1.1,
                color: "#fff",
              }}
            >
              The Hanger
            </h1>
            <p
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 14,
                margin: 0,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.2,
              }}
            >
              women-only closet ✦
            </p>
          </div>

          <button
            onClick={() => setSellSheetOpen(true)}
            style={{
              background: PINK,
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "8px 18px",
              fontSize: 12,
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Sell →
          </button>
        </div>
      </header>

      {/* ── Seller balance strip ───────────────────────────────────────────────── */}
      <div style={{ padding: "10px 12px 0" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)" }}>
                Your Earnings
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 18, fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontWeight: 700, color: "#fff" }}>
                £{((balance?.pending_cents ?? 0) / 100).toFixed(2)}{" "}
                <span style={{ fontSize: 11, fontFamily: "var(--font-jost), sans-serif", fontStyle: "normal", fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>
                  pending · £{((balance?.paid_out_cents ?? 0) / 100).toFixed(2)} paid out
                </span>
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, fontFamily: "var(--font-caveat), cursive", color: "rgba(255,255,255,0.3)" }}>
                {earnings.length > 0 ? `${earnings.length} sale${earnings.length === 1 ? "" : "s"} · you keep 90%` : "paid out when your item sells ✦"}
              </p>
            </div>
            <button
              onClick={() => setShowEarnings(v => !v)}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, letterSpacing: "0.04em", color: "rgba(255,255,255,0.65)", cursor: "pointer", whiteSpace: "nowrap" as const }}
            >
              {showEarnings ? "Hide" : "Sales →"}
            </button>
          </div>

          {/* Earnings history panel */}
          {showEarnings && (
            <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12 }}>
              {earnings.length === 0 ? (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" as const, padding: "8px 0" }}>No sales yet — list something to get started ✦</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {earnings.map(e => {
                    const date = new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                    return (
                      <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👗</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{e.item_name ?? "Item sold"}</p>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{date} · you keep £{(e.seller_receives_cents / 100).toFixed(2)}</p>
                        </div>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: PINK, flexShrink: 0 }}>£{(e.amount_cents / 100).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Category filters (horizontal scroll) ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "14px 12px",
          scrollbarWidth: "none",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background:
                activeCategory === cat ? PINK : "rgba(255,255,255,0.08)",
              color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 600,
              letterSpacing: "0.03em",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* ── 2-column grid ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          padding: "0 12px 100px",
        }}
      >
        {filtered.map((listing) => {
          const price = `$${(listing.price_cents / 100).toFixed(0)}`;
          const conditionColor = CONDITION_COLORS[listing.condition] ?? "rgba(255,255,255,0.4)";

          return (
            <div
              key={listing.id}
              style={{
                background: "#1a1a1a",
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image placeholder — 3:4 aspect */}
              <div
                style={{
                  aspectRatio: "3 / 4",
                  background: listing.card_gradient,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 40, opacity: 0.6 }}>
                  {(listing.category ? CATEGORY_ICONS[listing.category] : null) ?? "🛍️"}
                </span>

                {/* Condition badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: `${conditionColor}22`,
                    border: `1px solid ${conditionColor}55`,
                    borderRadius: 6,
                    padding: "2px 7px",
                    fontSize: 9,
                    fontFamily: "var(--font-jost), sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: conditionColor,
                  }}
                >
                  {listing.condition}
                </div>

                {/* Size badge */}
                {listing.size_display !== "O/S" && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: 6,
                      padding: "2px 7px",
                      fontSize: 9,
                      fontFamily: "var(--font-jost), sans-serif",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.7)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {listing.size_display}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: "10px 10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 6,
                }}
              >
                {/* Title */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontFamily: "var(--font-jost), sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {listing.title}
                </p>

                {/* Price */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontFamily: "var(--font-playfair), serif",
                    fontStyle: "italic",
                    fontWeight: 700,
                    color: PINK,
                  }}
                >
                  {price}
                </p>

                {/* Seller chip */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: listing.seller_gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "var(--font-jost), sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {listing.seller_initials}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-jost), sans-serif",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {listing.seller_name}
                  </span>
                </div>

                {/* Buy button */}
                <button
                  onClick={() => void handleBuy(listing.id)}
                  disabled={buyingId === listing.id}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    background: buyingId === listing.id ? "rgba(255,31,125,0.5)" : PINK,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 0",
                    fontSize: 11,
                    fontFamily: "var(--font-jost), sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    cursor: buyingId === listing.id ? "not-allowed" : "pointer",
                  }}
                >
                  {buyingId === listing.id ? "…" : `Buy · ${price}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Buy error toast ───────────────────────────────────────────────────── */}
      {buyError && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#e53e3e", color: "white", padding: "10px 20px", borderRadius: 99, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, zIndex: 200 }}>
          {buyError}
        </div>
      )}

      {/* ── Sell sheet backdrop ────────────────────────────────────────────────── */}
      {sellSheetOpen && (
        <div
          onClick={() => setSellSheetOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 70,
          }}
        />
      )}

      {/* ── Sell bottom sheet ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          background: "#181818",
          backgroundImage: PAPER,
          backgroundRepeat: "repeat",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
          transform: sellSheetOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "92dvh",
          overflowY: "auto",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.15)",
            }}
          />
        </div>

        <div style={{ padding: "8px 18px 32px" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 4px",
            }}
          >
            List an item
          </h2>
          <p
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 20px",
            }}
          >
            women-only closet ✦
          </p>

          {/* Title */}
          <label style={fieldLabelStyle}>Item title</label>
          <input
            type="text"
            placeholder="e.g. Silk Slip Dress"
            value={sellTitle}
            onChange={(e) => setSellTitle(e.target.value)}
            style={{ ...sharedInputStyle, marginBottom: 16 }}
          />

          {/* Category */}
          <label style={fieldLabelStyle}>Category</label>
          <select
            value={sellCategory}
            onChange={(e) => setSellCategory(e.target.value)}
            style={{
              ...sharedInputStyle,
              marginBottom: 16,
              appearance: "none",
              WebkitAppearance: "none",
            }}
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c} style={{ background: "#181818", color: "#fff" }}>
                {c}
              </option>
            ))}
          </select>

          {/* Size + Condition row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={fieldLabelStyle}>Size</label>
              <input
                type="text"
                placeholder="XS / 27 / 7.5"
                value={sellSize}
                onChange={(e) => setSellSize(e.target.value)}
                style={{ ...sharedInputStyle, width: "auto", flex: 1, display: "block" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={fieldLabelStyle}>Condition</label>
              <select
                value={sellCondition}
                onChange={(e) => setSellCondition(e.target.value)}
                style={{
                  ...sharedInputStyle,
                  width: "auto",
                  flex: 1,
                  display: "block",
                  appearance: "none",
                  WebkitAppearance: "none",
                }}
              >
                <option value="" disabled>Pick one</option>
                <option value="new with tags" style={{ background: "#181818", color: "#fff" }}>New with tags</option>
                <option value="like new" style={{ background: "#181818", color: "#fff" }}>Like new</option>
                <option value="good" style={{ background: "#181818", color: "#fff" }}>Good</option>
                <option value="fair" style={{ background: "#181818", color: "#fff" }}>Fair</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <label style={fieldLabelStyle}>Price ($)</label>
          <input
            type="number"
            placeholder="e.g. 45"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            style={{ ...sharedInputStyle, marginBottom: 16 }}
          />

          {/* Description */}
          <label style={fieldLabelStyle}>Description</label>
          <textarea
            placeholder="Tell buyers a bit about the item…"
            value={sellDescription}
            onChange={(e) => setSellDescription(e.target.value)}
            rows={3}
            style={{
              ...sharedInputStyle,
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 15,
              marginBottom: 14,
              resize: "none",
            }}
          />

          {/* Fee note */}
          <p
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 13,
              color: "rgba(255,255,255,0.3)",
              margin: "0 0 18px",
              lineHeight: 1.4,
            }}
          >
            Bloombay takes 10% when it sells. You keep the rest.
          </p>

          <button
            style={{
              width: "100%",
              background: PINK,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "14px 0",
              fontSize: 14,
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}
          >
            List it →
          </button>
        </div>
      </div>
    </div>
  );
}
