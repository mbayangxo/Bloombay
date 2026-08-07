"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { saveVenue, unsaveVenue } from "@/lib/actions/venue-saves";

// ── Real data type ─────────────────────────────────────────────────────────────

interface VenueItem {
  id: string;
  name: string;
  neighborhood: string;
  tagline: string;
  type: string;
  bloom_notes: number;
  avg_rating: number;
  brand_color: string;
  cover_url: string | null;
  featured?: boolean;
}


const FILTERS = ["All", "Eat", "Explore", "Solo"] as const;
type Filter = typeof FILTERS[number];

const EAT_TYPES = ["restaurant", "café", "cafe", "bar", "bakery", "market", "food"];

function PlaceCard({ p, saved, onSave }: { p: VenueItem; saved: boolean; onSave: (e: React.MouseEvent) => void }) {
  const initial = p.brand_color;
  const bgColor = p.brand_color + "22";

  return (
    <Link href={`/member/city/places/${p.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 3px 16px rgba(0,0,0,0.07)" }}>
        <div className="relative flex items-center justify-center" style={{ height: 120, background: `linear-gradient(145deg, ${bgColor} 0%, ${initial}33 100%)`, overflow: "hidden" }}>
          {p.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 40, opacity: 0.5, color: p.brand_color }}>✿</span>
          )}
          {p.featured && (
            <span className="absolute top-2 left-3 text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
              style={{ background: "#FF1F7D", color: "white" }}>
              WOMEN&apos;S PICK
            </span>
          )}
          <button onClick={onSave}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.9)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
        <div className="px-3.5 py-3">
          <h3 className="font-black text-sm" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{p.name}</h3>
          <p className="text-[10px] mt-0.5" style={{ color: "#999" }}>{p.neighborhood}{p.type ? ` · ${p.type}` : ""}</p>
          <p className="text-[11px] mt-1.5 leading-snug" style={{ color: "#666", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{p.tagline}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span style={{ color: "#FF1F7D", fontSize: 10 }}>✿</span>
            <span className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>
              {p.bloom_notes >= 1000 ? `${(p.bloom_notes / 1000).toFixed(1)}k` : p.bloom_notes} women
            </span>
            {p.avg_rating > 0 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1"
                style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{p.avg_rating} ★</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PlacesPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/venues")
      .then(r => r.ok ? r.json() : [])
      .then((data: VenueItem[]) => {
        setVenues(data ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));

    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("venue_saves").select("venue_id").eq("user_id", user.id);
      setSaved(new Set((data ?? []).map((r: { venue_id: string }) => r.venue_id)));
    })();
  }, []);

  const shown = !loaded
    ? []
    : filter === "All"
    ? venues
    : filter === "Eat"
    ? venues.filter(p => EAT_TYPES.some(t => p.type.toLowerCase().includes(t)))
    : filter === "Explore"
    ? venues.filter(p => !EAT_TYPES.some(t => p.type.toLowerCase().includes(t)))
    : venues;

  function toggleSave(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const wasSaved = saved.has(id);
    setSaved(s => { const n = new Set(s); wasSaved ? n.delete(id) : n.add(id); return n; });
    void (wasSaved ? unsaveVenue(id) : saveVenue(id)).catch(() => {
      setSaved(s => { const n = new Set(s); wasSaved ? n.add(id) : n.delete(id); return n; });
    });
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-20 pb-4 md:pt-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/member/city"
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div>
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>THE CITY</p>
            <h1 className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,6vw,36px)", color: "#111" }}>
              All Places.
            </h1>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap"
              style={filter === f ? { background: "#111", color: "white" } : { background: "white", color: "#888", border: "1.5px solid #E8E8E8" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        {!loaded ? (
          <p className="text-xs text-center py-12" style={{ color: "#bbb" }}>Loading places…</p>
        ) : shown.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-bold italic text-base" style={{ color: "#ccc", fontFamily: "var(--font-playfair)" }}>No places here yet.</p>
            <p className="text-xs mt-1" style={{ color: "#ddd" }}>Curated spots will appear as they're added.</p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-4" style={{ color: "#aaa" }}>{shown.length} spots curated by women</p>
            <div className="grid grid-cols-2 gap-3">
              {shown.map(p => (
                <PlaceCard
                  key={p.id}
                  p={p}
                  saved={saved.has(String(p.id))}
                  onSave={e => toggleSave(e, String(p.id))}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
