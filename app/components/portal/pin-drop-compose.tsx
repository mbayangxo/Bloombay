"use client";

import { useState, useEffect } from "react";

interface BouquetMember {
  id: string;
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
}

export function PinDropCompose({ onSent }: { onSent: () => void }) {
  const [open, setOpen]               = useState(false);
  const [location, setLocation]       = useState("");
  const [caption, setCaption]         = useState("");
  const [target, setTarget]           = useState<"public" | "bouquet" | "specific">("bouquet");
  const [notify, setNotify]           = useState(true);
  const [expiresHours, setExpiresHours] = useState(24);
  const [bouquet, setBouquet]         = useState<BouquetMember[]>([]);
  const [selected, setSelected]       = useState<string[]>([]);
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    if (!open) return;
    fetch("/api/member/bouquet")
      .then((r) => (r.ok ? r.json() : { members: [] }))
      .then((d) => setBouquet(d.members ?? []))
      .catch(() => undefined);
  }, [open]);

  async function handleSend() {
    if (!location.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/member/pin-drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          caption,
          target,
          recipient_ids: target === "specific" ? selected : undefined,
          notify,
          expires_hours: expiresHours,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setOpen(false);
        setLocation("");
        setCaption("");
        setTarget("bouquet");
        setSelected([]);
        onSent();
      }, 1800);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  const canSend = location.trim().length > 0 &&
    (target !== "specific" || selected.length > 0);

  function initials(m: BouquetMember) {
    const n = m.full_name || m.first_name || "?";
    return n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }

  return (
    <>
      {/* Drop a pin CTA */}
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          background: "#FF1F7D",
          border: "none",
          borderRadius: 14,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          cursor: "pointer",
          fontFamily: "Jost, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#fff",
          marginBottom: 24,
          transition: "transform 0.12s cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      >
        <span style={{ fontSize: 16 }}>📍</span>
        Drop a pin
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Compose sheet */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 101,
            background: "#fff",
            borderRadius: "20px 20px 0 0",
            padding: "20px 20px 40px",
            boxShadow: "0 -16px 48px rgba(0,0,0,0.12)",
            animation: "bloomFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          {/* Handle */}
          <div style={{ width: 36, height: 4, background: "#eee", borderRadius: 2, margin: "0 auto 20px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#111", margin: 0 }}>
              Drop a pin
            </h2>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#bbb", cursor: "pointer" }}>×</button>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#FF1F7D", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Where are you?
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", border: "1.5px solid #f0d0da", borderRadius: 10, padding: "10px 14px" }}>
              <span style={{ fontSize: 16 }}>📍</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Café Clover, West Village…"
                style={{ flex: 1, border: "none", outline: "none", fontFamily: "Jost, sans-serif", fontSize: 14, color: "#111", background: "transparent" }}
                autoFocus
              />
            </div>
          </div>

          {/* Caption */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#999", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              What's the vibe? (optional)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Come through, the coffee is perfect…"
              rows={2}
              style={{ width: "100%", border: "1.5px solid #eee", borderRadius: 10, padding: "10px 14px", fontFamily: "Jost, sans-serif", fontSize: 13, color: "#333", outline: "none", resize: "none", boxSizing: "border-box", background: "#fafafa" }}
            />
          </div>

          {/* Who sees it */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#999", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
              Who's invited?
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {([
                { value: "bouquet", label: "💐 My bouquet", sub: "Your inner circle" },
                { value: "specific", label: "👯 Specific girls", sub: "Pick from your bouquet" },
                { value: "public", label: "🌸 Anyone nearby", sub: "Visible to all bloomies" },
              ] as { value: "public" | "bouquet" | "specific"; label: string; sub: string }[]).map(({ value, label, sub }) => (
                <button
                  key={value}
                  onClick={() => setTarget(value)}
                  style={{
                    flex: "1 0 auto",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: target === value ? "1.5px solid #FF1F7D" : "1.5px solid #eee",
                    background: target === value ? "rgba(255,31,125,0.05)" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontFamily: "Jost, sans-serif", fontSize: 12, fontWeight: 700, color: target === value ? "#FF1F7D" : "#333" }}>{label}</div>
                  <div style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#aaa", marginTop: 2 }}>{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Specific girl picker */}
          {target === "specific" && bouquet.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#999", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
                Pick from your bouquet
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {bouquet.map((m) => {
                  const isSelected = selected.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelected(
                        isSelected ? selected.filter((id) => id !== m.id) : [...selected, m.id]
                      )}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: isSelected ? "1.5px solid #FF1F7D" : "1.5px solid #eee",
                        background: isSelected ? "rgba(255,31,125,0.04)" : "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {m.avatar_url ? (
                        <img src={m.avatar_url} alt={m.first_name ?? ""} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #FF1F7D, #FF9ECA)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Jost, sans-serif", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                          {initials(m)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontFamily: "Jost, sans-serif", fontSize: 13, fontWeight: 700, color: isSelected ? "#FF1F7D" : "#111" }}>
                          {m.first_name || m.full_name}
                        </div>
                        {m.neighborhood && (
                          <div style={{ fontFamily: "Jost, sans-serif", fontSize: 11, color: "#aaa" }}>{m.neighborhood}</div>
                        )}
                      </div>
                      <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${isSelected ? "#FF1F7D" : "#ddd"}`, background: isSelected ? "#FF1F7D" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isSelected && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notify toggle */}
          {target !== "public" && (
            <button
              onClick={() => setNotify(!notify)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
                marginBottom: 20,
              }}
            >
              <div style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: notify ? "#FF1F7D" : "#e5e5e5",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
              }}>
                <div style={{
                  position: "absolute",
                  top: 2,
                  left: notify ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s cubic-bezier(0.22,1,0.36,1)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "Jost, sans-serif", fontSize: 13, fontWeight: 700, color: "#111" }}>Notify them</div>
                <div style={{ fontFamily: "Jost, sans-serif", fontSize: 11, color: "#aaa" }}>Send a notification to each girl you pin</div>
              </div>
            </button>
          )}

          {/* Expiry */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Pin expires in
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ h: 2, label: "2h" }, { h: 6, label: "6h" }, { h: 24, label: "1 day" }, { h: 72, label: "3 days" }].map(({ h, label }) => (
                <button
                  key={h}
                  onClick={() => setExpiresHours(h)}
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: 8,
                    border: expiresHours === h ? "1.5px solid #FF1F7D" : "1.5px solid #eee",
                    background: expiresHours === h ? "rgba(255,31,125,0.06)" : "#fff",
                    fontFamily: "Jost, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: expiresHours === h ? "#FF1F7D" : "#888",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#FF1F7D", marginBottom: 12 }}>{error}</p>}

          <button
            onClick={handleSend}
            disabled={!canSend || sending}
            style={{
              width: "100%",
              background: canSend && !sending ? "#FF1F7D" : "#eee",
              border: "none",
              borderRadius: 14,
              padding: "15px",
              fontFamily: "Jost, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: canSend && !sending ? "#fff" : "#bbb",
              cursor: canSend && !sending ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            {sent ? "Dropped ✓" : sending ? "Dropping…" : "Drop the pin 📍"}
          </button>
        </div>
      )}
    </>
  );
}
