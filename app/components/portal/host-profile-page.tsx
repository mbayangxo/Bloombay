"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getHostProfile, getHostStats, getHostPastEvents, getHostReviewsPublic,
  type HostProfile, type HostStats, type HostEventSummary, type HostReviewPublic,
} from "@/lib/actions/host-profile";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const IVORY = "#FEFCF7";

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function fmtFull(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function initials(name: string | null) {
  return (name ?? "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_COLORS = ["#FF5BAD", "#C96EE0", "#FF9CC8", "#7B2FF7", "#F59E0B", "#059669"];

function Avatar({
  name, avatarUrl, size = 42, color, border = "white",
}: { name: string | null; avatarUrl: string | null; size?: number; color?: string; border?: string }) {
  const bg = color ?? AVATAR_COLORS[Math.abs((name ?? "?").charCodeAt(0)) % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatarUrl ? undefined : `linear-gradient(135deg, ${bg}, ${bg}bb)`,
      backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
      backgroundSize: "cover", backgroundPosition: "center",
      border: `2.5px solid ${border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {!avatarUrl && (
        <span style={{
          fontFamily: "var(--font-jost)", fontWeight: 900,
          fontSize: size * 0.36, color: "white",
        }}>{initials(name)}</span>
      )}
    </div>
  );
}

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill={i <= rating ? "#F59E0B" : "rgba(0,0,0,0.12)"}>
          <path d="M6 1l1.3 2.7L10 4.1l-2 1.9.5 2.7L6 7.3l-2.5 1.4.5-2.7L2 4.1l2.7-.4z" />
        </svg>
      ))}
    </div>
  );
}

// ── Event memory card ─────────────────────────────────────────────────────────

const EVENT_GRADIENTS = [
  "linear-gradient(145deg,#2A0A18,#4A1428)",
  "linear-gradient(145deg,#0A0A1A,#1A1A3A)",
  "linear-gradient(145deg,#1A1A08,#2A2A10)",
  "linear-gradient(145deg,#1A0A28,#2E1840)",
  "linear-gradient(145deg,#0A1A1A,#102A2A)",
  "linear-gradient(145deg,#1A0808,#2A1010)",
];

function EventMemoryCard({ ev, idx }: { ev: HostEventSummary; idx: number }) {
  const gradient = EVENT_GRADIENTS[idx % EVENT_GRADIENTS.length];

  return (
    <Link href={`/member/happenings/${ev.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{
        width: 200, borderRadius: 18, overflow: "hidden",
        background: gradient,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.32)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Date tag */}
        <div style={{ padding: "14px 16px 0" }}>
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "8.5px",
            fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.38)",
            marginBottom: 6,
          }}>{fmtFull(ev.starts_at).toUpperCase()}</p>
          <p style={{
            fontFamily: "var(--font-fraunces)", fontStyle: "italic",
            fontSize: 17, color: "white", lineHeight: 1.2, marginBottom: 4,
          }}>{ev.title}</p>
          {(ev.venue || ev.neighborhood) && (
            <p style={{
              fontFamily: "var(--font-jost)", fontSize: "10px",
              color: "rgba(255,255,255,0.32)",
            }}>{ev.venue ?? ev.neighborhood}</p>
          )}
        </div>

        {/* Memory text */}
        {ev.memory_text && (
          <div style={{ padding: "10px 16px 0" }}>
            <p style={{
              fontFamily: "var(--font-caveat)", fontSize: 13,
              color: "rgba(255,255,255,0.45)", lineHeight: 1.5,
              fontStyle: "italic",
            }}>&ldquo;{ev.memory_text}&rdquo;</p>
          </div>
        )}

        {/* Attendee avatars + stats */}
        <div style={{ padding: "12px 16px 14px", marginTop: "auto" }}>
          {ev.attendee_avatars.length > 0 && (
            <div style={{ display: "flex", marginBottom: 10 }}>
              {ev.attendee_avatars.slice(0, 5).map((a, i) => (
                <div key={a.user_id} style={{ marginLeft: i === 0 ? 0 : -8, position: "relative", zIndex: 5 - i }}>
                  <Avatar name={a.full_name} avatarUrl={a.avatar_url} size={26} border="rgba(0,0,0,0.5)" />
                </div>
              ))}
              {ev.attending_count > 5 && (
                <div style={{
                  marginLeft: -8, width: 26, height: 26, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)", border: "2.5px solid rgba(0,0,0,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "rgba(255,255,255,0.7)",
                }}>+{ev.attending_count - 5}</div>
              )}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
              {ev.attending_count} women
            </span>
            {ev.flower_count > 0 && (
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: PINK }}>
                🌸 {ev.flower_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: HostReviewPublic }) {
  return (
    <div style={{
      background: IVORY,
      borderRadius: 16,
      padding: "16px 18px",
      border: "1.5px solid rgba(0,0,0,0.07)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Stars rating={review.rating} />
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.3)" }}>
          {fmtMonth(review.created_at)}
        </p>
      </div>
      {review.content && (
        <p style={{
          fontFamily: "var(--font-caveat)", fontSize: 15,
          color: DARK, lineHeight: 1.55, marginBottom: 10,
        }}>&ldquo;{review.content}&rdquo;</p>
      )}
      {review.reviewer_name && (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: "rgba(0,0,0,0.38)" }}>
          — {review.reviewer_name}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HostProfilePage({ hostId }: { hostId: string }) {
  const router = useRouter();

  const [profile,    setProfile]    = useState<HostProfile | null>(null);
  const [stats,      setStats]      = useState<HostStats | null>(null);
  const [pastEvents, setPastEvents] = useState<HostEventSummary[]>([]);
  const [reviews,    setReviews]    = useState<HostReviewPublic[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      getHostProfile(hostId),
      getHostStats(hostId),
      getHostPastEvents(hostId),
      getHostReviewsPublic(hostId),
    ]).then(([p, s, ev, r]) => {
      setProfile(p);
      setStats(s);
      setPastEvents(ev);
      setReviews(r);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [hostId]);

  const displayName = profile?.display_name ?? profile?.full_name ?? "Host";
  const location = [profile?.neighborhood, profile?.borough, profile?.city].filter(Boolean).join(" · ");

  return (
    <div style={{ minHeight: "100vh", background: DARK, paddingBottom: 120 }}>

      {/* ── Back + header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(28,27,28,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "52px 20px 12px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)" }}>
          {loading ? "LOADING…" : displayName.toUpperCase()}
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : !profile ? (
        <div style={{ padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: "rgba(255,255,255,0.5)" }}>Host not found.</p>
        </div>
      ) : (
        <>
          {/* ── Hero ── */}
          <div style={{ padding: "32px 24px 0", textAlign: "center" }}>
            {/* Large avatar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ position: "relative" }}>
                <Avatar
                  name={displayName}
                  avatarUrl={profile.avatar_url}
                  size={88}
                  border={DARK}
                />
                {/* Pink ring */}
                <div style={{
                  position: "absolute", inset: -4, borderRadius: "50%",
                  border: `2px solid ${PINK}44`,
                  pointerEvents: "none",
                }} />
              </div>
            </div>

            <p style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic",
              fontWeight: 400, fontSize: 28, color: "white", lineHeight: 1.15, marginBottom: 4,
            }}>{displayName}</p>

            {location && (
              <p style={{
                fontFamily: "var(--font-jost)", fontSize: "11px",
                color: "rgba(255,255,255,0.38)", marginBottom: profile.bio ? 12 : 0,
              }}>{location}</p>
            )}

            {profile.bio && (
              <p style={{
                fontFamily: "var(--font-caveat)", fontSize: 15,
                color: "rgba(255,255,255,0.5)", lineHeight: 1.55,
                maxWidth: 300, margin: "0 auto 0",
              }}>&ldquo;{profile.bio}&rdquo;</p>
            )}
          </div>

          {/* ── Stats row ── */}
          {stats && (
            <div style={{ display: "flex", gap: 0, margin: "24px 24px 0", background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
              {[
                { label: "EVENTS", value: stats.eventsHosted.toString() },
                { label: "WOMEN", value: stats.womenHosted > 999 ? `${(stats.womenHosted / 1000).toFixed(1)}k` : stats.womenHosted.toString() },
                stats.avgRating !== null ? { label: "RATING", value: `${stats.avgRating}★` } : null,
                { label: "🌸", value: stats.flowersReceived.toString() },
              ].filter(Boolean).map((s, i, arr) => s && (
                <div
                  key={s.label}
                  style={{
                    flex: 1, padding: "16px 8px", textAlign: "center" as const,
                    borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <p style={{
                    fontFamily: "var(--font-fraunces)", fontStyle: "italic",
                    fontSize: 22, color: "white", lineHeight: 1, marginBottom: 4,
                  }}>{s.value}</p>
                  <p style={{
                    fontFamily: "var(--font-jost)", fontSize: "8px",
                    fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)",
                  }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Divider ── */}
          <div style={{ margin: "32px 24px 0", height: 1, background: "rgba(255,255,255,0.07)" }} />

          {/* ── Past happenings ── */}
          {pastEvents.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 24px", marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.18em", color: "rgba(255,255,255,0.9)" }}>PAST HAPPENINGS</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {stats?.eventsHosted} gathered
                  </p>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.28)" }}>
                  {pastEvents.length} shown
                </p>
              </div>

              {/* Horizontal scroll */}
              <div style={{
                display: "flex", gap: 12, overflowX: "auto",
                padding: "4px 24px 20px",
                scrollbarWidth: "none" as const,
              }}>
                {pastEvents.map((ev, i) => (
                  <EventMemoryCard key={ev.id} ev={ev} idx={i} />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length === 0 && (
            <div style={{ margin: "32px 24px 0", textAlign: "center", padding: "32px 0" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,255,255,0.25)" }}>
                No past happenings yet.
              </p>
            </div>
          )}

          {/* ── Reviews ── */}
          {reviews.length > 0 && (
            <div style={{ padding: "0 24px", marginTop: 8 }}>
              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 28 }} />

              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.18em", color: "rgba(255,255,255,0.9)" }}>REVIEWS</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    from women who came
                  </p>
                </div>
                {stats?.avgRating && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Stars rating={Math.round(stats.avgRating)} size={13} />
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>
                      {stats.avgRating}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          )}

          {/* ── Member since ── */}
          <div style={{ padding: "32px 24px 0", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}>
              MEMBER SINCE {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
