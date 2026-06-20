"use client";

import { initialsFromText, type ClubLogoTemplateId } from "@/lib/clubs/logo-templates";

export function ClubLogoPreview({
  mode,
  templateId,
  logoText,
  logoUrl,
  primaryColor,
  accentColor,
  size = "lg",
}: {
  mode: "upload" | "template";
  templateId: ClubLogoTemplateId;
  logoText: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? 120 : 72;
  const text = logoText.trim() || "Your Club";
  const initials = initialsFromText(text);

  if (mode === "upload" && logoUrl) {
    return (
      <div
        className="bb-club-logo-preview bb-club-logo-preview--upload"
        style={{ width: dim, height: dim }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="" className="bb-club-logo-preview__img" />
      </div>
    );
  }

  if (templateId === "wordmark") {
    return (
      <div className="bb-club-logo-preview bb-club-logo-preview--wordmark" style={{ minWidth: dim }}>
        <span style={{ color: primaryColor }}>{text}</span>
      </div>
    );
  }

  if (templateId === "monogram") {
    return (
      <div
        className="bb-club-logo-preview bb-club-logo-preview--monogram"
        style={{
          width: dim,
          height: dim,
          background: `radial-gradient(circle at 35% 30%, ${accentColor}, ${primaryColor})`,
        }}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      className="bb-club-logo-preview bb-club-logo-preview--seal"
      style={{
        width: dim,
        height: dim,
        borderColor: primaryColor,
        color: primaryColor,
      }}
    >
      <span className="bb-club-logo-preview__seal-ring" style={{ borderColor: accentColor }} />
      <span className="bb-club-logo-preview__seal-text">{text.length > 18 ? `${text.slice(0, 16)}…` : text}</span>
    </div>
  );
}
