"use client";

import { useState, useEffect } from "react";
import { PushPin } from "../scrapbook";
import { ReserveTableSheet } from "../reserve-table-sheet";
import {
  getNoteCountsByPlace,
} from "@/lib/actions/bloom-notes";
import {
  PINK, PAPER, DARK,
  PAPER_TEX, DARK_GRAIN, LINEN_TEX,
} from "@/lib/city/tokens";
import {
  EATS_FILTERS, type RestaurantType, type EatsPartner, EATS_PARTNERS,
} from "@/lib/city/city-data";
import { BackBtn } from "./shared";
import { PartnerStorefront, toSlug } from "./partner-storefront";

// Real partner row from restaurant_partners table
export interface RealPartnerRow {
  id: string; name: string; restaurant_type: string; neighborhood: string | null;
  tagline: string | null; about: string | null; bloom_notes: number; bloom_rating: number;
  price_range: string | null; brand_color: string; cover_url: string | null;
  poem: string | null; polaroid_caption: string | null; host_note: string | null;
  bloom_tips: string[] | null; girl_favorites: {item:string;description:string}[] | null;
  reviews: {author:string;text:string;rating:number}[] | null; instagram: string | null;
  hours: Record<string,string> | null; loved_by: string[] | null; visited_by: string[];
  photo_urls: string[];
}

export function realToEatsPartner(r: RealPartnerRow, idx: number): EatsPartner {
  const typeMap: Record<string, RestaurantType> = {
    café: "café", cafe: "café", coffee: "café", bar: "bar", cocktail: "bar",
    bakery: "bakery", casual: "casual", fine_dining: "fine_dining", restaurant: "casual",
  };
  const heroColors = ["#C84A18","#3A6A38","#5A1A0A","#1A3A6A","#6A1A5A","#3A1A6A"];
  const heroColor = r.brand_color || heroColors[idx % heroColors.length];
  return {
    id: idx + 100,
    name: r.name,
    type: typeMap[r.restaurant_type?.toLowerCase() ?? ""] ?? "casual",
    hood: r.neighborhood ?? "NYC",
    tagline: r.tagline ?? "",
    tags: [r.restaurant_type ?? "Dining"],
    saves: r.loved_by?.length ?? 0,
    rating: r.bloom_rating ? String(r.bloom_rating.toFixed(1)) : "—",
    priceRange: r.price_range ?? "$",
    heroColor,
    accentColor: heroColor,
    textColor: "#FFF",
    menuHighlights: (r.girl_favorites ?? []).slice(0, 3).map(g => ({ item: g.item, price: "" })),
    bloomieNote: r.bloom_tips?.[0] ?? r.polaroid_caption ?? "",
    lovedBy: r.loved_by?.length ?? 0,
    poem: r.poem ?? r.tagline ?? "",
    polaroidCaption: r.polaroid_caption ?? "",
    hostNote: r.host_note ? { from: "BloomBay", text: r.host_note } : { from: "BloomBay", text: r.about ?? "" },
    about: r.about ?? "",
    tips: r.bloom_tips ?? [],
    girlFavorites: (r.girl_favorites ?? []).map(g => ({ item: g.item, note: g.description ?? "", tone: "#FFE8D0" })),
    reviews: (r.reviews ?? []).map(rv => ({ name: rv.author, text: rv.text, ago: "recently" })),
    hours: r.hours ? Object.values(r.hours)[0] ?? "Daily" : "Daily",
    instagram: r.instagram ?? "",
    visited: (r.visited_by ?? []).length > 0,
  };
}

