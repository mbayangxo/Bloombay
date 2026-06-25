"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { HangerListing } from "@/lib/actions/hanger";
import { createHangerListing, getMyHangerListings } from "@/lib/actions/hanger";
import { FashionPostSheet } from "@/app/components/portal/fashion-post-sheet";
import { HangerInquirySheet } from "@/app/components/portal/hanger-inquiry-sheet";
import type { InquiryListing } from "@/app/components/portal/hanger-inquiry-sheet";
import { HangerListingSheet } from "@/app/components/portal/hanger-listing-sheet";
import type { ListingDetail } from "@/app/components/portal/hanger-listing-sheet";
import { SectionHeader, HeaderBtn } from "@/app/components/shared/section-header";
import { HangerCardSkeleton } from "@/app/components/shared/skeleton";

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

const SIZES = ["XS", "S", "M", "L", "XL", "6", "7", "8", "9", "10", "27", "28", "29", "30"] as const;
type HangerTab = "browse" | "my-listings";

// ─── Extended mock type ────────────────────────────────────────────────────────
type MockListing = HangerListing & {
  size_display: string;
  seller_initials: string;
  seller_gradient: string;
  card_gradient: string;
  petal_count: number;
  flower_count: number;
};

const SWAP_TEAL  = "#00C6A7";
const FREE_GREEN = "#16A34A";

