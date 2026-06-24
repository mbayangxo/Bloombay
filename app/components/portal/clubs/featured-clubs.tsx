import Link from "next/link";
import Image from "next/image";
import { PushPin, WashiTape } from "../scrapbook";
import { ClubCrestSVG } from "../club-crest";
import { thumbUrl } from "@/lib/images/supabase-transform";
import { PINK, DARK, PAPER_TEX, ROTS, GRADS, type RealClub } from "./shared";

export function FeaturedClubs({ clubs }: { clubs: RealClub[] }) {
  return (
    <section style={{ padding: "0 0 4px" }}>
      <div style={{ padding: "4px 18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: PINK, boxShadow: `0 0 8px ${PINK}` }} />
          <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)" }}>FEATURED CLUBS</p>
        </div>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,31,125,0.8)" }}>tap to peek inside →</span>
      </div>

      <div className="bloom-stagger" style={{ display: "flex", gap: 18, overflowX: "auto", paddingLeft: 18, paddingRight: 18, paddingBottom: 36, scrollbarWidth: "none" as const }}>
        {clubs.length === 0 && (
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.35)", padding: "20px 0" }}>Clubs loading…</p>
        )}
        {clubs.slice(0, 16).map((club, idx) => {
          const href = club.slug ? `/member/clubs/${club.slug}` : `/member/clubs/${club.id}`;
          const rot = ROTS[idx % ROTS.length];
          const grad = club.primary_color
            ? `linear-gradient(145deg, ${club.primary_color}44 0%, ${club.primary_color} 100%)`
            : GRADS[idx % GRADS.length];
          return (
            <Link key={club.id} href={href} className="bloom-lift bloom-card-enter" style={{ textDecoration: "none", flexShrink: 0, position: "relative" }}>
              {idx % 2 === 0 ? (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(-1deg)", zIndex: 5 }}>
                  <WashiTape color={idx === 1 ? "pink" : "yellow"} width={54} height={16} />
                </div>
              ) : (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
                  <PushPin color="pink" size={13} />
                </div>
              )}
              <div style={{
                width: 140, background: "white", backgroundImage: PAPER_TEX, backgroundSize: "200px 200px",
                padding: "8px 8px 16px", boxShadow: "3px 6px 22px rgba(0,0,0,0.55)",
                transform: `rotate(${rot}deg)`, position: "relative",
                marginTop: Math.abs(rot) > 1.5 ? 8 : 4,
              }}>
                <div style={{ width: "100%", height: 108, background: grad, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                  {club.cover_url ? (
                    <Image src={thumbUrl(club.cover_url) ?? ""} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                  ) : (
                    <ClubCrestSVG
                      name={club.name} category={club.category ?? ""}
                      color={club.primary_color ?? PINK} size={82}
                      shape={idx % 3 === 0 ? "shield" : idx % 3 === 1 ? "oval" : "round"}
                    />
                  )}
                </div>
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 12, color: DARK, lineHeight: 1.2 }}>{club.name.toUpperCase()}</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: DARK, opacity: 0.5, marginTop: 4, lineHeight: 1.4 }}>
                    {club.description ? club.description.slice(0, 60) + (club.description.length > 60 ? "…" : "") : ""}
                  </p>
                  <p style={{ marginTop: 10, fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: PINK }}>JOIN →</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
