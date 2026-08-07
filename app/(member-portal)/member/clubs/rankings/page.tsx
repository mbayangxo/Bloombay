"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PINK = "#FF1F7D";

interface RankedClub {
  id: string;
  name: string;
  slug: string | null;
  primary_color: string | null;
  cover_url: string | null;
  member_count: number | null;
  category: string | null;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function ClubRankingsPage() {
  const [clubs, setClubs] = useState<RankedClub[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("clubs")
      .select("id, name, slug, primary_color, cover_url, member_count, category")
      .eq("is_active", true)
      .order("member_count", { ascending: false })
      .limit(50)
      .then(({ data }) => setClubs((data ?? []) as RankedClub[]));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bb-page-bg, #0A0006)", paddingBottom: 100 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--bb-nav-bg, rgba(10,0,6,0.9))", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <Link href="/member/clubs" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: "white" }}>Club Rankings</span>
        </div>
      </div>

      <div style={{ padding: "20px 18px 8px" }}>
        <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>🏆 TOP CLUBS</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,105,180,0.75)" }}>Ranked by real members — updates automatically as clubs grow.</p>
      </div>

      <div style={{ padding: "8px 18px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {clubs === null ? (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "30px 0" }}>Loading…</p>
        ) : clubs.length === 0 ? (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "30px 0" }}>No clubs yet.</p>
        ) : clubs.map((club, i) => {
          const href = club.slug ? `/member/clubs/${club.slug}` : `/member/clubs/${club.id}`;
          const accent = club.primary_color ?? PINK;
          return (
            <Link key={club.id} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{ width: 26, textAlign: "center", flexShrink: 0 }}>
                  {i < 3 ? (
                    <span style={{ fontSize: 18 }}>{MEDALS[i]}</span>
                  ) : (
                    <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{i + 1}</span>
                  )}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0, overflow: "hidden",
                  background: club.cover_url ? undefined : `linear-gradient(135deg,${accent},${accent}88)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {club.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={club.cover_url} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 15, color: "white" }}>{club.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{club.name}</p>
                  {club.category && <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{club.category}</p>}
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: accent, flexShrink: 0 }}>{club.member_count ?? 0}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
