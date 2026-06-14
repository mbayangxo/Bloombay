"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";

type ListingType = "room" | "apartment" | "roommate-wanted" | "co-search";

interface GMListing {
  id: string;
  listing_type: ListingType;
  city: string;
  neighborhood_name: string | null;
  price_cents: number | null;
  available_from: string | null;
  furnished: boolean;
  private_bathroom: boolean;
  description: string | null;
  display_name: string | null;
  lifestyle_tags: string[] | null;
  is_active: boolean;
  profile: { id: string; first_name: string | null; full_name: string | null } | null;
}

interface Message {
  id: string;
  body: string;
  read: boolean;
  created_at: string;
  from_user: { id: string; first_name: string | null } | null;
  to_user: { id: string; first_name: string | null } | null;
  listing: { id: string; neighborhood_name: string | null } | null;
}

const LISTING_LABEL: Record<ListingType, string> = {
  "room":            "Room Available",
  "apartment":       "Full Apartment",
  "roommate-wanted": "Looking for Roommate",
  "co-search":       "Co-Searching",
};

const COLORS = ["#FF1F7D", "#C084FC", "#34D399", "#60A5FA", "#F59E0B", "#F87171"];

function GMLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="14" r="10" stroke={PINK} strokeWidth="2.2" />
      <path d="M12 13.5c0-1.5 1.2-2.5 2.5-2.5.8 0 1.4.4 1.8.9.4-.5 1-.9 1.8-.9 1.3 0 2.4 1 2.4 2.5 0 1.8-2 3.5-4.2 4.8-2.2-1.3-4.3-3-4.3-4.8z" fill={PINK} />
      <line x1="16" y1="24" x2="16" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="29" x2="20" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ListingCard({ listing, idx, userId, onContact }: {
  listing: GMListing; idx: number; userId: string | null;
  onContact: (toUserId: string, listingId: string, name: string) => void;
}) {
  const price   = listing.price_cents ? `$${Math.round(listing.price_cents / 100).toLocaleString()}/mo` : null;
  const name    = listing.display_name ?? listing.profile?.first_name ?? "A member";
  const color   = COLORS[idx % COLORS.length];
  const initial = name[0]?.toUpperCase() ?? "G";
  const isMine  = listing.profile?.id === userId;

  return (
    <div style={{
      background: "rgba(255,255,255,0.06)", borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden",
    }}>
      {/* Color bar */}
      <div style={{ height: 3, background: color }} />
      <div style={{ padding: "14px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{
            fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
            color: color, background: `${color}22`, borderRadius: 999, padding: "3px 8px",
          }}>
            {LISTING_LABEL[listing.listing_type]}
          </span>
          {price && (
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "white" }}>{price}</span>
          )}
        </div>

        {/* Location */}
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 15, color: "white", marginBottom: 4, lineHeight: 1.2 }}>
          {listing.neighborhood_name ?? listing.city}
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{listing.city}</p>

        {/* Description */}
        {listing.description && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, marginBottom: 10 }}>
            {listing.description.slice(0, 100)}{listing.description.length > 100 ? "…" : ""}
          </p>
        )}

        {/* Tags */}
        {(listing.lifestyle_tags?.length ?? 0) > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {(listing.lifestyle_tags ?? []).slice(0, 3).map(t => (
              <span key={t} style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.07)", borderRadius: 99, padding: "2px 8px" }}>{t}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", fontFamily: "var(--font-jost)" }}>
              {initial}
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{name}</span>
          </div>

          {isMine ? (
            <Link href="/girlmate/post" style={{
              fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)",
              textDecoration: "none", background: "rgba(255,255,255,0.08)", borderRadius: 99, padding: "5px 10px",
            }}>
              Edit ✎
            </Link>
          ) : listing.profile?.id ? (
            <button
              onClick={() => onContact(listing.profile!.id!, listing.id, name)}
              style={{
                fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white",
                background: PINK, border: "none", borderRadius: 99, padding: "6px 14px", cursor: "pointer",
              }}
            >
              Message ♡
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Contact modal ──────────────────────────────────────────────────────────────
function ContactModal({ name, listingId, toUserId, onClose, onSent }: {
  name: string; listingId: string; toUserId: string;
  onClose: () => void; onSent: () => void;
}) {
  const [msg, setMsg]       = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr]       = useState<string | null>(null);

  async function send() {
    if (!msg.trim()) return;
    setSending(true);
    const res = await fetch("/api/girlmate/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to_user_id: toUserId, listing_id: listingId, body: msg }),
    });
    setSending(false);
    if (!res.ok) { const d = await res.json() as { error?: string }; setErr(d.error ?? "Error"); return; }
    onSent();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#1a0d2e", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 500, paddingBottom: "calc(24px + env(safe-area-inset-bottom,0px))" }} onClick={e => e.stopPropagation()}>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 18, color: "white", marginBottom: 4 }}>Message {name}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>About their listing — introduce yourself.</p>
        {err && <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: PINK, marginBottom: 10 }}>{err}</p>}
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Hi! I came across your listing and…"
          rows={4}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "white", fontFamily: "var(--font-jost)", fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 99, background: "rgba(255,255,255,0.07)", border: "none", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => void send()} disabled={sending || !msg.trim()} style={{ flex: 2, padding: "13px", borderRadius: 99, background: PINK, border: "none", color: "white", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
            {sending ? "Sending…" : "Send message ♡"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Home ──────────────────────────────────────────────────────────────────
export function GMHomePage() {
  const router = useRouter();
  const [userId, setUserId]     = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [myListing, setMyListing] = useState<GMListing | null | undefined>(undefined);
  const [listings, setListings] = useState<GMListing[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab]           = useState<"available" | "looking">("available");
  const [city, setCity]         = useState("New York City");
  const [contactTarget, setContactTarget] = useState<{ toUserId: string; listingId: string; name: string } | null>(null);
  const [msgSent, setMsgSent]   = useState(false);
  const [tab2, setTab2]         = useState<"browse" | "inbox">("browse");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/girlmate/login"); return; }
      setUserId(user.id);
      supabase.from("profiles").select("first_name").eq("id", user.id).single()
        .then(({ data }) => setFirstName(data?.first_name ?? null));
    });
  }, [router]);

  useEffect(() => {
    fetch("/api/girlmate/my-listing")
      .then(r => r.ok ? r.json() : null)
      .then((d: GMListing | null) => setMyListing(d))
      .catch(() => setMyListing(null));
  }, []);

  useEffect(() => {
    fetch(`/api/girlmate?tab=${tab}&city=${encodeURIComponent(city)}`)
      .then(r => r.ok ? r.json() : [])
      .then((d: GMListing[]) => setListings(d ?? []))
      .catch(() => {});
  }, [tab, city]);

  useEffect(() => {
    fetch("/api/girlmate/messages")
      .then(r => r.ok ? r.json() : [])
      .then((d: Message[]) => setMessages(d ?? []))
      .catch(() => {});
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/girlmate");
  }

  const unread = messages.filter(m => !m.read && m.to_user?.id === userId).length;

  return (
    <div style={{ minHeight: "100vh", background: PLUM, paddingBottom: 40 }}>
      <style>{`
        .gm-tab { padding: 8px 16px; border-radius: 99px; font-family: var(--font-jost); font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: all 0.15s; }
        .gm-city { padding: 8px 14px; border-radius: 99px; font-family: var(--font-jost); font-size: 12px; font-weight: 600; cursor: pointer; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); }
      `}</style>

      {/* ── NAV ── */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GMLogo size={28} />
          <div>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: "white", lineHeight: 1 }}>GirlMate</p>
            {firstName && <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Hi, {firstName} ♡</p>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setTab2(tab2 === "inbox" ? "browse" : "inbox")}
            style={{ position: "relative", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "7px 13px", cursor: "pointer", color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700 }}
          >
            Inbox
            {unread > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: PINK, borderRadius: 99, width: 16, height: 16, fontSize: 9, fontFamily: "var(--font-jost)", fontWeight: 800, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>}
          </button>
          <button onClick={() => void signOut()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-jost)" }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px" }}>

        {/* ── MY LISTING ── */}
        <section style={{ marginTop: 24, marginBottom: 28 }}>
          {myListing === undefined ? (
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, height: 80, animation: "pulse 1.5s ease-in-out infinite" }} />
          ) : myListing ? (
            <div style={{ background: "rgba(255,31,125,0.1)", borderRadius: 16, padding: "16px 18px", border: "1.5px solid rgba(255,31,125,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: PINK, letterSpacing: "0.12em", marginBottom: 4 }}>MY LISTING {myListing.is_active ? "· LIVE ●" : "· PAUSED"}</p>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: "white" }}>{myListing.neighborhood_name ?? myListing.city}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{LISTING_LABEL[myListing.listing_type]} · {myListing.price_cents ? `$${Math.round(myListing.price_cents / 100).toLocaleString()}/mo` : "Price not listed"}</p>
              </div>
              <Link href="/girlmate/post" style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: "white", textDecoration: "none", background: PINK, borderRadius: 99, padding: "8px 14px" }}>
                Edit
              </Link>
            </div>
          ) : (
            <Link href="/girlmate/post" style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "20px 18px", border: "1.5px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,31,125,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🏡</div>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 700, color: "white", marginBottom: 3 }}>Post your listing</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Let women find you — or find them.</p>
                </div>
                <p style={{ marginLeft: "auto", color: PINK, fontSize: 20 }}>→</p>
              </div>
            </Link>
          )}
        </section>

        {/* ── INBOX ── */}
        {tab2 === "inbox" && (
          <section style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>INBOX</p>
            {messages.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "24px 18px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>No messages yet. Contact someone below!</p>
              </div>
            ) : messages.map(m => {
              const isFromMe = m.from_user?.id === userId;
              const other = isFromMe ? m.to_user : m.from_user;
              return (
                <div key={m.id} style={{ background: m.read || isFromMe ? "rgba(255,255,255,0.04)" : "rgba(255,31,125,0.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${m.read || isFromMe ? "rgba(255,255,255,0.08)" : "rgba(255,31,125,0.2)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                      {isFromMe ? `To: ${other?.first_name ?? "member"}` : `From: ${other?.first_name ?? "member"}`}
                      {!m.read && !isFromMe && <span style={{ marginLeft: 8, background: PINK, borderRadius: 99, padding: "1px 6px", fontSize: 9, color: "white", fontWeight: 800 }}>NEW</span>}
                    </p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{new Date(m.created_at).toLocaleDateString()}</p>
                  </div>
                  {m.listing && <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Re: {m.listing.neighborhood_name ?? "their listing"}</p>}
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{m.body}</p>
                </div>
              );
            })}
          </section>
        )}

        {/* ── BROWSE ── */}
        {tab2 === "browse" && (
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK }}>BROWSE LISTINGS</p>
              <select className="gm-city" value={city} onChange={e => setCity(e.target.value)} style={{ fontSize: 11, padding: "5px 10px" }}>
                {["New York City", "London", "Los Angeles", "Atlanta", "Chicago"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tab toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {(["available", "looking"] as const).map(t => (
                <button
                  key={t}
                  className="gm-tab"
                  onClick={() => setTab(t)}
                  style={{ background: tab === t ? PINK : "rgba(255,255,255,0.07)", color: tab === t ? "white" : "rgba(255,255,255,0.5)", border: `1px solid ${tab === t ? PINK : "rgba(255,255,255,0.1)"}` }}
                >
                  {t === "available" ? "Available" : "Looking"}
                </button>
              ))}
            </div>

            {listings.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "32px 18px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>No listings in {city} yet. Be the first!</p>
                <Link href="/girlmate/post" style={{ display: "inline-block", marginTop: 12, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", background: PINK, borderRadius: 99, padding: "8px 16px", textDecoration: "none" }}>Post a listing</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {listings.map((l, i) => (
                  <ListingCard
                    key={l.id} listing={l} idx={i} userId={userId}
                    onContact={(toUserId, listingId, name) => setContactTarget({ toUserId, listingId, name })}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Contact modal */}
      {contactTarget && (
        msgSent ? (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: PLUM, borderRadius: 20, padding: 32, textAlign: "center", maxWidth: 300 }}>
              <p style={{ fontSize: 32, marginBottom: 10 }}>💌</p>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, color: "white" }}>Message sent.</p>
              <button onClick={() => { setMsgSent(false); setContactTarget(null); }} style={{ marginTop: 16, background: PINK, border: "none", borderRadius: 99, padding: "10px 24px", color: "white", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Done</button>
            </div>
          </div>
        ) : (
          <ContactModal
            name={contactTarget.name}
            listingId={contactTarget.listingId}
            toUserId={contactTarget.toUserId}
            onClose={() => setContactTarget(null)}
            onSent={() => setMsgSent(true)}
          />
        )
      )}
    </div>
  );
}