export function MenuTemplate({ partner: p }: { partner: EatsPartner }) {
  const isFine    = p.type === "fine_dining";
  const isCafé    = p.type === "café";
  const isBakery  = p.type === "bakery";

  return (
    <div style={{
      marginBottom: 14, borderRadius: 14, overflow: "hidden",
      ...(isFine   ? { backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: p.heroColor } : {}),
      ...(isCafé   ? { background: "#F6FAF2", border: "1px solid rgba(138,200,120,0.2)" } : {}),
      ...(isBakery ? { background: "#FEF8F0", border: "1px solid rgba(200,120,60,0.2)" } : {}),
      ...(!isFine && !isCafé && !isBakery ? { backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "#FFFAF4", border: "1px solid rgba(255,155,112,0.15)" } : {}),
      padding: "14px",
    }}>
      {/* Menu header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: isFine ? "var(--font-playfair)" : "var(--font-jost)", fontStyle: isFine ? "italic" : "normal", fontSize: isFine ? 16 : 11, fontWeight: isFine ? 700 : 800, color: isFine ? "rgba(255,255,255,0.9)" : "#3A2010", letterSpacing: isFine ? "0" : "0.08em" }}>{p.name}</p>
          {isFine && <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginTop: 2 }}>MENU</p>}
        </div>
        <div style={{ width: 26, height: 1, background: isFine ? "rgba(255,255,255,0.3)" : "rgba(180,90,40,0.3)" }}/>
      </div>
      {/* Items */}
      {p.menuHighlights.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "9px 0",
          borderBottom: i < p.menuHighlights.length - 1 ? `1px solid ${isFine ? "rgba(255,255,255,0.08)" : "rgba(180,90,40,0.1)"}` : "none",
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: isFine ? "var(--font-playfair)" : "var(--font-jost)", fontStyle: isFine ? "italic" : "normal", fontSize: 12, fontWeight: isFine ? 600 : 700, color: isFine ? "rgba(255,255,255,0.88)" : "#2A1A10", lineHeight: 1.2 }}>{item.item}</p>
            {item.note && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: isFine ? `${p.accentColor}bb` : "#AA8060", marginTop: 2 }}>{item.note}</p>}
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: isFine ? p.accentColor : "#FF9B70", marginLeft: 12, flexShrink: 0 }}>{item.price}</p>
        </div>
      ))}
    </div>
  );
}

