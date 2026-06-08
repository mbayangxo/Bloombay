"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PINK = "#FF1F7D";

interface Club {
  id: string;
  name: string;
  description: string | null;
  color: string;
  emoji: string | null;
  category: string | null;
  neighborhood: string | null;
  frequency: string | null;
  capacity: string | null;
  membership_type: string | null;
  member_count: number;
  cover_url: string | null;
  owner_id: string | null;
  created_at: string;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Club | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: memberships } = await supabase
          .from("user_clubs")
          .select("club_id")
          .eq("user_id", user.id);
        if (memberships) {
          setJoinedIds(new Set((memberships as { club_id: string }[]).map(m => m.club_id)));
        }
      }

      const { data } = await supabase
        .from("clubs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (data) setClubs(data as Club[]);
      setLoading(false);
    }

    load();
  }, []);

  async function toggleJoin(club: Club) {
    if (!userId) return;
    setJoining(club.id);
    const supabase = createClient();

    if (joinedIds.has(club.id)) {
      await supabase.from("user_clubs").delete().eq("user_id", userId).eq("club_id", club.id);
      setJoinedIds(prev => { const s = new Set(prev); s.delete(club.id); return s; });
      setClubs(prev => prev.map(c => c.id === club.id ? { ...c, member_count: Math.max(0, c.member_count - 1) } : c));
    } else {
      await supabase.from("user_clubs").insert({ user_id: userId, club_id: club.id });
      setJoinedIds(prev => new Set([...prev, club.id]));
      setClubs(prev => prev.map(c => c.id === club.id ? { ...c, member_count: c.member_count + 1 } : c));
    }
    setJoining(null);
  }

  if (selected) {
    return (
      <ClubDetail
        club={selected}
        joined={joinedIds.has(selected.id)}
        joining={joining === selected.id}
        onJoin={() => toggleJoin(selected)}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div style={{ background: "#F6F1EB", minHeight: "100vh", paddingBottom: 104 }}>

      {/* Header */}
      <div style={{ background: "#111111", padding: "44px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 6 }}>
              EXPLORE
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>
              Clubs
            </p>
          </div>
          <Link
            href="/member/clubs/create"
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: PINK, display: "flex", alignItems: "center", justifyContent: "center",
              textDecoration: "none", flexShrink: 0,
              boxShadow: `0 4px 16px ${PINK}55`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </Link>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {loading ? (
          <LoadingState />
        ) : clubs.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {clubs.map(club => (
              <ClubCard
                key={club.id}
                club={club}
                joined={joinedIds.has(club.id)}
                onTap={() => setSelected(club)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ClubCard ─────────────────────────────────────────────────────────────────

function ClubCard({ club, joined, onTap }: { club: Club; joined: boolean; onTap: () => void }) {
  const accent = club.color || PINK;
  const excerpt = club.description
    ? club.description.length > 90 ? club.description.slice(0, 90) + "…" : club.description
    : null;

  return (
    <button
      onClick={onTap}
      style={{
        width: "100%", textAlign: "left",
        background: "white", borderRadius: 20, padding: 0,
        border: "none", cursor: "pointer", overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${accent} 0%, ${accent}66 100%)` }} />
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>

          {/* Cover photo or emoji crest */}
          {club.cover_url ? (
            <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={club.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: `${accent}18`, border: `1.5px solid ${accent}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>
              {club.emoji || "✦"}
            </div>
          )}

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <p style={{
                fontSize: 16, fontWeight: 800, fontFamily: "var(--font-playfair)", fontStyle: "italic",
                color: "#111", lineHeight: 1.2,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                flex: 1, minWidth: 0,
              }}>
                {club.name}
              </p>
              {joined && (
                <span style={{
                  fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em",
                  color: accent, background: `${accent}15`,
                  padding: "3px 8px", borderRadius: 999, flexShrink: 0,
                }}>
                  JOINED
                </span>
              )}
            </div>

            {excerpt && (
              <p style={{
                fontSize: 12, color: "#888", marginTop: 4, lineHeight: 1.5,
                fontFamily: "var(--font-instrument)", fontStyle: "italic",
              }}>
                {excerpt}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#bbb" }}>
                {club.member_count} {club.member_count === 1 ? "member" : "members"}
              </span>
              {club.category && (
                <>
                  <span style={{ fontSize: "10px", color: "#ccc" }}>·</span>
                  <span style={{ fontSize: "10px", color: "#bbb" }}>{club.category}</span>
                </>
              )}
              {club.neighborhood && (
                <>
                  <span style={{ fontSize: "10px", color: "#ccc" }}>·</span>
                  <span style={{ fontSize: "10px", color: "#bbb" }}>{club.neighborhood}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── ClubDetail ───────────────────────────────────────────────────────────────

function ClubDetail({
  club, joined, joining, onJoin, onBack,
}: {
  club: Club;
  joined: boolean;
  joining: boolean;
  onJoin: () => void;
  onBack: () => void;
}) {
  const accent = club.color || PINK;

  return (
    <div style={{ background: "#F6F1EB", minHeight: "100vh", paddingBottom: 104 }}>

      {/* Cover photo */}
      {club.cover_url && (
        <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={club.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)" }} />
        </div>
      )}

      {/* Header */}
      <div style={{
        background: club.cover_url ? "transparent" : "#111111",
        marginTop: club.cover_url ? -80 : 0,
        position: "relative",
        padding: club.cover_url ? "0 20px 28px" : "44px 20px 28px",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            marginBottom: 16,
            paddingTop: club.cover_url ? 0 : undefined,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          {!club.cover_url && (
            <div style={{
              width: 64, height: 64, borderRadius: 20, flexShrink: 0,
              background: `${accent}28`, border: `2px solid ${accent}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}>
              {club.emoji || "✦"}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
            <p style={{
              fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900,
              fontStyle: "italic", color: "white", lineHeight: 1.1,
            }}>
              {club.name}
            </p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
              {club.member_count} {club.member_count === 1 ? "member" : "members"}
              {club.neighborhood ? ` · ${club.neighborhood}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* If no cover photo, we need the dark panel to end cleanly */}
      {!club.cover_url && (
        <div style={{ height: 0, background: "#111111" }} />
      )}

      <div style={{ padding: "20px" }}>

        {/* Description */}
        {club.description && (
          <div style={{ background: "white", borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 8 }}>ABOUT</p>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, fontStyle: "italic", fontFamily: "var(--font-instrument)" }}>
              {club.description}
            </p>
          </div>
        )}

        {/* Details grid */}
        {(club.category || club.frequency || club.capacity || club.membership_type) && (
          <div style={{ background: "white", borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>DETAILS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {club.category && <DetailRow label="Category" value={club.category} />}
              {club.neighborhood && <DetailRow label="Location" value={club.neighborhood} />}
              {club.frequency && <DetailRow label="Meets" value={club.frequency} />}
              {club.capacity && <DetailRow label="Max size" value={`${club.capacity} members`} />}
              {club.membership_type && (
                <DetailRow
                  label="Membership"
                  value={
                    club.membership_type === "open" ? "Open to all"
                    : club.membership_type === "curated" ? "Curated"
                    : "Invite only"
                  }
                />
              )}
            </div>
          </div>
        )}

        {/* Join / Leave */}
        <button
          onClick={onJoin}
          disabled={joining}
          style={{
            width: "100%", padding: "15px",
            borderRadius: 16, border: joined ? "1.5px solid rgba(0,0,0,0.08)" : "none",
            cursor: joining ? "default" : "pointer",
            fontSize: "13px", fontWeight: 800, letterSpacing: "0.06em",
            background: joined ? "white" : accent,
            color: joined ? "#888" : "white",
            boxShadow: joined ? "0 1px 8px rgba(0,0,0,0.06)" : `0 6px 20px ${accent}44`,
            transition: "all 0.2s",
          }}
        >
          {joining ? "…" : joined ? "Leave Club" : "Join Club"}
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={{ fontSize: "11px", color: "#bbb", fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: "11px", fontWeight: 700, color: "#444" }}>{value}</p>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 20px", textAlign: "center",
    }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🌸</div>
      <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 10 }}>
        NO CLUBS YET
      </p>
      <p style={{
        fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900,
        fontStyle: "italic", color: "#111", lineHeight: 1.2, marginBottom: 8,
      }}>
        Be the first to start one.
      </p>
      <p style={{
        fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 28,
        fontStyle: "italic", fontFamily: "var(--font-instrument)",
        maxWidth: 260,
      }}>
        BloomBay clubs are gathering spaces created by women, for women.
      </p>
      <Link
        href="/member/clubs/create"
        style={{
          display: "inline-block", padding: "14px 28px",
          borderRadius: 16, background: PINK, color: "white",
          fontSize: "12px", fontWeight: 800, letterSpacing: "0.06em",
          textDecoration: "none", boxShadow: `0 6px 20px ${PINK}44`,
        }}
      >
        + Start a Club
      </Link>
    </div>
  );
}

// ─── LoadingState ─────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ height: 4, background: "rgba(255,31,125,0.1)" }} />
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(0,0,0,0.06)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, borderRadius: 8, background: "rgba(0,0,0,0.06)", marginBottom: 8, width: "60%" }} />
                <div style={{ height: 10, borderRadius: 8, background: "rgba(0,0,0,0.04)", width: "85%" }} />
                <div style={{ height: 10, borderRadius: 8, background: "rgba(0,0,0,0.04)", width: "55%", marginTop: 6 }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
