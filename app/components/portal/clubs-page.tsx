"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClubLogoPreview } from "./club-logo-preview";
import { ClubCrestPreview } from "./club-crest-preview";
import type { PortalClub } from "@/lib/clubs/types";
import type { ClubLogoTemplateId } from "@/lib/clubs/logo-templates";
import type { CrestAccentId, CrestSymbolId } from "@/lib/crest-system";

function ClubAvatar({ club, size = 50 }: { club: PortalClub; size?: number }) {
  const hasLogo = Boolean(club.logoUrl || (club.logoTemplate && club.logoText));
  const hasCrest = Boolean(club.crestImageUrl || (club.crestSymbol && club.crestAccent));

  if (hasLogo) {
    return (
      <ClubLogoPreview
        mode={club.logoUrl ? "upload" : "template"}
        templateId={(club.logoTemplate as ClubLogoTemplateId) ?? "seal"}
        logoText={club.logoText ?? club.name}
        logoUrl={club.logoUrl}
        primaryColor={club.color}
        accentColor={club.accentColor}
        size="sm"
      />
    );
  }

  if (hasCrest) {
    return (
      <ClubCrestPreview
        mode={club.crestImageUrl ? "upload" : "generate"}
        crestImageUrl={club.crestImageUrl}
        clubName={club.name}
        symbolId={club.crestSymbol as CrestSymbolId | undefined}
        accentId={club.crestAccent as CrestAccentId | undefined}
        size="sm"
      />
    );
  }

  const initials = club.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div
      className="flex-shrink-0 relative rounded-full flex items-center justify-center font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${club.color}, ${club.crestBg})`,
        boxShadow: `0 4px 16px ${club.color}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
        fontSize: size / 3.2,
      }}
    >
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

function FeaturedDoor({ club }: { club: PortalClub }) {
  const hero = club.coverUrl ?? club.bannerUrl;
  return (
    <Link href={`/member/clubs/${club.slug}`} style={{ textDecoration: "none" }}>
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: hero
            ? `center/cover url(${hero})`
            : `linear-gradient(150deg, ${club.color} 0%, ${club.crestBg} 100%)`,
          boxShadow: `0 12px 40px ${club.color}40`,
          minHeight: "220px",
        }}
      >
        <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: "220px" }}>
          <div className="flex items-start justify-between">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.3)", color: "white" }}
            >
              ✦ BloomBay Official
            </span>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: "17px",
                color: "rgba(255,255,255,0.75)",
                marginBottom: "4px",
              }}
            >
              {club.tagline}
            </p>
            <h2
              className="text-3xl font-bold italic text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {club.name}
            </h2>
            <span
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
            >
              Enter the Clubhouse →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ClubRow({ club }: { club: PortalClub }) {
  return (
    <Link
      href={`/member/clubs/${club.slug}`}
      className="flex items-center gap-4 px-4 py-3.5"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", textDecoration: "none" }}
    >
      <ClubAvatar club={club} size={50} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="font-bold text-sm leading-snug" style={{ color: "#111111" }}>
            {club.name}
          </p>
          {club.isOfficial ? (
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "#111111", color: "white" }}
            >
              ✦
            </span>
          ) : null}
        </div>
        <p className="text-xs mb-1 leading-snug" style={{ color: "#999" }}>
          {club.vibe}
        </p>
        <p className="text-[11px]" style={{ color: "#bbb" }}>
          {club.isOfficial ? "By BloomBay" : `Hosted by ${club.curator}`}
        </p>
      </div>
      <span
        className="text-[11px] font-bold px-3 py-1.5 rounded-full flex-shrink-0"
        style={{ background: "#F5F5F5", color: "#555" }}
      >
        View →
      </span>
    </Link>
  );
}

function OnboardingSoon() {
  return (
    <div
      className="rounded-3xl p-6 text-center"
      style={{ background: "white", boxShadow: "0 1px 16px rgba(0,0,0,0.06)", border: "1.5px dashed #FFE0EE" }}
    >
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#FF1F7D" }}>
        COMING SOON
      </p>
      <p
        className="text-lg font-bold italic mb-2"
        style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}
      >
        More clubs as Club Mamas join
      </p>
      <p className="text-sm leading-relaxed mb-5" style={{ color: "#888" }}>
        We don&apos;t list placeholder clubs. When a Club Mama launches on BloomBay, their club
        appears here — real cover, real story, real members.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/member/clubs/create"
          className="px-5 py-3 rounded-full text-sm font-bold text-white"
          style={{ background: "#FF1F7D" }}
        >
          Create a club →
        </Link>
        <Link
          href="/club-owner/dashboard"
          className="px-5 py-3 rounded-full text-sm font-bold border-2"
          style={{ borderColor: "#FF1F7D", color: "#FF1F7D" }}
        >
          Club Mama portal
        </Link>
      </div>
    </div>
  );
}

export function ClubsPage() {
  const [clubs, setClubs] = useState<PortalClub[]>([]);
  const [onboardedCount, setOnboardedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/clubs");
      if (res.ok) {
        const json = await res.json();
        setClubs(json.clubs ?? []);
        setOnboardedCount(json.onboardedCount ?? 0);
      }
      setLoading(false);
    })();
  }, []);

  const q = query.toLowerCase().trim();
  const filtered = q
    ? clubs.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.vibe.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    : clubs;

  const official = filtered.filter((c) => c.isOfficial);
  const onboarded = filtered.filter((c) => !c.isOfficial);
  const featured = official[0];

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>
              BLOOMBAY
            </p>
            <h1
              className="text-4xl font-bold italic leading-none"
              style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}
            >
              Club House
            </h1>
            <p
              className="text-sm mt-1.5"
              style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", color: "#bbb" }}
            >
              {loading
                ? "Loading clubs…"
                : `${clubs.length} real ${clubs.length === 1 ? "club" : "clubs"}${onboardedCount ? ` · ${onboardedCount} onboarded` : ""}`}
            </p>
          </div>
          <Link
            href="/member/clubs/create"
            className="flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold text-white"
            style={{ background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.35)" }}
          >
            + Create club
          </Link>
        </div>

        <div
          className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 mb-4"
          style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: "1.5px solid #FFE0EE" }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#FF1F7D" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clubs…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#111111" }}
          />
        </div>
      </div>

      <div className="px-5 pb-8 md:px-8 md:max-w-[820px] md:mx-auto flex flex-col gap-5">
        {featured ? <FeaturedDoor club={featured} /> : null}

        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>
            BLOOMBAY CLUBS
          </p>
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: "white", boxShadow: "0 1px 16px rgba(0,0,0,0.06)" }}
          >
            {official.length > 0 ? (
              official.map((club) => <ClubRow key={club.slug} club={club} />)
            ) : (
              <p className="py-8 text-center text-sm" style={{ color: "#bbb" }}>
                No official clubs match that search.
              </p>
            )}
          </div>
        </div>

        {onboarded.length > 0 ? (
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>
              ONBOARDED CLUBS
            </p>
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: "white", boxShadow: "0 1px 16px rgba(0,0,0,0.06)" }}
            >
              {onboarded.map((club) => (
                <ClubRow key={club.slug} club={club} />
              ))}
            </div>
          </div>
        ) : (
          !loading && <OnboardingSoon />
        )}

        <div
          className="rounded-2xl px-4 py-3.5 flex items-start gap-3"
          style={{ background: "#111111" }}
        >
          <span style={{ color: "#FF1F7D", fontSize: "13px" }}>✦</span>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            BloomBay only shows clubs that exist — ours, or ones launched by verified Club Mamas.
            No fake listings.
          </p>
        </div>
      </div>
    </div>
  );
}
