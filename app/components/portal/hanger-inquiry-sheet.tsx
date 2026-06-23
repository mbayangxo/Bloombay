"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendHangerMessage, getHangerThread } from "@/lib/actions/hanger";
import type { HangerMessage } from "@/lib/actions/hanger";

const PINK       = "#FF1F7D";
const SWAP_TEAL  = "#00C6A7";
const FREE_GREEN = "#16A34A";
const PAPER      = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

export interface InquiryListing {
  id: string;
  seller_id: string;
  seller_name: string | null;
  title: string;
  listing_type: "sell" | "swap" | "sell_or_swap" | "give_away";
  city: string | null;
}

interface Props {
  listing: InquiryListing;
  mode: "inquire" | "swap_offer";
  onClose: () => void;
}

export function HangerInquirySheet({ listing, mode, onClose }: Props) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [message,       setMessage]       = useState(
    mode === "inquire"
      ? `Hi! I'm interested in your ${listing.title}. Is it still available?`
      : ""
  );
  const [swapPhotoFile,  setSwapPhotoFile]  = useState<File | null>(null);
  const [swapPhotoUrl,   setSwapPhotoUrl]   = useState<string | null>(null);
  const [swapPhotoPreview, setSwapPhotoPreview] = useState<string | null>(null);
  const [thread,         setThread]         = useState<HangerMessage[]>([]);
  const [loadingThread,  setLoadingThread]  = useState(true);
  const [sending,        setSending]        = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [sent,           setSent]           = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);

  const accentColor = mode === "inquire" ? FREE_GREEN : SWAP_TEAL;

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingThread(false); return; }
      setCurrentUserId(user.id);
      const msgs = await getHangerThread(listing.id, listing.seller_id);
      setThread(msgs);
      setLoadingThread(false);
    })();
  }, [listing.id, listing.seller_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSwapPhotoFile(file);
    setSwapPhotoPreview(URL.createObjectURL(file));
  }

  async function uploadSwapPhoto(): Promise<string | null> {
    if (!swapPhotoFile || !currentUserId) return null;
    setUploadingPhoto(true);
    try {
      const supabase = createClient();
      const ext = swapPhotoFile.name.split(".").pop() ?? "jpg";
      const path = `hanger-swaps/${currentUserId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avenue-media")
        .upload(path, swapPhotoFile, { upsert: true });
      if (upErr) { setError(upErr.message); return null; }
      const { data } = supabase.storage.from("avenue-media").getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSend() {
    if (!message.trim() && !swapPhotoFile) {
      setError("Add a message or a photo.");
      return;
    }
    setSending(true);
    setError(null);

    let photoUrl: string | null = null;
    if (swapPhotoFile) {
      photoUrl = await uploadSwapPhoto();
      if (!photoUrl) { setSending(false); return; }
      setSwapPhotoUrl(photoUrl);
    }

    const result = await sendHangerMessage({
      listing_id:   listing.id,
      recipient_id: listing.seller_id,
      body:         message.trim() || undefined,
      photo_url:    photoUrl ?? undefined,
      message_type: mode === "swap_offer" ? "swap_offer" : "text",
      meta:         mode === "swap_offer" ? { swap_offer: true } : undefined,
    });

    setSending(false);
    if (!result.ok) { setError(result.error ?? "Something went wrong."); return; }

    setSent(true);
    const msgs = await getHangerThread(listing.id, listing.seller_id);
    setThread(msgs);
    setMessage("");
    setSwapPhotoFile(null);
    setSwapPhotoPreview(null);
  }

  const sharedInput: React.CSSProperties = {
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
    resize: "none" as const,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 90 }}
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
          maxHeight: "88dvh",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "8px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 2px",
                }}
              >
                {mode === "inquire" ? "Inquire about this" : "Offer a Swap"}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}
              >
                {listing.title}
                {listing.city ? ` · 📍 ${listing.city}` : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.6)",
                fontSize: 16,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Mode context pill */}
          {mode === "inquire" && (
            <div
              style={{
                marginTop: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: `${FREE_GREEN}18`,
                border: `1px solid ${FREE_GREEN}44`,
                borderRadius: 20,
                padding: "5px 12px",
              }}
            >
              <span style={{ fontSize: 13 }}>🎁</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: FREE_GREEN, letterSpacing: "0.04em" }}>
                FREE ITEM — multiple people can inquire
              </span>
            </div>
          )}
          {mode === "swap_offer" && (
            <div
              style={{
                marginTop: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: `${SWAP_TEAL}18`,
                border: `1px solid ${SWAP_TEAL}44`,
                borderRadius: 20,
                padding: "5px 12px",
              }}
            >
              <span style={{ fontSize: 13 }}>↔</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: SWAP_TEAL, letterSpacing: "0.04em" }}>
                Send a photo of what you want to offer
              </span>
            </div>
          )}
        </div>

        {/* Thread */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {loadingThread ? (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", paddingTop: 20 }}>
              Loading…
            </p>
          ) : thread.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 20 }}>
              <span style={{ fontSize: 32 }}>{mode === "inquire" ? "🎁" : "↔"}</span>
              <p style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 15, color: "rgba(255,255,255,0.35)", textAlign: "center", margin: 0 }}>
                {mode === "inquire"
                  ? "Start the conversation — let them know you're interested."
                  : "Show them what you'd like to swap. Attach a photo of your item."}
              </p>
            </div>
          ) : (
            thread.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      background: isMine
                        ? (msg.message_type === "swap_offer" ? `${SWAP_TEAL}22` : `${PINK}22`)
                        : "rgba(255,255,255,0.07)",
                      border: isMine
                        ? `1px solid ${msg.message_type === "swap_offer" ? SWAP_TEAL : PINK}44`
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      padding: "10px 12px",
                    }}
                  >
                    {/* Swap offer badge */}
                    {msg.message_type === "swap_offer" && (
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: SWAP_TEAL, margin: "0 0 6px", textTransform: "uppercase" }}>
                        ↔ Swap Offer
                      </p>
                    )}
                    {/* Photo */}
                    {msg.photo_url && (
                      <img
                        src={msg.photo_url}
                        alt="swap offer"
                        style={{ width: "100%", borderRadius: 8, marginBottom: msg.body ? 8 : 0, display: "block" }}
                      />
                    )}
                    {/* Body */}
                    {msg.body && (
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1.45 }}>
                        {msg.body}
                      </p>
                    )}
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.25)", margin: "4px 0 0", textAlign: "right" }}>
                      {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* Sent confirmation */}
          {sent && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}44`,
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <span style={{ fontSize: 16 }}>✓</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: accentColor, margin: 0 }}>
                {mode === "inquire"
                  ? "Message sent! They'll get back to you here."
                  : "Swap offer sent! They'll review and respond here."}
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Compose area */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "12px 16px 16px",
            flexShrink: 0,
          }}
        >
          {/* Swap photo upload */}
          {mode === "swap_offer" && (
            <div style={{ marginBottom: 10 }}>
              {swapPhotoPreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={swapPhotoPreview}
                    alt="your swap item"
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, display: "block" }}
                  />
                  <button
                    onClick={() => { setSwapPhotoFile(null); setSwapPhotoPreview(null); }}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#e53e3e",
                      border: "none",
                      color: "#fff",
                      fontSize: 10,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: `${SWAP_TEAL}14`,
                    border: `1.5px dashed ${SWAP_TEAL}55`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: SWAP_TEAL,
                    fontFamily: "var(--font-jost), sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <span style={{ fontSize: 18 }}>📷</span>
                  Add a photo of your swap item
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoSelect}
              />
            </div>
          )}

          {/* Message textarea */}
          <textarea
            rows={3}
            placeholder={mode === "inquire" ? "Write a message to the giver…" : "Describe your swap item, condition, size…"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              ...sharedInput,
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 15,
              marginBottom: 10,
              borderColor: `${accentColor}30`,
            }}
          />

          {/* Give away pickup/delivery hint */}
          {mode === "inquire" && (
            <p style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: "0 0 10px", lineHeight: 1.4 }}>
              📍 Once they reply, they can share their address for pickup — or arrange a delivery fee inside this chat.
            </p>
          )}

          {error && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", margin: "0 0 8px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            onClick={() => void handleSend()}
            disabled={sending || uploadingPhoto}
            style={{
              width: "100%",
              background: sending || uploadingPhoto ? "rgba(255,255,255,0.1)" : accentColor,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "14px 0",
              fontSize: 14,
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: sending || uploadingPhoto ? "not-allowed" : "pointer",
            }}
          >
            {uploadingPhoto ? "Uploading photo…" : sending ? "Sending…" : mode === "inquire" ? "Send Inquiry 🎁" : "Send Swap Offer ↔"}
          </button>
        </div>
      </div>
    </>
  );
}