export function EatsPartnerCard({ partner: p, noteCount, saved, onToggleSave, onOpen, onReserve }: { partner: EatsPartner; noteCount: number; saved: boolean; onToggleSave: () => void; onOpen: () => void; onReserve: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const typeLabel: Record<RestaurantType, string> = {
    fine_dining: "FINE DINING", café: "CAFÉ", bar: "BAR", bakery: "BAKERY", casual: "CASUAL",
  };

  return (
    <div style={{
      marginBottom: 14, borderRadius: 22, overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
    }}>
      {/* Hero band — tap to open storefront */}
      <div onClick={onOpen} style={{
        position: "relative", height: 110, cursor: "pointer",
        backgroundImage: `${DARK_GRAIN}`,
        backgroundSize: "160px 160px",
        backgroundColor: p.heroColor,
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 50%, ${p.accentColor}55 0%, transparent 65%)` }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }}/>
        {/* Type badge */}
        <div style={{ position: "absolute", top: 12, left: 14, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "3px 10px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>{typeLabel[p.type]}</span>
        </div>
        {/* Save */}
        <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} style={{ position: "absolute", top: 10, right: 78, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "#FF9B70" : "none"} stroke="#FF9B70" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
        {/* Pinned bloom notes stack — only renders when real notes exist */}
        {noteCount > 0 && (
          <div style={{ position: "absolute", top: 14, right: 12, width: 56, height: 54, pointerEvents: "none" }}>
            {/* 3rd paper (5+ notes) */}
            {noteCount >= 5 && <div style={{ position: "absolute", inset: "6px -1px 0 4px", background: "#EED8AA", borderRadius: 3, transform: "rotate(7deg)", boxShadow: "0 2px 7px rgba(0,0,0,0.28)" }}/>}
            {/* 2nd paper (2+ notes) */}
            {noteCount >= 2 && <div style={{ position: "absolute", inset: "3px 1px 0 2px", background: "#F6E8C8", borderRadius: 3, transform: "rotate(-4deg)", boxShadow: "0 2px 7px rgba(0,0,0,0.24)" }}/>}
            {/* front note — always */}
            <div style={{ position: "absolute", inset: 0, background: "#FFF8E6", borderRadius: 3, transform: "rotate(1.5deg)", boxShadow: "0 4px 14px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 900, fontStyle: "italic", color: "#C0185F", lineHeight: 1 }}>{noteCount}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 800, letterSpacing: "0.12em", color: "#9A8A6A", marginTop: 2 }}>NOTES</p>
            </div>
            {/* push pin */}
            <PushPin color="pink" size={12} style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}/>
          </div>
        )}
        {/* Name */}
        <div style={{ position: "absolute", bottom: 10, left: 14, right: 46 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{p.name}</p>
        </div>
        {/* Visit hint */}
        <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(255,255,255,0.16)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>VISIT</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      {/* Info strip */}
      <div style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: "#FFFAF6", padding: "12px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#999", letterSpacing: "0.08em" }}>{p.hood.toUpperCase()}</span>
          <span style={{ color: "#ddd" }}>·</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#bbb" }}>{p.priceRange}</span>
          <span style={{ color: "#ddd" }}>·</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#FF9B70" }}>★ {p.rating}</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#bbb" }}>{p.saves} saves</span>
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#7A5A40", marginBottom: 8, lineHeight: 1.3 }}>"{p.tagline}"</p>
        {/* Tags */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: 10 }}>
          {p.tags.map(tag => (
            <span key={tag} style={{ background: "rgba(255,155,112,0.12)", border: "1px solid rgba(255,155,112,0.22)", borderRadius: 999, padding: "3px 9px", fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "#CC7040", letterSpacing: "0.04em" }}>{tag}</span>
          ))}
        </div>

        {/* Bloomie note */}
        <div style={{ background: "rgba(255,155,112,0.07)", borderLeft: `3px solid ${p.accentColor}`, padding: "8px 10px", marginBottom: 10, borderRadius: "0 8px 8px 0" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#5A3A20", lineHeight: 1.4 }}>{p.bloomieNote}</p>
        </div>

        {/* Reserve button */}
        <div style={{ marginBottom: 10 }}>
          <button
            onClick={onReserve}
            style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK, background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)", borderRadius: 999, padding: "6px 14px", cursor: "pointer" }}
          >
            Reserve ✦
          </button>
        </div>

        {/* Menu toggle */}
        <button onClick={() => setMenuOpen(o => !o)} style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 0 12px",
          borderTop: "1px solid rgba(255,155,112,0.12)",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: "#FF9B70" }}>MENU HIGHLIGHTS</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF9B70" strokeWidth="2.5" strokeLinecap="round" style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* Menu template — expandable */}
        {menuOpen && <MenuTemplate partner={p} />}
      </div>
    </div>
  );
}

export function EatsPage({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("Tonight");
  const [savedIds, setSaved] = useState<number[]>([]);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [realPartners, setRealPartners] = useState<EatsPartner[]>([]);
  const [reserveTarget, setReserveTarget] = useState<{ id: string; name: string } | null>(null);
  function toggleSave(id: number) { setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

  useEffect(() => {
    let cancelled = false;
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient()
        .from("restaurant_partners")
        .select("*")
        .order("bloom_notes", { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (cancelled) return;
          if (error) console.error("[EatsPage] restaurant_partners:", error.message);
          const partners = data && data.length > 0
            ? (data as RealPartnerRow[]).map((r, i) => realToEatsPartner(r, i))
            : null;
          if (partners) setRealPartners(partners);
          // Use whichever partner list will actually be displayed
          const slugs = (partners ?? EATS_PARTNERS).map(p => toSlug(p.name));
          getNoteCountsByPlace(slugs).then(counts => { if (!cancelled) setNoteCounts(counts); }).catch(() => {});
        });
    });
    return () => { cancelled = true; };
  }, []);

  const allPartners = realPartners.length > 0 ? realPartners : EATS_PARTNERS;
  const openPartner = allPartners.find(p => p.id === profileId);
  if (openPartner) return <PartnerStorefront partner={openPartner} onBack={() => setProfileId(null)} />;

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
      backgroundSize: "200px 200px, 80px 80px",
      background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)", minHeight: "100vh", paddingBottom: 120,
    }}>
      {/* Compact header */}
      <div style={{ position: "relative", height: 88, overflow: "hidden", backgroundImage: `${DARK_GRAIN}, linear-gradient(135deg, #FF9060 0%, #FFB080 55%, #FF8050 100%)`, backgroundSize: "160px 160px, 100% 100%" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }}/>
        <BackBtn onBack={onBack}/>
        <div style={{ position: "absolute", bottom: 14, left: 18, display: "flex", alignItems: "baseline", gap: 10 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 2px 14px rgba(200,80,30,0.5)" }}>Tonight&apos;s Table</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.65)" }}>EATS · NYC</p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, #FF9B7088, ${PINK}66, #FF9B7088, transparent)` }}/>
      </div>

      {/* Filters */}
      <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "#FFF5F0", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0", scrollbarWidth: "none" as const }}>
          {EATS_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, border: `1.5px solid ${activeFilter === f ? "#FF9B70" : "rgba(180,100,60,0.25)"}`, background: activeFilter === f ? "#FF9B70" : "rgba(255,255,255,0.6)", color: activeFilter === f ? "white" : "rgba(160,80,40,0.8)", fontSize: "9px", fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: "14px 14px 0" }}>

        {/* Featured grid — first 3 real partners */}
        {allPartners.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {/* Big left card */}
            <div onClick={() => setProfileId(allPartners[0].id)} style={{ gridRow: "span 2", backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: allPartners[0].heroColor, borderRadius: 18, minHeight: 252, position: "relative", overflow: "hidden", boxShadow: "0 6px 24px rgba(200,80,30,0.25)", cursor: "pointer" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(255,180,100,0.3) 0%, transparent 70%)" }}/>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.6) 100%)" }}/>
              <div style={{ position: "absolute", top: 13, right: 11, background: "rgba(255,255,255,0.22)", borderRadius: 999, padding: "3px 8px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{allPartners[0].saves} saved</span>
              </div>
              <div style={{ position: "absolute", bottom: 15, left: 12, right: 12 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 19, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.4)", marginBottom: 3 }}>{allPartners[0].name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>{allPartners[0].hood.toUpperCase()}</p>
              </div>
            </div>
            {/* Top-right */}
            {allPartners[1] && (
              <div onClick={() => setProfileId(allPartners[1].id)} style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: allPartners[1].heroColor, borderRadius: 18, minHeight: 118, position: "relative", overflow: "hidden", boxShadow: "0 4px 16px rgba(200,80,30,0.18)", cursor: "pointer" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>{allPartners[1].name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", marginTop: 2 }}>{allPartners[1].hood.toUpperCase()}</p>
                </div>
              </div>
            )}
            {/* Bottom-right */}
            {allPartners[2] && (
              <div onClick={() => setProfileId(allPartners[2].id)} style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: PAPER, borderRadius: 18, minHeight: 118, padding: "12px 13px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.09)", cursor: "pointer" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1, marginBottom: 2 }}>{allPartners[2].name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", letterSpacing: "0.08em" }}>{allPartners[2].hood.toUpperCase()}</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#BB7788", marginTop: 6, lineHeight: 1.4 }}>{allPartners[2].bloomieNote}</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 20px 20px", color: "rgba(160,80,40,0.45)" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15 }}>Partners coming soon</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, marginTop: 4, letterSpacing: "0.1em" }}>CHECK BACK TONIGHT</p>
          </div>
        )}

        {/* Spot grid — partners 3–9 */}
        {allPartners.length > 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 14 }}>
            {allPartners.slice(3, 9).map(p => (
              <div key={p.id} onClick={() => setProfileId(p.id)} style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: "#FAF0E8", borderRadius: 16, padding: "13px 13px 11px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", cursor: "pointer" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2, marginBottom: 4 }}>{p.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#aaa", letterSpacing: "0.06em" }}>{p.hood.toUpperCase()}</p>
                <div style={{ marginTop: 9, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb" }}>{p.saves} saved</span>
                  <button onClick={e => { e.stopPropagation(); toggleSave(p.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={savedIds.includes(p.id) ? "#FF9B70" : "none"} stroke="#FF9B70" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GO-TO LATELY — dynamic from real partners */}
        {allPartners.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: "#FEF3E8", borderRadius: 14, padding: "14px 13px", transform: "rotate(-0.4deg)", boxShadow: "2px 4px 16px rgba(0,0,0,0.18)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#FF9B70", marginBottom: 9 }}>GO-TO LATELY</p>
              {allPartners.slice(0, 5).map((p, i) => (
                <div key={p.id} onClick={() => setProfileId(p.id)} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, cursor: "pointer" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#FF9B70" }}>{i + 1}.</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#2a1a10" }}>{p.name}</span>
                </div>
              ))}
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#FF9B70", marginTop: 6, opacity: 0.75 }}>girls night →</p>
            </div>
          </div>
        )}

        {/* ── PARTNER PROFILES ── */}
        <div style={{ paddingTop: 8 }}>
          <div style={{ padding: "0 14px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF9B70" }}/>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "#FF9B70" }}>BLOOMIES PARTNERS</p>
          </div>
          {allPartners.map(p => (
            <EatsPartnerCard key={p.id} partner={p} noteCount={noteCounts[toSlug(p.name)] ?? 0} saved={savedIds.includes(p.id)} onToggleSave={() => toggleSave(p.id)} onOpen={() => setProfileId(p.id)} onReserve={() => setReserveTarget({ id: String(p.id), name: p.name })} />
          ))}
        </div>
      </div>

      {reserveTarget && (
        <ReserveTableSheet
          restaurantId={reserveTarget.id}
          restaurantName={reserveTarget.name}
          onClose={() => setReserveTarget(null)}
        />
      )}
    </div>
  );
}
