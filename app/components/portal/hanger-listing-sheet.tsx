"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getHangerComments, postHangerComment, sendHangerFlower, removeHangerFlower,
  getHangerReviews, submitHangerReview,
} from "@/lib/actions/hanger";
import type { HangerComment, HangerReview } from "@/lib/actions/hanger";
import type { InquiryListing } from "@/app/components/portal/hanger-inquiry-sheet";

const PINK       = "#FF1F7D";
const SWAP_TEAL  = "#00C6A7";
const FREE_GREEN = "#16A34A";
const PAPER      = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const CATEGORY_ICONS: Record<string, string> = {
  Tops: "👕", Bottoms: "👖", Dresses: "👗", Shoes: "👟",
  Bags: "👜", Accessories: "💍", Vintage: "✨",
};
const CONDITION_COLORS: Record<string, string> = {
  "like new": "#10B981", "new with tags": "#3B82F6", "good": "#F59E0B",
};

export interface ListingDetail {
  id: string;
  seller_id: string;
  seller_name: string | null;
  seller_avatar: string | null;
  seller_initials?: string;
  seller_gradient?: string;
  title: string;
  description: string | null;
  price_cents: number;
  listing_type: "sell" | "swap" | "sell_or_swap" | "give_away";
  swap_wants: string | null;
  size: string | null;
  category: string | null;
  condition: string;
  city: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  card_gradient?: string;
}

interface Props {
  listing: ListingDetail;
  onClose: () => void;
  onInquire?: (mode: "inquire" | "swap_offer") => void;
  onBuy?: () => void;
}

type ActiveTab = "listing" | "comments" | "seller";

