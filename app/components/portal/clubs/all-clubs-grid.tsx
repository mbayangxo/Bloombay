import Link from "next/link";
import Image from "next/image";
import { ClubCrestSVG } from "../club-crest";
import { thumbUrl } from "@/lib/images/supabase-transform";
import { PINK, DARK, GRADS, type RealClub } from "./shared";

const FILTER_TO_CATEGORY: Record<string, string> = {
  Wellness:  "wellness",
  Social:    "social",
  Creative:  "creative",
  Foodie:    "foodie",
  Active:    "active",
  Fashion:   "fashion",
  Faith:     "faith",
};

export function AllClubsGrid({ clubs, searchQuery, activeFilter }: {
  clubs: RealClub[];
  searchQuery: string;
  activeFilter: string | null;
}) {
  const categoryFilter = activeFilter ? FILTER_TO_CATEGORY[activeFilter] ?? null : null;

  const filtered = clubs
    .filter(c =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(c =>
      !categoryFilter ||
      (c.category ?? "").toLowerCase() === categoryFilter
    );

  return (
    <section style={{ padding: "0 18px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, boxShadow: `0 0 8px ${PINK}` }} />
          <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)" }}>ALL CLUBS</p>
        </div>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,31,125,0.7)" }}>
          {searchQuery || categoryFilter ? `${filtered.length} results` : `${clubs.length} spaces`}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map((club, idx) => {
          const href = club.slug ? `/member/clubs/${club.slug}` : `/member/clubs/${club.id}`;
          const grad = club.primary_color
            ? `linear-gradient(145deg, ${club.primary_color}55 0%, ${club.primary_color} 100%)`
            : GRADS[idx % GRADS.length];
          return (
            <Link key={`grid-${club.id}`} href={href} style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: 18, overflow: "hidden", background: grad, position: "relative", boxShadow: "0 4px 18px rgba(0,0,0,0.35)" }}>
                {club.cover_url && (
                  <div style={{ position: "absolute", inset: 0 }}>
                    <Image src={thumbUrl(club.cover_url) ?? ""} alt="" fill unoptimized style={{ objectFit: "cover", opacity: 0.5 }} />
                  </div>
                )}
                <div style={{ position: "relative", zIndex: 1, padding: "14px 14px 12px" }}>
                  <div style={{ minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {!club.cover_url && (
                      <ClubCrestSVG
                        name={club.name} category={club.category ?? ""}
                        color={club.primary_color ?? PINK} size={56}
                        shape={idx % 3 === 0 ? "shield" : idx % 3 === 1 ? "oval" : "round"}
                      />
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 13, color: "white", lineHeight: 1.2, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>{club.name}</p>
                  {club.description && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 4, lineHeight: 1.4 }}>
                      {club.description.slice(0, 48)}{club.description.length > 48 ? "…" : ""}
                    </p>
                  )}
                  <div style={{ marginTop: 10, display: "inline-flex", background: "rgba(255,255,255,0.18)", borderRadius: 999, padding: "4px 12px" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: "white" }}>JOIN →</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.35)", padding: "20px 0", gridColumn: "span 2" }}>
            {clubs.length === 0 ? "Clubs loading…" : "No clubs match your filter."}
          </p>
        )}
      </div>
    </section>
  );
}
