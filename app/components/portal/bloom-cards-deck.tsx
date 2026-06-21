"use client";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";

interface Card { id: string; prompt: string; sort_order: number; }

export function BloomCardsDeck() {
  const [cards, setCards] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    // Fetch bloom_card questions directly
    fetch("/api/member/bloom-cards")
      .then(r => r.ok ? r.json() : { cards: [] })
      .then(d => { setCards(d.cards ?? []); })
      .catch(() => null);
  }, []);

  if (cards.length === 0) return null;

  const card = cards[current];

  return (
    <div>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 12 }}>
        ✦ BLOOM CARDS
      </p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", marginBottom: 16, lineHeight: 1.5 }}>
        Flip a card at the table. Everyone answers out loud.
      </p>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          background: flipped ? "#111" : PINK,
          borderRadius: 20,
          padding: "40px 28px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.3s",
          boxShadow: flipped ? "0 8px 32px rgba(0,0,0,0.25)" : `0 8px 32px rgba(255,31,125,0.3)`,
          marginBottom: 16,
        }}
      >
        {!flipped ? (
          <>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 28, color: "white", margin: "0 0 8px", opacity: 0.4 }}>🌸</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em" }}>TAP TO FLIP</p>
          </>
        ) : (
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,235,215,0.95)", lineHeight: 1.45, margin: 0 }}>
            {card.prompt}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
        <button
          onClick={() => { setCurrent(i => (i - 1 + cards.length) % cards.length); setFlipped(false); }}
          style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(255,31,125,0.2)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb", margin: 0 }}>{current + 1} / {cards.length}</p>
        <button
          onClick={() => { setCurrent(i => (i + 1) % cards.length); setFlipped(false); }}
          style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(255,31,125,0.2)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}
