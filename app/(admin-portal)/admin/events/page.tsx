"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";
const INK   = "#111";
const BG    = "#F9F7F4";
const WHITE = "#ffffff";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EbEvent {
  id:          string;
  title:       string;
  description: string | null;
  url:         string;
  starts_at:   string;
  ends_at:     string;
  is_free:     boolean;
  image_url:   string | null;
  venue:       string | null;
  address:     string;
  city:        string;
  price_label: string;
}

interface CuratedEvent {
  id:                string;
  title:             string;
  starts_at:         string;
  city:              string;
  venue:             string | null;
  is_free:           boolean;
  ticket_price_cents: number | null;
  external_source:   string | null;
  status:            string;
  curated_by_admin:  boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtPrice(event: CuratedEvent) {
  if (event.is_free || !event.ticket_price_cents) return "Free";
  return `£${(event.ticket_price_cents / 100).toFixed(2)}`;
}

// ─── Import Overlay ───────────────────────────────────────────────────────────

interface ImportFormProps {
  event:    EbEvent;
  adminPw:  string;
  onSuccess: () => void;
  onCancel:  () => void;
}

function ImportForm({ event, adminPw, onSuccess, onCancel }: ImportFormProps) {
  const [title,    setTitle]    = useState(event.title);
  const [city,     setCity]     = useState(event.city);
  const [venue,    setVenue]    = useState(event.venue ?? "");
  const [startsAt, setStartsAt] = useState(event.starts_at.slice(0, 16));
  const [price,    setPrice]    = useState("");
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState("");

  async function handleImport() {
    setSaving(true);
    setErr("");
    const priceCents = price ? Math.round(parseFloat(price) * 100) : undefined;
    const res = await fetch("/api/admin/events", {
      method:  "POST",
      headers: {
        "Content-Type":     "application/json",
        "x-admin-password": adminPw,
      },
      body: JSON.stringify({
        title,
        description:        event.description ?? undefined,
        starts_at:          new Date(startsAt).toISOString(),
        ends_at:            event.ends_at,
        venue:              venue || undefined,
        city,
        image_url:          event.image_url ?? undefined,
        ticket_price_cents: priceCents,
        is_free:            !priceCents,
        external_url:       event.url,
        external_source:    "eventbrite",
      }),
    });
    setSaving(false);
    if (res.ok) {
      onSuccess();
    } else {
      const j = await res.json() as { error?: string };
      setErr(j.error ?? "Failed to import");
    }
  }

  return (
    <div
      style={{
        position:     "absolute",
        inset:        0,
        background:   "rgba(26,10,46,0.96)",
        borderRadius: 16,
        padding:      20,
        display:      "flex",
        flexDirection: "column",
        gap:          10,
        zIndex:       10,
        overflowY:    "auto",
      }}
    >
      <p style={{ color: PINK, fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 15, margin: 0 }}>
        Import to BloomBay
      </p>

      {[
        { label: "Title", value: title, set: setTitle, type: "text" },
        { label: "City",  value: city,  set: setCity,  type: "text" },
        { label: "Venue", value: venue, set: setVenue, type: "text" },
        { label: "Date & Time (UTC)", value: startsAt, set: setStartsAt, type: "datetime-local" },
      ].map(({ label, value, set, type }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ color: "#ccc", fontSize: 11, fontFamily: "Jost,sans-serif" }}>{label}</label>
          <input
            type={type}
            value={value}
            onChange={e => set(e.target.value)}
            style={{
              background:   "rgba(255,255,255,0.08)",
              border:       "1px solid rgba(255,255,255,0.15)",
              borderRadius: 6,
              padding:      "6px 8px",
              color:        WHITE,
              fontSize:     13,
              fontFamily:   "Jost,sans-serif",
              outline:      "none",
              width:        "100%",
              boxSizing:    "border-box",
            }}
          />
        </div>
      ))}

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <label style={{ color: "#ccc", fontSize: 11, fontFamily: "Jost,sans-serif" }}>
          BloomBay ticket price (£) — leave blank for free
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 15.00"
          value={price}
          onChange={e => setPrice(e.target.value)}
          style={{
            background:   "rgba(255,255,255,0.08)",
            border:       "1px solid rgba(255,255,255,0.15)",
            borderRadius: 6,
            padding:      "6px 8px",
            color:        WHITE,
            fontSize:     13,
            fontFamily:   "Jost,sans-serif",
            outline:      "none",
            width:        "100%",
            boxSizing:    "border-box",
          }}
        />
      </div>

