"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/app/styles/bloom-entrance.css";

interface WitnessProfile {
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
}

interface Witness {
  id: string;
  note: string | null;
  created_at: string;
  gathering_title: string | null;
  witness: WitnessProfile;
}

interface FlowerSender {
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface SocialProofData {
  witnesses: Witness[];
  flowers: {
    count: number;
    recent_senders: FlowerSender[];
  };
}

function displayName(profile: { first_name?: string | null; full_name?: string | null }): string {
  return profile.first_name || profile.full_name?.split(" ")[0] || "Her";
}

function initial(profile: { first_name?: string | null; full_name?: string | null }): string {
  return displayName(profile).charAt(0).toUpperCase();
}

function Avatar({ profile, size = 28 }: { profile: FlowerSender | WitnessProfile; size?: number }) {
  if (profile.avatar_url) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #111" }}>
        <Image src={profile.avatar_url} alt={displayName(profile)} width={size} height={size} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#FF1F7D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid #111" }}>
      <span style={{ fontFamily: "var(--font-jost)", fontSize: size * 0.4, fontWeight: 700, color: "#fff" }}>
        {initial(profile)}
      </span>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SocialProofSection({ userId }: { userId: string }) {
  const [data, setData] = useState<SocialProofData | null>(null);

  useEffect(() => {
    fetch(`/api/member/${userId}/social-proof`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, [userId]);

  if (!data) return null;

  const hasFlowers = data.flowers.count > 0;
  const hasWitnesses = data.witnesses.length > 0;

  if (!hasFlowers && !hasWitnesses) return null;

  const visibleWitnesses = data.witnesses.slice(0, 3);
  const hasMore = data.witnesses.length > 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {hasFlowers && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#111", borderRadius: 999, padding: "5px 12px" }}>
              <span style={{ fontSize: 14 }}>🌸</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
                {data.flowers.count} {data.flowers.count === 1 ? "flower" : "flowers"}
              </span>
            </div>

            {data.flowers.recent_senders.length > 0 && (
              <div style={{ display: "flex", alignItems: "center" }}>
                {data.flowers.recent_senders.slice(0, 5).map((sender, i) => (
                  <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}>
                    <Avatar profile={sender} size={26} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasWitnesses && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,31,125,0.7)", margin: 0 }}>
            WITNESS STACK · {data.witnesses.length} OBSERVATION{data.witnesses.length !== 1 ? "S" : ""}
          </p>

          <div className="bloom-stagger" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibleWitnesses.map((w) => (
              <div
                key={w.id}
                className="bloom-card-enter"
                style={{ background: "#111", borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}
              >
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "#FFF8F0", lineHeight: 1.55, margin: 0 }}>
                  &ldquo;{w.note}&rdquo;
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar profile={w.witness} size={24} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#fff" }}>
                        {displayName(w.witness)}
                      </span>
                      {w.gathering_title && (
                        <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em" }}>
                          witnessed at {w.gathering_title}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,31,125,0.6)", fontWeight: 600, flexShrink: 0 }}>
                    {formatDate(w.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <Link
              href="/member/witnesses"
              style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "#FF1F7D", letterSpacing: "0.06em", textDecoration: "none", alignSelf: "flex-end" }}
            >
              See all →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