export function HangerListingSheet({ listing, onClose, onInquire, onBuy }: Props) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [tab,           setTab]           = useState<ActiveTab>("listing");
  const [comments,      setComments]      = useState<HangerComment[]>([]);
  const [reviews,       setReviews]       = useState<HangerReview[]>([]);
  const [commentText,   setCommentText]   = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [flowerSent,    setFlowerSent]    = useState(false);
  const [flowerLoading, setFlowerLoading] = useState(false);
  const [reviewRating,  setReviewRating]  = useState(0);
  const [reviewBody,    setReviewBody]    = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted,  setReviewSubmitted]  = useState(false);
  const [reviewError,  setReviewError]    = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const price = `$${(listing.price_cents / 100).toFixed(0)}`;
  const conditionColor = CONDITION_COLORS[listing.condition] ?? "rgba(255,255,255,0.4)";
  const isMine = currentUserId === listing.seller_id;

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const [cms, rvs] = await Promise.all([
        getHangerComments(listing.id),
        getHangerReviews(listing.seller_id),
      ]);
      setComments(cms);
      setReviews(rvs);

      // Check if current user already sent a flower
      if (user) {
        const { data } = await supabase
          .from("hanger_flowers")
          .select("id")
          .eq("sender_id", user.id)
          .eq("listing_id", listing.id)
          .maybeSingle();
        if (data) setFlowerSent(true);
      }
    })();
  }, [listing.id, listing.seller_id]);

  async function handleFlower() {
    if (isMine) return;
    setFlowerLoading(true);
    if (flowerSent) {
      await removeHangerFlower(listing.id);
      setFlowerSent(false);
    } else {
      await sendHangerFlower(listing.seller_id, listing.id);
      setFlowerSent(true);
    }
    setFlowerLoading(false);
  }

  async function handleComment() {
    if (!commentText.trim()) return;
    setPostingComment(true);
    const result = await postHangerComment(listing.id, commentText);
    if (result.ok) {
      const updated = await getHangerComments(listing.id);
      setComments(updated);
      setCommentText("");
    }
    setPostingComment(false);
  }

  async function handleReview() {
    if (reviewRating === 0) { setReviewError("Please choose a star rating."); return; }
    setReviewSubmitting(true);
    setReviewError(null);
    const result = await submitHangerReview({
      seller_id: listing.seller_id,
      listing_id: listing.id,
      rating: reviewRating,
      body: reviewBody,
    });
    setReviewSubmitting(false);
    if (!result.ok) { setReviewError(result.error ?? "Something went wrong."); return; }
    setReviewSubmitted(true);
    const updated = await getHangerReviews(listing.seller_id);
    setReviews(updated);
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const sharedInput: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    fontFamily: "var(--font-jost), sans-serif",
    fontSize: 13,
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    resize: "none" as const,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 90 }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "#181818",
          backgroundImage: PAPER,
          backgroundRepeat: "repeat",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.7)",
          maxHeight: "92dvh",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Image / hero area */}
        <div
          style={{
            margin: "0 16px",
            borderRadius: 16,
            aspectRatio: "16 / 9",
            background: listing.card_gradient ?? "linear-gradient(160deg, #1a0533 0%, #3d1a6e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 48, opacity: 0.5 }}>
              {(listing.category ? CATEGORY_ICONS[listing.category] : null) ?? "🛍️"}
            </span>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", border: "none",
              color: "#fff", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>

          {/* Condition badge */}
          <div style={{
            position: "absolute", bottom: 10, left: 10,
            background: `${conditionColor}22`, border: `1px solid ${conditionColor}55`,
            borderRadius: 6, padding: "3px 9px",
            fontSize: 9, fontFamily: "var(--font-jost)", fontWeight: 700,
            letterSpacing: "0.05em", textTransform: "uppercase", color: conditionColor,
          }}>
            {listing.condition}
          </div>

          {/* Flower button */}
          {!isMine && (
            <button
              onClick={() => void handleFlower()}
              disabled={flowerLoading}
              style={{
                position: "absolute", bottom: 10, right: 10,
                background: flowerSent ? `${PINK}33` : "rgba(0,0,0,0.5)",
                border: flowerSent ? `1.5px solid ${PINK}` : "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20, padding: "5px 12px",
                fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
                color: flowerSent ? PINK : "rgba(255,255,255,0.8)",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <span style={{ fontSize: 14 }}>🌸</span>
              {flowerSent ? "Sent" : "Send Flower"}
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 16px", marginTop: 14, flexShrink: 0,
        }}>
          {(["listing", "comments", "seller"] as ActiveTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, background: "transparent", border: "none",
                borderBottom: tab === t ? `2px solid ${PINK}` : "2px solid transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.05em", textTransform: "uppercase",
                padding: "8px 4px 10px", cursor: "pointer",
              }}
            >
              {t === "listing" ? "Item" : t === "comments" ? `Chat (${comments.length})` : "Seller"}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>

          {/* ── LISTING TAB ─────────────────────────────────────────────────── */}
          {tab === "listing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Title + price */}
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <h2 style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                    {listing.title}
                  </h2>
                  {listing.listing_type === "give_away" ? (
                    <span style={{ flexShrink: 0, fontSize: 11, fontFamily: "var(--font-jost)", fontWeight: 800, color: "#fff", background: FREE_GREEN, padding: "4px 10px", borderRadius: 20, marginTop: 4 }}>FREE 🎁</span>
                  ) : listing.listing_type === "swap" ? (
                    <span style={{ flexShrink: 0, fontSize: 11, fontFamily: "var(--font-jost)", fontWeight: 700, color: "#fff", background: SWAP_TEAL, padding: "4px 10px", borderRadius: 20, marginTop: 4 }}>Swap ↔</span>
                  ) : (
                    <p style={{ flexShrink: 0, margin: "4px 0 0", fontSize: 22, fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontWeight: 700, color: PINK }}>{price}</p>
                  )}
                </div>
                {listing.city && (
                  <p style={{ margin: "6px 0 0", fontSize: 12, fontFamily: "var(--font-jost)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>📍 {listing.city}</p>
                )}
              </div>

              {/* Metadata chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {listing.size && (
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "4px 10px" }}>
                    Size {listing.size}
                  </span>
                )}
                {listing.category && (
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "4px 10px" }}>
                    {CATEGORY_ICONS[listing.category] ?? ""} {listing.category}
                  </span>
                )}
                {listing.listing_type === "sell_or_swap" && (
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: SWAP_TEAL, background: `${SWAP_TEAL}18`, border: `1px solid ${SWAP_TEAL}33`, borderRadius: 20, padding: "4px 10px" }}>
                    or swap ↔
                  </span>
                )}
              </div>

              {/* Description */}
              {listing.description && (
                <p style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, margin: 0 }}>
                  {listing.description}
                </p>
              )}

              {/* Swap wants */}
              {listing.swap_wants && (
                <div style={{ background: `${SWAP_TEAL}12`, border: `1px solid ${SWAP_TEAL}33`, borderRadius: 12, padding: "10px 14px" }}>
                  <p style={{ margin: "0 0 4px", fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: SWAP_TEAL, textTransform: "uppercase" }}>Looking to swap for</p>
                  <p style={{ margin: 0, fontFamily: "var(--font-caveat), cursive", fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.45 }}>{listing.swap_wants}</p>
                </div>
              )}

              {/* Seller row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: listing.seller_gradient ?? "linear-gradient(135deg, #FF1F7D, #FF9ECA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-jost)", flexShrink: 0,
                }}>
                  {listing.seller_initials ?? listing.seller_name?.[0] ?? "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "#fff" }}>{listing.seller_name ?? "Unknown"}</p>
                  {avgRating && (
                    <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                      ⭐ {avgRating} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setTab("seller")}
                  style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 20, padding: "6px 14px", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
                >
                  Profile →
                </button>
              </div>

              {/* Action buttons */}
              {!isMine && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  {listing.listing_type === "give_away" && (
                    <button
                      onClick={() => onInquire?.("inquire")}
                      style={{ width: "100%", background: FREE_GREEN, color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 14, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer" }}
                    >
                      Inquire 🎁
                    </button>
                  )}
                  {listing.listing_type === "swap" && (
                    <button
                      onClick={() => onInquire?.("swap_offer")}
                      style={{ width: "100%", background: SWAP_TEAL, color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 14, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer" }}
                    >
                      Offer a Swap ↔
                    </button>
                  )}
                  {(listing.listing_type === "sell" || listing.listing_type === "sell_or_swap") && (
                    <button
                      onClick={onBuy}
                      style={{ width: "100%", background: PINK, color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 14, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer" }}
                    >
                      Buy · {price}
                    </button>
                  )}
                  {listing.listing_type === "sell_or_swap" && (
                    <button
                      onClick={() => onInquire?.("swap_offer")}
                      style={{ width: "100%", background: "transparent", color: SWAP_TEAL, border: `1.5px solid ${SWAP_TEAL}`, borderRadius: 14, padding: "13px 0", fontSize: 14, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}
                    >
                      Offer a Swap ↔
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── COMMENTS TAB ────────────────────────────────────────────────── */}
          {tab === "comments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {comments.length === 0 ? (
                <p style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 15, color: "rgba(255,255,255,0.3)", textAlign: "center", paddingTop: 20 }}>
                  No comments yet — be the first ✦
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #FF1F7D, #FF9ECA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "var(--font-jost)", flexShrink: 0 }}>
                      {c.author_name?.[0] ?? "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 3px", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{c.author_name ?? "Someone"}</p>
                      <p style={{ margin: 0, fontFamily: "var(--font-caveat), cursive", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>{c.body}</p>
                      <p style={{ margin: "3px 0 0", fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
                        {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Comment composer */}
              <div style={{ marginTop: 8 }}>
                <textarea
                  rows={2}
                  placeholder="Ask a question or leave a comment…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ ...sharedInput, fontFamily: "var(--font-caveat), cursive", fontSize: 15, marginBottom: 8 }}
                />
                <button
                  onClick={() => void handleComment()}
                  disabled={postingComment || !commentText.trim()}
                  style={{
                    width: "100%", background: postingComment || !commentText.trim() ? "rgba(255,255,255,0.08)" : PINK,
                    color: "#fff", border: "none", borderRadius: 12, padding: "12px 0",
                    fontSize: 13, fontFamily: "var(--font-jost)", fontWeight: 700,
                    cursor: postingComment || !commentText.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {postingComment ? "Posting…" : "Post Comment"}
                </button>
              </div>
            </div>
          )}

          {/* ── SELLER TAB ──────────────────────────────────────────────────── */}
          {tab === "seller" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Seller header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: listing.seller_gradient ?? "linear-gradient(135deg, #FF1F7D, #FF9ECA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "var(--font-jost)",
                }}>
                  {listing.seller_initials ?? listing.seller_name?.[0] ?? "?"}
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "#fff" }}>
                    {listing.seller_name ?? "Unknown"}
                  </p>
                  <p style={{ margin: "3px 0 0", fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {listing.city ? `📍 ${listing.city}` : "Hanger member"}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                  <p style={{ margin: 0, fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: "#fff" }}>
                    {avgRating ?? "—"}
                  </p>
                  <p style={{ margin: "3px 0 0", fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                    Avg Rating
                  </p>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                  <p style={{ margin: 0, fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: "#fff" }}>
                    {reviews.length}
                  </p>
                  <p style={{ margin: "3px 0 0", fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                    Reviews
                  </p>
                </div>
              </div>

              {/* Reviews list */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                    Reviews
                  </p>
                  {!isMine && !reviewSubmitted && (
                    <button
                      onClick={() => setShowReviewForm(v => !v)}
                      style={{ background: "rgba(255,31,125,0.12)", border: `1px solid ${PINK}33`, borderRadius: 20, padding: "5px 12px", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, cursor: "pointer" }}
                    >
                      Leave a Review
                    </button>
                  )}
                </div>

                {/* Review form */}
                {showReviewForm && !reviewSubmitted && (
                  <div style={{ background: "rgba(255,31,125,0.06)", border: `1px solid ${PINK}22`, borderRadius: 14, padding: "14px", marginBottom: 14 }}>
                    {/* Stars */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            fontSize: 26, padding: 0,
                            filter: star <= reviewRating ? "none" : "grayscale(1) opacity(0.3)",
                          }}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Share your experience with this seller…"
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      style={{ ...sharedInput, fontFamily: "var(--font-caveat), cursive", fontSize: 15, marginBottom: 8 }}
                    />
                    {reviewError && (
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", margin: "0 0 8px" }}>{reviewError}</p>
                    )}
                    <button
                      onClick={() => void handleReview()}
                      disabled={reviewSubmitting}
                      style={{
                        width: "100%", background: reviewSubmitting ? "rgba(255,255,255,0.1)" : PINK,
                        color: "#fff", border: "none", borderRadius: 12, padding: "12px 0",
                        fontSize: 13, fontFamily: "var(--font-jost)", fontWeight: 700,
                        cursor: reviewSubmitting ? "not-allowed" : "pointer",
                      }}
                    >
                      {reviewSubmitting ? "Submitting…" : "Submit Review"}
                    </button>
                  </div>
                )}

                {reviewSubmitted && (
                  <div style={{ background: `${PINK}12`, border: `1px solid ${PINK}33`, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
                    <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK }}>✓ Review submitted — thank you!</p>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <p style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 14, color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "16px 0" }}>
                    No reviews yet — be the first ✦
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {reviews.map((r) => (
                      <div key={r.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          {"⭐".repeat(r.rating)}
                          <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>
                            {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                          </span>
                        </div>
                        {r.body && (
                          <p style={{ margin: 0, fontFamily: "var(--font-caveat), cursive", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>
                            {r.body}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