      {err && (
        <p style={{ color: "#f87171", fontSize: 12, fontFamily: "Jost,sans-serif", margin: 0 }}>{err}</p>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={() => void handleImport()}
          disabled={saving}
          style={{
            flex:         1,
            background:   PINK,
            color:        WHITE,
            border:       "none",
            borderRadius: 8,
            padding:      "9px 0",
            fontFamily:   "Jost,sans-serif",
            fontWeight:   700,
            fontSize:     13,
            cursor:       saving ? "wait" : "pointer",
            opacity:      saving ? 0.7 : 1,
          }}
        >
          {saving ? "Adding…" : "Add to BloomBay ✦"}
        </button>
        <button
          onClick={onCancel}
          style={{
            flex:         0,
            background:   "rgba(255,255,255,0.1)",
            color:        WHITE,
            border:       "none",
            borderRadius: 8,
            padding:      "9px 14px",
            fontFamily:   "Jost,sans-serif",
            fontSize:     13,
            cursor:       "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── Eventbrite Card ──────────────────────────────────────────────────────────

interface EbCardProps {
  event:   EbEvent;
  adminPw: string;
  onImported: () => void;
}

function EbCard({ event, adminPw, onImported }: EbCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [added,    setAdded]    = useState(false);

  return (
    <div
      style={{
        position:     "relative",
        background:   WHITE,
        borderRadius: 16,
        boxShadow:    "0 2px 12px rgba(0,0,0,0.08)",
        overflow:     "hidden",
        display:      "flex",
        flexDirection: "column",
        minHeight:    280,
      }}
    >
      {/* Image */}
      {event.image_url ? (
        <div
          style={{
            height:     140,
            background: `url(${event.image_url}) center/cover no-repeat`,
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            height:     140,
            background: `linear-gradient(135deg, ${PLUM} 0%, #3b1f6e 100%)`,
            flexShrink: 0,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            color:      "rgba(255,255,255,0.3)",
            fontSize:   32,
          }}
        >
          ✦
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <p
          style={{
            margin:     0,
            fontFamily: "Jost,sans-serif",
            fontWeight: 700,
            fontSize:   14,
            color:      PLUM,
            lineHeight: 1.3,
            display:    "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow:   "hidden",
          }}
        >
          {event.title}
        </p>
        <p style={{ margin: 0, fontFamily: "Jost,sans-serif", fontSize: 12, color: "#666" }}>
          {fmtDate(event.starts_at)}
        </p>
        {event.venue && (
          <p style={{ margin: 0, fontFamily: "Jost,sans-serif", fontSize: 12, color: "#888" }}>
            {event.venue}
          </p>
        )}
        <p
          style={{
            margin:       0,
            fontFamily:   "Jost,sans-serif",
            fontSize:     12,
            color:        event.is_free ? "#10B981" : PINK,
            fontWeight:   600,
            marginTop:    "auto",
          }}
        >
          {event.price_label}
        </p>

        {added ? (
          <div
            style={{
              marginTop:    8,
              background:   "#ECFDF5",
              borderRadius: 8,
              padding:      "8px 12px",
              fontFamily:   "Jost,sans-serif",
              fontSize:     13,
              color:        "#10B981",
              fontWeight:   700,
              textAlign:    "center",
            }}
          >
            ✓ Added
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            style={{
              marginTop:    8,
              background:   PINK,
              color:        WHITE,
              border:       "none",
              borderRadius: 8,
              padding:      "8px 0",
              fontFamily:   "Jost,sans-serif",
              fontWeight:   700,
              fontSize:     13,
              cursor:       "pointer",
              width:        "100%",
            }}
          >
            Import to BloomBay +
          </button>
        )}
      </div>

      {/* Import overlay */}
      {showForm && !added && (
        <ImportForm
          event={event}
          adminPw={adminPw}
          onSuccess={() => { setShowForm(false); setAdded(true); onImported(); }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

// ─── Manual Create Form ───────────────────────────────────────────────────────

interface CreateFormProps {
  adminPw:  string;
  onCreated: () => void;
  onClose:   () => void;
}

function CreateForm({ adminPw, onCreated, onClose }: CreateFormProps) {
  const [title,       setTitle]       = useState("");
  const [city,        setCity]        = useState("");
  const [date,        setDate]        = useState("");
  const [time,        setTime]        = useState("19:00");
  const [venue,       setVenue]       = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl,    setImageUrl]    = useState("");
  const [price,       setPrice]       = useState("");
  const [maxAtt,      setMaxAtt]      = useState("");
  const [extUrl,      setExtUrl]      = useState("");
  const [saving,      setSaving]      = useState(false);
  const [err,         setErr]         = useState("");

  async function handleCreate() {
    if (!title || !city || !date) { setErr("Title, City, and Date are required."); return; }
    setSaving(true);
    setErr("");
    const startsAt  = new Date(`${date}T${time}`).toISOString();
    const priceCents = price ? Math.round(parseFloat(price) * 100) : undefined;

    const res = await fetch("/api/admin/events", {
      method:  "POST",
      headers: {
        "Content-Type":     "application/json",
        "x-admin-password": adminPw,
      },
      body: JSON.stringify({
        title,
        description:        description || undefined,
        starts_at:          startsAt,
        venue:              venue || undefined,
        city,
        image_url:          imageUrl || undefined,
        ticket_price_cents: priceCents,
        is_free:            !priceCents,
        external_url:       extUrl || undefined,
        external_source:    "manual",
        max_attendees:      maxAtt ? parseInt(maxAtt, 10) : undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      onCreated();
    } else {
      const j = await res.json() as { error?: string };
      setErr(j.error ?? "Failed to create event");
    }
  }

  const inputStyle: React.CSSProperties = {
    background:   WHITE,
    border:       "1px solid #e5e7eb",
    borderRadius: 8,
    padding:      "9px 12px",
    color:        INK,
    fontSize:     14,
    fontFamily:   "Jost,sans-serif",
    outline:      "none",
    width:        "100%",
    boxSizing:    "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "Jost,sans-serif",
    fontSize:   12,
    fontWeight: 600,
    color:      "#555",
    marginBottom: 4,
    display:    "block",
  };

  return (
    <div
      style={{
        background:   WHITE,
        borderRadius: 16,
        boxShadow:    "0 4px 24px rgba(0,0,0,0.10)",
        padding:      28,
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3
          style={{
            fontFamily: "'Fraunces',serif",
            fontStyle:  "italic",
            color:      PLUM,
            fontSize:   20,
            margin:     0,
          }}
        >
          Create Event Manually
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border:     "none",
            fontSize:   18,
            cursor:     "pointer",
            color:      "#999",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Title — full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="Event title" />
        </div>

        {/* City */}
        <div>
          <label style={labelStyle}>City *</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} style={inputStyle} placeholder="London" />
        </div>

        {/* Date */}
        <div>
          <label style={labelStyle}>Date *</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        {/* Time */}
        <div>
          <label style={labelStyle}>Time *</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
        </div>

        {/* Venue */}
        <div>
          <label style={labelStyle}>Venue</label>
          <input type="text" value={venue} onChange={e => setVenue(e.target.value)} style={inputStyle} placeholder="Venue name" />
        </div>

        {/* Ticket price */}
        <div>
          <label style={labelStyle}>Ticket price (£) — blank = free</label>
          <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} placeholder="e.g. 20.00" />
        </div>

        {/* Max attendees */}
        <div>
          <label style={labelStyle}>Max attendees</label>
          <input type="number" min="1" value={maxAtt} onChange={e => setMaxAtt(e.target.value)} style={inputStyle} placeholder="e.g. 50" />
        </div>

        {/* Description — full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Short description of the event"
          />
        </div>

        {/* Image URL — full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Image URL</label>
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} placeholder="https://…" />
        </div>

        {/* External URL — full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>External URL (optional)</label>
          <input type="url" value={extUrl} onChange={e => setExtUrl(e.target.value)} style={inputStyle} placeholder="https://eventbrite.com/…" />
        </div>
      </div>

      {err && (
        <p style={{ color: "#ef4444", fontFamily: "Jost,sans-serif", fontSize: 13, marginTop: 12 }}>{err}</p>
      )}

      <button
        onClick={() => void handleCreate()}
        disabled={saving}
        style={{
          marginTop:    20,
          background:   PINK,
          color:        WHITE,
          border:       "none",
          borderRadius: 10,
          padding:      "12px 28px",
          fontFamily:   "Jost,sans-serif",
          fontWeight:   700,
          fontSize:     15,
          cursor:       saving ? "wait" : "pointer",
          opacity:      saving ? 0.7 : 1,
        }}
      >
        {saving ? "Publishing…" : "Publish Event ✦"}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
  useEffect(() => { document.title = "Events — BloomBay Admin"; }, []);

  const [adminPw, setAdminPw]           = useState("");
  const [tab,     setTab]               = useState<"browse" | "my">("browse");

  // ── Browse tab state ──
  const [city,    setCity]     = useState("London");
  const [keyword, setKeyword]  = useState("women");
  const [results, setResults]  = useState<EbEvent[]>([]);
  const [total,   setTotal]    = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");

  // ── My Events tab state ──
  const [myEvents,    setMyEvents]    = useState<CuratedEvent[]>([]);
  const [myLoading,   setMyLoading]   = useState(false);
  const [myErr,       setMyErr]       = useState("");
  const [showCreate,  setShowCreate]  = useState(false);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);

  // Read password from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminPw(localStorage.getItem("bb_admin_pw") ?? "");
    }
  }, []);

  // ── Fetch my events whenever tab switches to "my" ──
  const loadMyEvents = useCallback(async () => {
    setMyLoading(true);
    setMyErr("");
    try {
      const res = await fetch("/api/admin/events", {
        headers: { "x-admin-password": adminPw },
      });
      if (res.ok) {
        setMyEvents(await res.json() as CuratedEvent[]);
      } else {
        const j = await res.json() as { error?: string };
        setMyErr(j.error ?? "Failed to load events");
      }
    } catch {
      setMyErr("Network error");
    }
    setMyLoading(false);
  }, [adminPw]);

  useEffect(() => {
    if (tab === "my") void loadMyEvents();
  }, [tab, loadMyEvents]);

  // ── Search Eventbrite ──
  async function handleSearch() {
    setSearching(true);
    setSearchErr("");
    setResults([]);
    setTotal(null);
    try {
      const params = new URLSearchParams({ city, q: keyword });
      const res = await fetch(`/api/admin/eventbrite?${params.toString()}`, {
        headers: { "x-admin-password": adminPw },
      });
      if (res.ok) {
        const json = await res.json() as { events: EbEvent[]; total: number };
        setResults(json.events);
        setTotal(json.total);
      } else {
        const j = await res.json() as { error?: string };
        setSearchErr(j.error ?? "Search failed");
      }
    } catch {
      setSearchErr("Network error");
    }
    setSearching(false);
  }

  // ── Delete event ──
  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method:  "DELETE",
        headers: { "x-admin-password": adminPw },
      });
      if (res.ok) {
        setMyEvents(prev => prev.filter(e => e.id !== id));
      } else {
        const j = await res.json() as { error?: string };
        alert(j.error ?? "Failed to delete");
      }
    } catch {
      alert("Network error");
    }
    setDeletingId(null);
  }

  // ── Shared button style ──
  const tabBtn = (active: boolean): React.CSSProperties => ({
    background:   active ? PLUM : "transparent",
    color:        active ? WHITE : PLUM,
    border:       `2px solid ${PLUM}`,
    borderRadius: 10,
    padding:      "9px 22px",
    fontFamily:   "Jost,sans-serif",
    fontWeight:   700,
    fontSize:     14,
    cursor:       "pointer",
    transition:   "all 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "'Fraunces',serif",
              fontStyle:  "italic",
              color:      PLUM,
              fontSize:   36,
              margin:     0,
            }}
          >
            Event Curation
          </h1>
          <p style={{ fontFamily: "Jost,sans-serif", color: "#666", marginTop: 6, marginBottom: 0 }}>
            Discover Eventbrite events to feature, or create your own.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <button style={tabBtn(tab === "browse")} onClick={() => setTab("browse")}>
            Browse Eventbrite
          </button>
          <button style={tabBtn(tab === "my")} onClick={() => setTab("my")}>
            My Events
          </button>
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* BROWSE TAB                                      */}
        {/* ══════════════════════════════════════════════ */}
        {tab === "browse" && (
          <div>
            {/* Search bar */}
            <div
              style={{
                background:   WHITE,
                borderRadius: 14,
                boxShadow:    "0 2px 12px rgba(0,0,0,0.07)",
                padding:      "20px 24px",
                marginBottom: 28,
                display:      "flex",
                gap:          12,
                flexWrap:     "wrap",
                alignItems:   "flex-end",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 160px", minWidth: 140 }}>
                <label
                  style={{
                    fontFamily: "Jost,sans-serif",
                    fontSize:   12,
                    fontWeight: 600,
                    color:      "#555",
                  }}
                >
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && void handleSearch()}
                  placeholder="London"
                  style={{
                    border:       "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding:      "9px 12px",
                    fontFamily:   "Jost,sans-serif",
                    fontSize:     14,
                    color:        INK,
                    outline:      "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "2 1 220px", minWidth: 180 }}>
                <label
                  style={{
                    fontFamily: "Jost,sans-serif",
                    fontSize:   12,
                    fontWeight: 600,
                    color:      "#555",
                  }}
                >
                  Keyword
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && void handleSearch()}
                  placeholder="women, wellness, art…"
                  style={{
                    border:       "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding:      "9px 12px",
                    fontFamily:   "Jost,sans-serif",
                    fontSize:     14,
                    color:        INK,
                    outline:      "none",
                  }}
                />
              </div>

              <button
                onClick={() => void handleSearch()}
                disabled={searching}
                style={{
                  background:   PINK,
                  color:        WHITE,
                  border:       "none",
                  borderRadius: 9,
                  padding:      "10px 24px",
                  fontFamily:   "Jost,sans-serif",
                  fontWeight:   700,
                  fontSize:     14,
                  cursor:       searching ? "wait" : "pointer",
                  opacity:      searching ? 0.7 : 1,
                  whiteSpace:   "nowrap",
                  flexShrink:   0,
                }}
              >
                {searching ? "Searching…" : "Search"}
              </button>
            </div>

            {/* Error */}
            {searchErr && (
              <p
                style={{
                  color:      "#ef4444",
                  fontFamily: "Jost,sans-serif",
                  fontSize:   14,
                  marginBottom: 16,
                }}
              >
                {searchErr}
              </p>
            )}

            {/* Result count */}
            {total !== null && !searching && (
              <p
                style={{
                  fontFamily: "Jost,sans-serif",
                  fontSize:   13,
                  color:      "#888",
                  marginBottom: 16,
                }}
              >
                {total.toLocaleString()} events found · showing {results.length}
              </p>
            )}

            {/* Grid */}
            {results.length > 0 && (
              <div
                style={{
                  display:             "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap:                 20,
                }}
              >
                {results.map(ev => (
                  <EbCard
                    key={ev.id}
                    event={ev}
                    adminPw={adminPw}
                    onImported={() => { /* could refresh my events count */ }}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!searching && results.length === 0 && total === null && (
              <div
                style={{
                  textAlign:  "center",
                  padding:    "60px 20px",
                  color:      "#bbb",
                  fontFamily: "Jost,sans-serif",
                  fontSize:   15,
                }}
              >
                Search for events above to get started.
              </div>
            )}

            {!searching && results.length === 0 && total === 0 && (
              <div
                style={{
                  textAlign:  "center",
                  padding:    "60px 20px",
                  color:      "#888",
                  fontFamily: "Jost,sans-serif",
                  fontSize:   15,
                }}
              >
                No events found. Try a different city or keyword.
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* MY EVENTS TAB                                  */}
        {/* ══════════════════════════════════════════════ */}
        {tab === "my" && (
          <div>
            {/* Toolbar */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <button
                onClick={() => setShowCreate(v => !v)}
                style={{
                  background:   PINK,
                  color:        WHITE,
                  border:       "none",
                  borderRadius: 10,
                  padding:      "10px 22px",
                  fontFamily:   "Jost,sans-serif",
                  fontWeight:   700,
                  fontSize:     14,
                  cursor:       "pointer",
                }}
              >
                {showCreate ? "Cancel" : "Create Event Manually"}
              </button>
            </div>

            {/* Create form */}
            {showCreate && (
              <CreateForm
                adminPw={adminPw}
                onCreated={() => { setShowCreate(false); void loadMyEvents(); }}
                onClose={() => setShowCreate(false)}
              />
            )}

            {/* Loading */}
            {myLoading && (
              <p style={{ fontFamily: "Jost,sans-serif", color: "#888", textAlign: "center", padding: 40 }}>
                Loading events…
              </p>
            )}

            {/* Error */}
            {myErr && (
              <p style={{ color: "#ef4444", fontFamily: "Jost,sans-serif", fontSize: 14 }}>{myErr}</p>
            )}

            {/* Events table */}
            {!myLoading && !myErr && myEvents.length > 0 && (
              <div
                style={{
                  background:   WHITE,
                  borderRadius: 16,
                  boxShadow:    "0 2px 12px rgba(0,0,0,0.07)",
                  overflow:     "hidden",
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display:    "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
                    gap:        12,
                    padding:    "12px 20px",
                    background: "#f8f5ff",
                    borderBottom: "1px solid #ede9f8",
                  }}
                >
                  {["Title", "Date", "City", "Price", "Source", ""].map(h => (
                    <span
                      key={h}
                      style={{
                        fontFamily: "Jost,sans-serif",
                        fontWeight: 700,
                        fontSize:   12,
                        color:      PLUM,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                {myEvents.map((ev, i) => (
                  <div
                    key={ev.id}
                    style={{
                      display:    "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
                      gap:        12,
                      padding:    "14px 20px",
                      borderBottom: i < myEvents.length - 1 ? "1px solid #f3f4f6" : "none",
                      alignItems: "center",
                      background: WHITE,
                    }}
                  >
                    {/* Title */}
                    <span
                      style={{
                        fontFamily: "Jost,sans-serif",
                        fontSize:   14,
                        fontWeight: 600,
                        color:      INK,
                        overflow:   "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.title}
                    </span>

                    {/* Date */}
                    <span style={{ fontFamily: "Jost,sans-serif", fontSize: 13, color: "#555" }}>
                      {new Date(ev.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>

                    {/* City */}
                    <span style={{ fontFamily: "Jost,sans-serif", fontSize: 13, color: "#555" }}>
                      {ev.city}
                    </span>

                    {/* Price */}
                    <span
                      style={{
                        fontFamily: "Jost,sans-serif",
                        fontSize:   13,
                        fontWeight: 600,
                        color:      ev.is_free ? "#10B981" : PINK,
                      }}
                    >
                      {fmtPrice(ev)}
                    </span>

                    {/* Source badge */}
                    <span
                      style={{
                        display:      "inline-block",
                        background:   ev.external_source === "eventbrite" ? "#FFF3CD" : "#EDE9FE",
                        color:        ev.external_source === "eventbrite" ? "#856404" : PLUM,
                        borderRadius: 6,
                        padding:      "3px 8px",
                        fontFamily:   "Jost,sans-serif",
                        fontSize:     11,
                        fontWeight:   700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        whiteSpace:   "nowrap",
                      }}
                    >
                      {ev.external_source === "eventbrite" ? "Eventbrite" : "Manual"}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => void handleDelete(ev.id)}
                      disabled={deletingId === ev.id}
                      style={{
                        background:   "none",
                        border:       "1px solid #fca5a5",
                        borderRadius: 7,
                        padding:      "5px 10px",
                        color:        "#ef4444",
                        fontFamily:   "Jost,sans-serif",
                        fontSize:     12,
                        cursor:       deletingId === ev.id ? "wait" : "pointer",
                        opacity:      deletingId === ev.id ? 0.5 : 1,
                        whiteSpace:   "nowrap",
                      }}
                    >
                      {deletingId === ev.id ? "…" : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!myLoading && !myErr && myEvents.length === 0 && (
              <div
                style={{
                  textAlign:  "center",
                  padding:    "60px 20px",
                  color:      "#bbb",
                  fontFamily: "Jost,sans-serif",
                  fontSize:   15,
                }}
              >
                No curated events yet. Import from Eventbrite or create one manually.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
