"use client";

import Link from "next/link";
import { BloomBayCrest } from "@/app/components/crest/bloombay-crest";
import { ClubLogoPreview } from "./club-logo-preview";
import { BBLogo } from "./bb-logo";
import type { ClubLayoutId } from "@/lib/clubs/layout-templates";
import type { ClubLogoTemplateId } from "@/lib/clubs/logo-templates";
import type { CrestAccentId, CrestSymbolId } from "@/lib/crest-system";

export type ClubHeroProps = {
  layout: ClubLayoutId;
  name: string;
  tagline: string;
  tags: string[];
  memberCount: number;
  city: string;
  color: string;
  accentColor: string;
  crestBg: string;
  coverUrl?: string | null;
  darkBg: boolean;
  crestSymbol?: CrestSymbolId;
  crestAccent?: CrestAccentId;
  logoUrl?: string | null;
  logoTemplate?: ClubLogoTemplateId;
  logoText?: string | null;
  crestImageUrl?: string | null;
};

function ClubCrestFallback({
  name,
  color,
  crestBg,
  size = 72,
}: {
  name: string;
  color: string;
  crestBg: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 relative"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, ${crestBg})`,
        boxShadow: `0 4px 24px ${color}55`,
        fontSize: size / 3.2,
        fontFamily: "var(--font-playfair)",
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function ClubLogoMark({
  name,
  color,
  accentColor,
  crestBg,
  logoUrl,
  logoTemplate,
  logoText,
  size,
}: {
  name: string;
  color: string;
  accentColor: string;
  crestBg: string;
  logoUrl?: string | null;
  logoTemplate?: ClubLogoTemplateId;
  logoText?: string | null;
  size: "sm" | "md" | "lg";
}) {
  const hasUploadedLogo = Boolean(logoUrl);
  const hasTemplateLogo = Boolean(logoTemplate && (logoText || name));
  const previewSize = size === "lg" ? "lg" : "sm";

  if (hasUploadedLogo || hasTemplateLogo) {
    return (
      <ClubLogoPreview
        mode={hasUploadedLogo ? "upload" : "template"}
        templateId={logoTemplate ?? "seal"}
        logoText={logoText?.trim() || name}
        logoUrl={logoUrl ?? null}
        primaryColor={color}
        accentColor={accentColor}
        size={previewSize}
      />
    );
  }

  const dim = size === "lg" ? 80 : size === "md" ? 76 : 64;
  return <ClubCrestFallback name={name} color={color} crestBg={crestBg} size={dim} />;
}

function ClubCrestSeal({
  name,
  crestImageUrl,
  symbolId,
  accentId,
  size,
}: {
  name: string;
  crestImageUrl?: string | null;
  symbolId?: CrestSymbolId;
  accentId?: CrestAccentId;
  size: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? 56 : size === "md" ? 48 : 40;

  if (crestImageUrl) {
    return (
      <div
        className="rounded-full overflow-hidden flex-shrink-0"
        style={{ width: dim, height: dim, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={crestImageUrl} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (symbolId && accentId) {
    return <BloomBayCrest clubName={name} config={{ symbolId, accentId }} size={size === "lg" ? "md" : "sm"} />;
  }

  return null;
}

export function ClubLayoutHero({
  layout,
  name,
  tagline,
  tags,
  memberCount,
  city,
  color,
  accentColor,
  crestBg,
  coverUrl,
  darkBg,
  crestSymbol,
  crestAccent,
  logoUrl,
  logoTemplate,
  logoText,
  crestImageUrl,
}: ClubHeroProps) {
  const textMain = darkBg ? "white" : "#111111";
  const textMuted = darkBg ? "rgba(255,255,255,0.62)" : "#888";
  const hasCrest = Boolean(crestImageUrl || (crestSymbol && crestAccent));

  const backLink = (
    <Link
      href="/member/clubs"
      className="flex items-center gap-1.5 text-sm font-medium"
      style={{ color: darkBg ? "rgba(255,255,255,0.75)" : "#111111" }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Clubs
    </Link>
  );

  if (layout === "editorial") {
    return (
      <div className="relative overflow-hidden" style={{ minHeight: coverUrl ? "320px" : "280px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: coverUrl ? `url(${coverUrl})` : `linear-gradient(145deg, ${color}, ${accentColor})`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: coverUrl
              ? "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)"
              : "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-12 flex items-center justify-between">
          {backLink}
          <BBLogo size={28} light />
        </div>
        <div className="relative z-10 px-5 pt-28 pb-8 flex flex-col justify-end min-h-[320px]">
          <div className="flex items-center gap-3 mb-3">
            <ClubLogoMark
              name={name}
              color={color}
              accentColor={accentColor}
              crestBg={crestBg}
              logoUrl={logoUrl}
              logoTemplate={logoTemplate}
              logoText={logoText}
              size="sm"
            />
            {hasCrest ? (
              <ClubCrestSeal
                name={name}
                crestImageUrl={crestImageUrl}
                symbolId={crestSymbol}
                accentId={crestAccent}
                size="sm"
              />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.22)", color: "white" }}
              >
                {t}
              </span>
            ))}
          </div>
          <h1
            className="text-4xl font-bold leading-[0.95] text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {name}
          </h1>
          <p className="text-sm mt-2 italic text-white/80" style={{ fontFamily: "var(--font-playfair)" }}>
            {tagline}
          </p>
          <p className="text-xs mt-3 text-white/55">
            {memberCount.toLocaleString()} women · {city}
          </p>
        </div>
      </div>
    );
  }

  if (layout === "midnight") {
    return (
      <div
        className="relative overflow-hidden"
        style={{
          background: "#0A0A0A",
          minHeight: "300px",
        }}
      >
        {coverUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
        ) : null}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 80% 0%, ${color}44 0%, transparent 55%)`,
          }}
        />
        <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-12 flex items-center justify-between">
          {backLink}
          <BBLogo size={28} light />
        </div>
        <div className="relative z-10 px-5 pt-24 pb-8">
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <ClubLogoMark
                name={name}
                color={color}
                accentColor={accentColor}
                crestBg={crestBg}
                logoUrl={logoUrl}
                logoTemplate={logoTemplate}
                logoText={logoText}
                size="md"
              />
              {hasCrest ? (
                <ClubCrestSeal
                  name={name}
                  crestImageUrl={crestImageUrl}
                  symbolId={crestSymbol}
                  accentId={crestAccent}
                  size="sm"
                />
              ) : null}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: accentColor }}>
                {tagline.split(" ").slice(0, 3).join(" ")}
              </p>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                {name}
              </h1>
              <p className="text-xs mt-1 text-white/45">
                {memberCount.toLocaleString()} women · {city}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${color}33`, color: accentColor, border: `1px solid ${color}55` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* salon — default */
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: darkBg ? "#111111" : `linear-gradient(160deg, ${color}22 0%, ${accentColor}18 45%, #FFF5F8 70%)`,
        minHeight: "280px",
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: "300px",
          height: "300px",
          background: color,
          borderRadius: "50%",
          right: "-80px",
          top: "-80px",
          opacity: 0.12,
        }}
      />
      <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-12 flex items-center justify-between">
        {backLink}
        <BBLogo size={28} light={darkBg} />
      </div>
      <div className="relative z-10 px-5 pt-24 pb-8">
        <div className="flex items-end gap-5">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <ClubLogoMark
              name={name}
              color={color}
              accentColor={accentColor}
              crestBg={crestBg}
              logoUrl={logoUrl}
              logoTemplate={logoTemplate}
              logoText={logoText}
              size="lg"
            />
            {hasCrest ? (
              <ClubCrestSeal
                name={name}
                crestImageUrl={crestImageUrl}
                symbolId={crestSymbol}
                accentId={crestAccent}
                size="sm"
              />
            ) : null}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}22`, color }}
                >
                  {t}
                </span>
              ))}
            </div>
            <h1
              className="text-2xl font-bold leading-tight"
              style={{ color: textMain, fontFamily: "var(--font-playfair)" }}
            >
              {name}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: textMuted }}>
              {memberCount.toLocaleString()} women · {city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mini preview for club studio */
export function ClubLayoutPreview({
  layout,
  primaryColor,
  accentColor,
  coverUrl,
  name,
}: {
  layout: ClubLayoutId;
  primaryColor: string;
  accentColor: string;
  coverUrl?: string | null;
  name: string;
}) {
  if (layout === "editorial") {
    return (
      <div className="rounded-xl overflow-hidden h-28 relative" style={{ background: "#f5f0e8" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: coverUrl ? `url(${coverUrl})` : `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 30%, rgba(0,0,0,0.5))" }} />
        <p className="absolute bottom-2 left-2 right-2 text-[10px] font-bold text-white truncate">{name || "Your Club"}</p>
      </div>
    );
  }
  if (layout === "midnight") {
    return (
      <div className="rounded-xl overflow-hidden h-28 relative bg-[#0A0A0A]">
        {coverUrl ? (
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${coverUrl})` }} />
        ) : null}
        <div className="absolute top-2 left-2 w-8 h-8 rounded-full" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />
        <p className="absolute bottom-2 left-2 text-[10px] font-bold text-white truncate">{name || "Your Club"}</p>
        <div className="absolute top-2 right-2 w-6 h-1 rounded" style={{ background: accentColor }} />
      </div>
    );
  }
  return (
    <div
      className="rounded-xl overflow-hidden h-28 relative p-2"
      style={{ background: `linear-gradient(160deg, ${primaryColor}18, #fff5f8)` }}
    >
      <div className="w-9 h-9 rounded-full mx-auto mt-1" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />
      <p className="text-center text-[9px] font-bold mt-2 truncate" style={{ color: "#111" }}>
        {name || "Your Club"}
      </p>
      <div className="mx-2 mt-2 h-6 rounded-lg bg-white/80" />
    </div>
  );
}
