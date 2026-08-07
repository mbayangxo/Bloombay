"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import { NYC_NEIGHBORHOODS } from "@/lib/city-neighborhoods";
import { saveTrendingSpot, unsaveTrendingSpot } from "@/lib/actions/city-trending";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const GOLD  = "#D4A853";
const DARK  = "#1C1B1C";

const PAPER_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

const HOOD_ACCENTS: Record<string, string> = {
  "West Village": "#D4A853", "SoHo": "#6BB5F5", "Williamsburg": "#A8C97A", "Nolita": "#FF9B70",
  "DUMBO": "#7BA8E0", "Brooklyn Heights": "#B09FD8", "Park Slope": "#90C880", "Lower East Side": "#E05858",
  "Chelsea": "#6898D8", "Harlem": "#E0982A", "Astoria": "#80A8D8", "Crown Heights": "#D080E8",
  "Upper East Side": "#C0B870", "Bushwick": "#E050C8", "Flushing": "#E89040",
};

function slugToName(slug: string): string {
  const found = NYC_NEIGHBORHOODS.find(n => n.toLowerCase().replace(/\s+/g, "-") === slug);
  return found ?? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

interface EatRow {
  id: string; name: string; restaurant_type: string | null; poem: string | null;
  bloom_tips: string | null; bloom_notes: number | null; bloom_rating: number | null;
  cover_url: string | null; brand_color: string | null;
}
interface TrendingRow {
  id: string; name: string; category: string | null; description: string | null;
  badge: string | null; image_url: string | null; save_count: number | null;
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, sub, accent }: { label: string; sub?: string; accent: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: accent }}>{label}</p>
      {sub && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(0,0,0,0.35)" }}>{text}</p>;
}

// ── Eat card ───────────────────────────────────────────────────────────────────
function EatCard({ eat, accent }: { eat: EatRow; accent: string }) {
  const note = eat.poem?.trim() || eat.bloom_tips?.trim() || "";
  const hot = (eat.bloom_rating ?? 0) >= 4.5;
  return (
    <div style={{
      backgroundColor: "#FFFFFF", borderRadius: 18, padding: "16px 16px 14px", marginBottom: 10,
      border: "1px solid rgba(255,31,125,0.1)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "relative",
    }}>
      {hot && (
        <div style={{ position: "absolute", top: 14, right: 14, background: PINK, borderRadius: 999, padding: "2px 9px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>✦ HOT</span>
        </div>
      )}
      {eat.restaurant_type && (
        <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 7 }}>
          <div style={{ background: `${accent}22`, border: `1px solid ${accent}44`, borderRadius: 999, padding: "2px 8px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{eat.restaurant_type.toUpperCase()}</span>
          </div>
        </div>
      )}
      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 20, color: "#111111", lineHeight: 1.1, marginBottom: 7 }}>{eat.name}</p>
      {note && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.45, marginBottom: 10 }}>&ldquo;{note}&rdquo;</p>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.3)" }}>{eat.bloom_notes ?? 0} bloom notes</span>
        <Link href={`/member/city/eat/${eat.id}`} style={{ textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </Link>
      </div>
    </div>
  );
}