const MOCK_LISTINGS: MockListing[] = [];

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
  const [showPostSheet,  setShowPostSheet]     = useState(false);
  const [buyingId,       setBuyingId]          = useState<string | null>(null);
  const [buyError,       setBuyError]          = useState<string | null>(null);
  const [earnings,       setEarnings]          = useState<EarningsRow[]>([]);
  const [balance,        setBalance]           = useState<SellerBalance | null>(null);
  const [showEarnings,   setShowEarnings]      = useState(false);
  const [inquiryListing, setInquiryListing]    = useState<InquiryListing | null>(null);
  const [inquiryMode,    setInquiryMode]       = useState<"inquire" | "swap_offer">("inquire");
  const [detailListing,  setDetailListing]     = useState<ListingDetail | null>(null);
  const [searchQuery,    setSearchQuery]       = useState("");
  const [showSearch,     setShowSearch]        = useState(false);
  const [activeSize,     setActiveSize]        = useState<string | null>(null);
  const [activeTab,      setActiveTab]         = useState<HangerTab>("browse");
  const [myListings,     setMyListings]        = useState<HangerListing[]>([]);
  const [myListingsLoading, setMyListingsLoading] = useState(false);
  const [listingsLoading, setListingsLoading]  = useState(true);

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
      setListingsLoading(false);
    })();
  }, []);

  // Load my listings when tab switches to my-listings
  useEffect(() => {
    if (activeTab !== "my-listings") return;
    if (myListings.length > 0) return;
    setMyListingsLoading(true);
    void getMyHangerListings().then((data) => {
      setMyListings(data);
      setMyListingsLoading(false);
    });
  }, [activeTab, myListings.length]);

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
  const [listingType,     setListingType]     = useState<"sell" | "swap" | "sell_or_swap" | "give_away">("sell");
  const [swapWants,       setSwapWants]       = useState("");
  const [sellCity,        setSellCity]        = useState("");
  const [listSubmitting,  setListSubmitting]  = useState(false);
  const [listError,       setListError]       = useState<string | null>(null);

  async function handleList(publishStatus: "active" | "draft" = "active") {
    if (!sellTitle.trim()) { setListError("Please add a title."); return; }
    if (publishStatus === "active") {
      if (!sellCity.trim()) { setListError("Please add your city."); return; }
      if (listingType === "sell" || listingType === "sell_or_swap") {
        if (!sellPrice) { setListError("Please enter a price."); return; }
      }
    }
    setListSubmitting(true);
    setListError(null);
    const result = await createHangerListing({
      title:        sellTitle.trim(),
      description:  sellDescription.trim() || undefined,
      price_cents:  (listingType === "swap" || listingType === "give_away") ? 0 : Math.round(parseFloat(sellPrice) * 100),
      listing_type: listingType,
      swap_wants:   swapWants.trim() || undefined,
      city:         sellCity.trim() || undefined,
      size:         sellSize.trim() || undefined,
      category:     sellCategory || undefined,
      condition:    sellCondition || "good",
      status:       publishStatus,
    });
    setListSubmitting(false);
    if (!result.ok) { setListError(result.error ?? "Something went wrong."); return; }
    closeSellSheet();
  }

  function closeSellSheet() {
    setSellSheetOpen(false);
    setSellTitle("");
    setSellCategory("");
    setSellSize("");
    setSellCondition("");
    setSellPrice("");
    setSellDescription("");
    setListingType("sell");
    setSwapWants("");
    setSellCity("");
  }

  const filtered = MOCK_LISTINGS.filter((l) => {
    if (activeCategory !== "All" && l.category !== activeCategory) return false;
    if (activeSize && l.size !== activeSize) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!l.title.toLowerCase().includes(q) &&
          !(l.description ?? "").toLowerCase().includes(q) &&
          !(l.category ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

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
        paddingBottom: 120,
        backgroundImage: PAPER,
        backgroundRepeat: "repeat",
        fontFamily: "var(--font-jost), sans-serif",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* ── Shared section header ─────────────────────────────────────────────── */}
      <SectionHeader
        title="The Hanger"
        subtitle="women-only closet ✦"
        backHref="/member/match"
        theme="dark"
        actions={
          <>
            <button
              onClick={() => setShowSearch(v => !v)}
              style={{
                background: showSearch ? `${PINK}22` : "rgba(255,255,255,0.08)",
                color: showSearch ? PINK : "rgba(255,255,255,0.7)",
                border: showSearch ? `1.5px solid ${PINK}44` : "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: "50%", width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, cursor: "pointer",
              }}
              aria-label="Search"
            >
              🔍
            </button>
            <HeaderBtn variant="ghost" onClick={() => setShowPostSheet(true)}>Post ✦</HeaderBtn>
            <HeaderBtn variant="primary" onClick={() => setSellSheetOpen(true)}>List +</HeaderBtn>
          </>
        }
      />

      {/* ── Search bar (slides in) ─────────────────────────────────────────────── */}
      {showSearch && (
        <div style={{ padding: "10px 12px 0", animation: "fadeIn 0.18s ease" }}>
          <input
            type="search"
            placeholder="Search dresses, Nike, size S…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.07)",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 14,
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* ── Browse / My Listings tabs ──────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        padding: "10px 12px 0",
        gap: 0,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {(["browse", "my-listings"] as HangerTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab ? `2px solid ${PINK}` : "2px solid transparent",
              color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "8px 0 10px",
              cursor: "pointer",
            }}
          >
            {tab === "browse" ? "Browse" : "My Listings"}
          </button>
        ))}
      </div>

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

      {/* ── Category + size filters (only on Browse tab) ──────────────────────── */}
      {activeTab === "browse" && (
        <>
          {/* Category row */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 12px 0", scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", borderRadius: 20, border: "none",
                  background: activeCategory === cat ? PINK : "rgba(255,255,255,0.08)",
                  color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize: 12, fontFamily: "var(--font-jost), sans-serif",
                  fontWeight: 600, letterSpacing: "0.03em", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
            ))}
          </div>

          {/* Size filter row */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "8px 12px 12px", scrollbarWidth: "none", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>Size</span>
            <button
              onClick={() => setActiveSize(null)}
              style={{
                flexShrink: 0, padding: "4px 12px", borderRadius: 20, border: "none",
                background: activeSize === null ? "rgba(255,255,255,0.15)" : "transparent",
                color: activeSize === null ? "#fff" : "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.04em", cursor: "pointer",
              }}
            >
              All
            </button>
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setActiveSize(activeSize === sz ? null : sz)}
                style={{
                  flexShrink: 0, padding: "4px 10px", borderRadius: 20,
                  border: `1.5px solid ${activeSize === sz ? PINK : "rgba(255,255,255,0.12)"}`,
                  background: activeSize === sz ? `${PINK}22` : "transparent",
                  color: activeSize === sz ? PINK : "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.03em", cursor: "pointer",
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── My Listings tab ───────────────────────────────────────────────────── */}
      {activeTab === "my-listings" && (
        <div style={{ padding: "16px 12px 100px" }}>
          {myListingsLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[1, 2, 3, 4].map(i => <HangerCardSkeleton key={i} />)}
            </div>
          ) : myListings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>🧺</p>
              <p style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontSize: 18, color: "#fff", marginBottom: 6 }}>Nothing listed yet</p>
              <p style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 14, color: "rgba(255,255,255,0.35)" }}>Tap <strong>List +</strong> to post your first item ✦</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {myListings.map((listing) => {
                const statusColor = listing.status === "active" ? "#10B981" : listing.status === "draft" ? "rgba(255,255,255,0.35)" : PINK;
                return (
                  <div key={listing.id} style={{ background: "#1a1a1a", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ aspectRatio: "3/4", background: "linear-gradient(160deg, #1a0533 0%, #3d1a6e 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <span style={{ fontSize: 36, opacity: 0.5 }}>{listing.category ? CATEGORY_ICONS[listing.category] ?? "🛍️" : "🛍️"}</span>
                      <div style={{ position: "absolute", top: 8, left: 8, background: `${statusColor}22`, border: `1px solid ${statusColor}55`, borderRadius: 6, padding: "2px 7px", fontSize: 9, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: statusColor }}>
                        {listing.status}
                      </div>
                    </div>
                    <div style={{ padding: "10px 10px 12px" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, fontFamily: "var(--font-jost)", fontWeight: 700, color: "#fff" }}>{listing.title}</p>
                      <p style={{ margin: 0, fontSize: 9, fontFamily: "var(--font-jost)", color: "rgba(255,255,255,0.35)" }}>
                        {listing.listing_type === "give_away" ? "FREE 🎁" : listing.listing_type === "swap" ? "Swap ↔" : `$${(listing.price_cents / 100).toFixed(0)}`}
                        {listing.city ? ` · 📍 ${listing.city}` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 2-column browse grid ──────────────────────────────────────────────── */}
      {activeTab === "browse" && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          padding: "0 12px 100px",
        }}
      >
        {listingsLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => <HangerCardSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 28, marginBottom: 8 }}>🔍</p>
            <p style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 15, color: "rgba(255,255,255,0.35)" }}>Nothing matching — try a different filter ✦</p>
          </div>
        ) : null}
        {!listingsLoading && filtered.map((listing) => {
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
                onClick={() => setDetailListing(listing)}
                style={{
                  aspectRatio: "3 / 4",
                  background: listing.card_gradient,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
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

                {/* Price / swap / free label */}
                {listing.listing_type === "give_away" ? (
                  <span style={{ display: "inline-block", fontSize: 10, fontFamily: "var(--font-jost), sans-serif", fontWeight: 800, letterSpacing: "0.08em", color: "#fff", background: FREE_GREEN, padding: "3px 9px", borderRadius: 20 }}>FREE 🎁</span>
                ) : listing.listing_type === "swap" ? (
                  <span style={{ display: "inline-block", fontSize: 10, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, letterSpacing: "0.06em", color: "#fff", background: SWAP_TEAL, padding: "3px 9px", borderRadius: 20 }}>Swap ↔</span>
                ) : listing.listing_type === "sell_or_swap" ? (
                  <div>
                    <p style={{ margin: 0, fontSize: 16, fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontWeight: 700, color: PINK }}>{price}</p>
                    <span style={{ display: "inline-block", marginTop: 3, fontSize: 9, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, letterSpacing: "0.06em", color: SWAP_TEAL, background: `${SWAP_TEAL}18`, border: `1px solid ${SWAP_TEAL}44`, padding: "2px 7px", borderRadius: 20 }}>or swap ↔</span>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: 16, fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontWeight: 700, color: PINK }}>{price}</p>
                )}

                {/* City */}
                {listing.city && (
                  <p style={{ margin: 0, fontSize: 9, fontFamily: "var(--font-jost), sans-serif", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>📍 {listing.city}</p>
                )}

                {/* Seller chip + appreciation counts */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Link
                    href={`/member/profile/${listing.seller_id}`}
                    style={{ textDecoration: "none", flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
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
                      }}
                    >
                      {listing.seller_initials}
                    </div>
                  </Link>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-jost), sans-serif",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {listing.seller_name}
                  </span>
                  {/* Appreciation micro-counts */}
                  {(listing.petal_count > 0 || listing.flower_count > 0) && (
                    <span style={{ fontSize: 9, fontFamily: "var(--font-jost), sans-serif", color: "rgba(255,255,255,0.3)", flexShrink: 0, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
                      {listing.petal_count > 0 && `🌷${listing.petal_count}`}
                      {listing.petal_count > 0 && listing.flower_count > 0 && " "}
                      {listing.flower_count > 0 && `🌸${listing.flower_count}`}
                    </span>
                  )}
                </div>

                {/* Action button */}
                {listing.listing_type === "give_away" ? (
                  <button
                    onClick={() => { setInquiryMode("inquire"); setInquiryListing(listing); }}
                    style={{ marginTop: "auto", width: "100%", background: FREE_GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 11, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}
                  >
                    Inquire 🎁
                  </button>
                ) : listing.listing_type === "swap" ? (
                  <button
                    onClick={() => { setInquiryMode("swap_offer"); setInquiryListing(listing); }}
                    style={{ marginTop: "auto", width: "100%", background: SWAP_TEAL, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 11, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}
                  >
                    Offer a Swap ↔
                  </button>
                ) : listing.listing_type === "sell_or_swap" ? (
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      onClick={() => void handleBuy(listing.id)}
                      disabled={buyingId === listing.id}
                      style={{ flex: 1, background: buyingId === listing.id ? "rgba(255,31,125,0.5)" : PINK, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 10, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, cursor: buyingId === listing.id ? "not-allowed" : "pointer" }}
                    >
                      {buyingId === listing.id ? "…" : `Buy · ${price}`}
                    </button>
                    <button
                      onClick={() => { setInquiryMode("swap_offer"); setInquiryListing(listing); }}
                      style={{ flex: 1, background: "transparent", color: SWAP_TEAL, border: `1.5px solid ${SWAP_TEAL}`, borderRadius: 8, padding: "9px 0", fontSize: 10, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, cursor: "pointer" }}
                    >
                      Swap ↔
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => void handleBuy(listing.id)}
                    disabled={buyingId === listing.id}
                    style={{ marginTop: "auto", width: "100%", background: buyingId === listing.id ? "rgba(255,31,125,0.5)" : PINK, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 11, fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, letterSpacing: "0.04em", cursor: buyingId === listing.id ? "not-allowed" : "pointer" }}
                  >
                    {buyingId === listing.id ? "…" : `Buy · ${price}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )} {/* end activeTab === "browse" */}

      {/* ── Buy error toast ───────────────────────────────────────────────────── */}
      {buyError && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#e53e3e", color: "white", padding: "10px 20px", borderRadius: 99, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, zIndex: 200 }}>
          {buyError}
        </div>
      )}

      {/* ── Sell sheet backdrop ────────────────────────────────────────────────── */}
      {sellSheetOpen && (
        <div
          onClick={closeSellSheet}
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
              margin: "0 0 16px",
            }}
          >
            women-only closet ✦
          </p>

          {/* Listing type pill selector */}
          <div style={{ display: "flex", gap: 0, marginBottom: 20, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, overflow: "hidden" }}>
            {(["sell", "swap", "sell_or_swap", "give_away"] as const).map((type, idx) => {
              const labels: Record<string, string> = { sell: "Sell", swap: "Swap ↔", sell_or_swap: "Both", give_away: "Free 🎁" };
              const active = listingType === type;
              const activeColor = type === "swap" ? SWAP_TEAL : type === "give_away" ? FREE_GREEN : PINK;
              return (
                <button
                  key={type}
                  onClick={() => setListingType(type)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    borderRadius: 0,
                    border: "none",
                    borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
                    background: active ? activeColor : "transparent",
                    color: active ? "#fff" : "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-jost), sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>

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

          {/* Price — hidden for swap-only and give_away */}
          {listingType !== "swap" && listingType !== "give_away" && (
            <>
              <label style={fieldLabelStyle}>
                Price ($){listingType === "sell_or_swap" && <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400, marginLeft: 4 }}>optional if swap</span>}
              </label>
              <input
                type="number"
                placeholder="e.g. 45"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                style={{ ...sharedInputStyle, marginBottom: 16 }}
              />
            </>
          )}

          {/* Swap wants — shown for swap and sell_or_swap */}
          {(listingType === "swap" || listingType === "sell_or_swap") && (
            <>
              <label style={{ ...fieldLabelStyle, color: SWAP_TEAL }}>Looking to swap for…</label>
              <textarea
                placeholder="What are you looking for in return? (style, size, brand…)"
                value={swapWants}
                onChange={(e) => setSwapWants(e.target.value)}
                rows={2}
                style={{
                  ...sharedInputStyle,
                  fontFamily: "var(--font-caveat), cursive",
                  fontSize: 15,
                  marginBottom: 16,
                  resize: "none",
                  borderColor: `${SWAP_TEAL}40`,
                }}
              />
            </>
          )}

          {/* City — required for all listings */}
          <label style={fieldLabelStyle}>City</label>
          <input
            type="text"
            placeholder="e.g. New York, Atlanta, London…"
            value={sellCity}
            onChange={(e) => setSellCity(e.target.value)}
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
            {listingType === "swap"
              ? "Swap listings are free — Bloombay takes nothing."
              : listingType === "sell_or_swap"
              ? "If it sells, Bloombay takes 10%. Swaps are always free."
              : listingType === "give_away"
              ? "Giving it away for free — that's so you. Bloombay takes nothing. 🎁"
              : "Bloombay takes 10% when it sells. You keep the rest."}
          </p>

          {listError && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", margin: "0 0 10px", textAlign: "center" }}>{listError}</p>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            {/* Save as draft */}
            <button
              onClick={() => void handleList("draft")}
              disabled={listSubmitting}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.55)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: "14px 0",
                fontSize: 12,
                fontFamily: "var(--font-jost), sans-serif",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: listSubmitting ? "not-allowed" : "pointer",
              }}
            >
              Save Draft
            </button>

            {/* Publish */}
            <button
              onClick={() => void handleList("active")}
              disabled={listSubmitting}
              style={{
                flex: 2,
                background: listSubmitting ? "rgba(0,0,0,0.3)" : listingType === "swap" ? SWAP_TEAL : listingType === "give_away" ? FREE_GREEN : PINK,
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "14px 0",
                fontSize: 14,
                fontFamily: "var(--font-jost), sans-serif",
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: listSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {listSubmitting ? "Saving…" : listingType === "swap" ? "List for Swap 🔄" : listingType === "give_away" ? "Give it Away 🎁" : "Publish →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Fashion post sheet (hanger style posts) ──────────────────────────── */}
      {showPostSheet && (
        <FashionPostSheet
          context="hanger"
          category="fits"
          onClose={() => setShowPostSheet(false)}
          onPosted={() => setShowPostSheet(false)}
        />
      )}

      {/* ── Listing detail sheet ─────────────────────────────────────────────── */}
      {detailListing && !inquiryListing && (
        <HangerListingSheet
          listing={detailListing}
          onClose={() => setDetailListing(null)}
          onInquire={(mode) => {
            setInquiryMode(mode);
            setInquiryListing(detailListing);
            setDetailListing(null);
          }}
          onBuy={() => {
            void handleBuy(detailListing.id);
            setDetailListing(null);
          }}
        />
      )}

      {/* ── Inquiry / swap offer sheet ────────────────────────────────────────── */}
      {inquiryListing && (
        <HangerInquirySheet
          listing={inquiryListing}
          mode={inquiryMode}
          onClose={() => setInquiryListing(null)}
        />
      )}
    </div>
  );
}
