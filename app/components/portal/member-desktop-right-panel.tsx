"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { YandeAvatar } from "./yande-avatar";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";

interface ActiveBloomie {
  id: string;
  first_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
}

interface OpenSeat {
  id: string;
  title: string;
  date_time: string;
  seats_left: number;
  accent_color: string;
  venue: string | null;
}

interface YandeVenue {
  id: string;
  slug: string;
  name: string;
  neighborhood: string | null;
  tagline: string | null;
  poem: string | null;
  bloom_rating: number;
  restaurant_type: string;
}

interface PanelData {
  activeBloomies: ActiveBloomie[];
  openSeats: OpenSeat[];
  yandeRecommends: YandeVenue | null;
}

function fmtEventDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · ${time}`;
}

function BloomieAvatar({ bloomie }: { bloomie: ActiveBloomie }) {
  const initial = (bloomie.first_name ?? "B")[0].toUpperCase();
  return (
    <div title={`${bloomie.first_name ?? "Bloomie"}${bloomie.neighborhood ? ` · ${bloomie.neighborhood}` : ""}`}>
      {bloomie.avatar_url ? (
        <img
          src={bloomie.avatar_url}
          alt={bloomie.first_name ?? "Bloomie"}
          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px #FEFCF7" }}
        />
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${PINK} 0%, #FF6EB4 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 2px #FEFCF7",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "white" }}>
            {initial}
          </span>
        </div>
      )}
    </div>
  );
}

export function MemberDesktopRightPanel() {
  const [data, setData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/desktop-panel")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const bloomies = data?.activeBloomies ?? [];
  const seats = data?.openSeats ?? [];
  const yande = data?.yandeRecommends ?? null;

  return (
    <aside
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full overflow-y-auto"
      style={{
        width: 280,
        background: "#FEFCF7",
        borderLeft: "1px solid rgba(255,31,125,0.07)",
        padding: "28px 0 48px",
      }}
    >
      {/* ── Bloomies Online ── */}
      <div style={{ padding: "0 22px 20px", borderBottom: "1px solid rgba(255,31,125,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2px rgba(34,197,94,0.25)" }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.3)" }}>
            BLOOMIES ONLINE
          </p>
        </div>

        {loading && (
          <div style={{ display: "flex", gap: 6 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,31,125,0.06)" }} />
            ))}
          </div>
        )}

        {!loading && bloomies.length === 0 && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.3)" }}>
            Just you right now.
          </p>
        )}

        {!loading && bloomies.length > 0 && (
          <>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {bloomies.map(b => (
                <Link key={b.id} href={`/member/profile/${b.id}`} style={{ textDecoration: "none" }}>
                  <BloomieAvatar bloomie={b} />
                </Link>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.3)", marginTop: 10, letterSpacing: "0.04em" }}>
              {bloomies.length} {bloomies.length === 1 ? "woman" : "women"} recently active
            </p>
          </>
        )}
      </div>

      {/* ── Open Seats ── */}
      <div style={{ padding: "18px 22px 16px", borderBottom: "1px solid rgba(255,31,125,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.3)", marginBottom: 14 }}>
          OPEN SEATS
        </p>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ height: 52, borderRadius: 10, background: "rgba(255,31,125,0.04)" }} />
            ))}
          </div>
        )}

        {!loading && seats.length === 0 && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.3)", lineHeight: 1.5 }}>
            All events are full right now.
            <br />
            <Link href="/member/happenings" style={{ color: PINK, textDecoration: "none" }}>See all happenings →</Link>
          </p>
        )}

        {!loading && seats.map(ev => (
          <Link key={ev.id} href={`/member/happenings/${ev.id}`} style={{ textDecoration: "none", display: "block", marginBottom: 10 }}>
            <div style={{
              background: "rgba(255,31,125,0.03)",
              border: "1px solid rgba(255,31,125,0.08)",
              borderRadius: 10,
              padding: "10px 12px",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}>
              <div style={{ width: 3, flexShrink: 0, alignSelf: "stretch", borderRadius: 2, background: ev.accent_color }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: DARK, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.title}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.4)", marginTop: 3, letterSpacing: "0.02em" }}>
                  {fmtEventDate(ev.date_time)}
                </p>
                {ev.venue && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.3)", marginTop: 1 }}>
                    {ev.venue}
                  </p>
                )}
              </div>
              <div style={{
                flexShrink: 0,
                background: PINK,
                borderRadius: 6,
                padding: "3px 7px",
                alignSelf: "flex-start",
              }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {ev.seats_left} left
                </p>
              </div>
            </div>
          </Link>
        ))}

        {!loading && seats.length > 0 && (
          <Link href="/member/happenings" style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.1em", textDecoration: "none", display: "block", marginTop: 6 }}>
            ALL HAPPENINGS →
          </Link>
        )}
      </div>

      {/* ── Yande Recommends ── */}
      <div style={{ padding: "18px 22px 16px", borderBottom: "1px solid rgba(255,31,125,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <YandeAvatar size={24}/>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.3)" }}>
            YANDE RECOMMENDS
          </p>
        </div>

        {loading && (
          <div style={{ height: 80, borderRadius: 12, background: "rgba(255,31,125,0.04)" }} />
        )}

        {!loading && !yande && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.3)" }}>
            No picks today.
          </p>
        )}

        {!loading && yande && (
          <Link href={`/member/city/places/${yande.id}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,31,125,0.05) 0%, rgba(212,168,83,0.05) 100%)",
              border: "1px solid rgba(255,31,125,0.1)",
              borderRadius: 12,
              padding: "14px 14px 12px",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.3)", marginBottom: 6 }}>
                {yande.restaurant_type.replace("_", " ").toUpperCase()}
                {yande.neighborhood ? ` · ${yande.neighborhood.toUpperCase()}` : ""}
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 6 }}>
                {yande.name}
              </p>
              {yande.bloom_rating > 0 && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.04em", marginBottom: 6 }}>
                  ★ {yande.bloom_rating}
                </p>
              )}
              {(yande.poem ?? yande.tagline) && (
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.4, fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  &ldquo;{yande.poem ?? yande.tagline}&rdquo;
                </p>
              )}
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.1em", marginTop: 10 }}>
                SEE ON CITY →
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* ── Quick access ── */}
      <div style={{ padding: "18px 22px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.3)", marginBottom: 12 }}>
          QUICK ACCESS
        </p>
        {[
          { href: "/member/plans",         label: "My Plans" },
          { href: "/member/clubs",         label: "My Clubs" },
          { href: "/member/city",          label: "The City" },
          { href: "/member/discover",      label: "Discover" },
          { href: "/member/notifications", label: "Pin Drops" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", textDecoration: "none" }}
          >
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