// ── Trending card ──────────────────────────────────────────────────────────────
function TrendingCard({ item, accent, saved, onToggleSave }: { item: TrendingRow; accent: string; saved: boolean; onToggleSave: () => void }) {
  return (
    <div style={{
      flexShrink: 0, width: 200, backgroundColor: "#FFFFFF", borderRadius: 18, padding: "16px 16px 14px",
      border: "1px solid rgba(255,31,125,0.1)", boxShadow: `0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px ${accent}11`,
    }}>
      {item.category && (
        <div style={{ background: `${accent}22`, border: `1px solid ${accent}55`, borderRadius: 999, padding: "3px 9px", display: "inline-flex", marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{item.category.toUpperCase()}</span>
        </div>
      )}
      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "#111111", lineHeight: 1.15, marginBottom: 8 }}>{item.name}</p>
      {item.description && <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.45)", lineHeight: 1.5, marginBottom: 12 }}>{item.description}</p>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, boxShadow: "0 0 0 2px rgba(255,0,144,0.22)" }} />
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.4)" }}>{item.save_count ?? 0} saves</span>
        </div>
        <button onClick={onToggleSave} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? GOLD : "none"} stroke={GOLD} strokeWidth="2.2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const name = slugToName(slug);
  const accent = HOOD_ACCENTS[name] ?? PINK;
  const [tab, setTab] = useState<"eats" | "trending" | "popular">("eats");
  const [eats, setEats] = useState<EatRow[] | null>(null);
  const [trending, setTrending] = useState<TrendingRow[] | null>(null);
  const [popular, setPopular] = useState<TrendingRow[] | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("restaurant_partners")
      .select("id, name, restaurant_type, poem, bloom_tips, bloom_notes, bloom_rating, cover_url, brand_color")
      .eq("neighborhood", name)
      .order("bloom_notes", { ascending: false })
      .limit(20)
      .then(({ data }) => setEats((data ?? []) as EatRow[]));

    supabase
      .from("city_trending")
      .select("id, name, category, description, badge, image_url, save_count")
      .eq("neighborhood", name)
      .eq("status", "approved")
      .order("rank_order", { ascending: true })
      .limit(20)
      .then(({ data }) => setTrending((data ?? []) as TrendingRow[]));

    supabase
      .from("city_trending")
      .select("id, name, category, description, badge, image_url, save_count")
      .eq("neighborhood", name)
      .eq("status", "approved")
      .order("save_count", { ascending: false })
      .limit(20)
      .then(({ data }) => setPopular((data ?? []) as TrendingRow[]));

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("city_trending_saves").select("trending_id").eq("user_id", user.id);
      setSavedIds(new Set((data ?? []).map((r: { trending_id: string }) => r.trending_id)));
    })();
  }, [name]);

  async function handleToggleSave(id: string) {
    const wasSaved = savedIds.has(id);
    setSavedIds(prev => {
      const n = new Set(prev);
      wasSaved ? n.delete(id) : n.add(id);
      return n;
    });
    await (wasSaved ? unsaveTrendingSpot(id) : saveTrendingSpot(id)).catch(() => {});
  }

  const placeCount = (eats?.length ?? 0) + (trending?.length ?? 0);

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh", paddingBottom: 120 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 290, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, linear-gradient(155deg, #FF1F7D 0%, #FF3A8C 55%, #FF69B4 100%)`, backgroundSize: "160px 160px, 100% 100%" }} />
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(255,255,255,0.3) 100%)" }} />

        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <div style={{
            position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: 16, zIndex: 20,
            background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,31,125,0.15)", borderRadius: 999,
            padding: "6px 13px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.07em" }}>CITY</span>
          </div>
        </Link>

        <div style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: accent, marginBottom: 6 }}>NEIGHBORHOOD</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(30px, 11vw, 44px)", color: "white", lineHeight: 0.9, letterSpacing: "-0.02em" }}>{name}.</p>
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#FFFFFF", padding: "14px 20px", borderBottom: "1px solid rgba(255,31,125,0.08)" }}>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "#111111", lineHeight: 1 }}>{placeCount}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(0,0,0,0.35)", marginTop: 2 }}>PLACES BLOOMIES HAVE ADDED HERE</p>
      </div>

      {/* ── TAB BAR ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,31,125,0.1)", backgroundColor: "#FFFFFF" }}>
        {(["eats", "trending", "popular"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "13px 0", background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === t ? accent : "transparent"}`, transition: "border-color 0.2s",
          }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: tab === t ? accent : "rgba(0,0,0,0.4)" }}>
              {t === "eats" ? "🍽 Eats" : t === "trending" ? "✦ Trending" : "✦ Most Loved"}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 16px 0" }}>

        {tab === "eats" && (
          <>
            <SectionHeader label="BEST EATS" sub="Where the girls go" accent={accent} />
            {eats === null ? <EmptyNote text="Loading…" /> : eats.length > 0
              ? eats.map(eat => <EatCard key={eat.id} eat={eat} accent={accent} />)
              : <EmptyNote text="No eats added here yet." />
            }
          </>
        )}

        {tab === "trending" && (
          <>
            <SectionHeader label="TRENDING NOW" sub="This week's it spots" accent={accent} />
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" as const }}>
              {trending === null ? <EmptyNote text="Loading…" /> : trending.length > 0
                ? trending.map(item => <TrendingCard key={item.id} item={item} accent={accent} saved={savedIds.has(item.id)} onToggleSave={() => handleToggleSave(item.id)} />)
                : <EmptyNote text="Nothing trending here yet." />
              }
            </div>
          </>
        )}

        {tab === "popular" && (
          <>
            <SectionHeader label="MOST LOVED" sub="Saved by the most bloomies" accent={accent} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {popular === null ? <EmptyNote text="Loading…" /> : popular.length > 0
                ? popular.map((pick, i) => (
                    <div key={pick.id} style={{ backgroundColor: "#FFF5F8", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,31,125,0.1)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }} />
                      <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "rgba(212,168,83,0.1)", border: `1px solid ${accent}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: accent }}>{i + 1}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            {pick.category && (
                              <div style={{ background: `${accent}22`, border: `1px solid ${accent}44`, borderRadius: 999, padding: "1.5px 7px" }}>
                                <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{pick.category.toUpperCase()}</span>
                              </div>
                            )}
                            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "rgba(0,0,0,0.3)" }}>{pick.save_count ?? 0} saves</span>
                          </div>
                          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "#111111", lineHeight: 1.1, marginBottom: pick.description ? 4 : 0 }}>{pick.name}</p>
                          {pick.description && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: `${accent}bb`, lineHeight: 1.35 }}>&ldquo;{pick.description}&rdquo;</p>}
                        </div>
                      </div>
                    </div>
                  ))
                : <EmptyNote text="Nothing saved here yet." />
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
