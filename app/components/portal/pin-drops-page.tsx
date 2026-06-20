"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PinIcon } from "./pin-icon";
import "@/app/styles/bloom-entrance.css";

interface PersonalPin {
  id: string;
  location: string;
  caption: string | null;
  expires_at: string;
  created_at: string;
}

interface ClubPin {
  id: string;
  location: string;
  caption: string;
  club_name: string | null;
  sent_at: string;
  type: "club";
}

type PinItem =
  | ({ kind: "personal" } & PersonalPin)
  | ({ kind: "club" } & ClubPin);

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function expiresIn(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const h = Math.round(diff / 3600000);
  if (h < 1) return "expires soon";
  if (h < 24) return `expires in ${h}h`;
  return `expires in ${Math.round(h / 24)}d`;
}

export function PinDropsPage() {
  const [pins, setPins]     = useState<PinItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/pin-drops")
      .then((r) => (r.ok ? r.json() : { personal: [], club_pins: [] }))
      .then(({ personal, club_pins }) => {
        const all: PinItem[] = [
          ...(personal as PersonalPin[]).map((p) => ({ kind: "personal" as const, ...p })),
          ...(club_pins as ClubPin[]).map((p) => ({ kind: "club" as const, ...p })),
        ];
        // Sort newest first
        all.sort((a, b) => {
          const aTime = a.kind === "personal" ? a.created_at : a.sent_at;
          const bTime = b.kind === "personal" ? b.created_at : b.sent_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
        setPins(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bloom-page-enter min-h-screen pb-24" style={{ background: "#FFF8F0" }}>
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Link
            href="/member/home"
            style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textDecoration: "none", color: "#111" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PinIcon size={18} />
            <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)", fontStyle: "italic", fontSize: 28, fontWeight: 700, color: "#111", margin: 0 }}>
              Pin drops
            </h1>
          </div>
        </div>

        <div style={{ width: 40, height: 2, borderRadius: 2, background: "#FF1F7D", marginBottom: 24 }} />

        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#bbb", letterSpacing: "0.1em" }}>Loading…</p>
          </div>
        ) : pins.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 24, padding: 32, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,31,125,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <PinIcon size={22} />
            </div>
            <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 8 }}>
              No pin drops yet.
            </p>
            <p style={{ fontFamily: "Jost, sans-serif", fontSize: 13, color: "#888", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
              When someone saves you a seat, your Club Mama drops a pin, or something real happens — it lands here.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="bloom-card-enter"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "16px 18px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  borderLeft: pin.kind === "club" ? "3px solid #FF1F7D" : "3px solid #111",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, color: pin.kind === "club" ? "#FF1F7D" : "#111" }}>📍</span>
                    <span style={{
                      fontFamily: "Jost, sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: pin.kind === "club" ? "#FF1F7D" : "#666",
                    }}>
                      {pin.kind === "club" ? (pin.club_name ?? "Your club") : "Your pin"}
                    </span>
                  </div>
                  <span style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#bbb" }}>
                    {pin.kind === "personal" ? expiresIn(pin.expires_at) : timeAgo(pin.sent_at)}
                  </span>
                </div>

                <p style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                  fontStyle: "italic",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 4px",
                }}>
                  {pin.location}
                </p>

                {(pin.kind === "personal" ? pin.caption : pin.caption) && (
                  <p style={{ fontFamily: "Jost, sans-serif", fontSize: 13, color: "#555", margin: 0, lineHeight: 1.5 }}>
                    {pin.kind === "personal" ? pin.caption : pin.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
