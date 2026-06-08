"use client";

import Link from "next/link";
import type { Club } from "@/app/member/clubs/club-data";
import { getClubBranding } from "@/lib/bloombay-events-store";
import { clubHeroImage } from "@/lib/club-hero-images";
import { getClubProfile, isClubMember } from "@/lib/club-world-data";
import { trackClubPicked } from "@/lib/yande-member-state";

function formatMembers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return count.toLocaleString();
}

export function ClubPolaroidCard({
  club,
  heroImage,
  index = 0,
}: {
  club: Club;
  heroImage?: string;
  index?: number;
}) {
  const profile = getClubProfile(club.id);
  const branding = getClubBranding(club.id);
  const src =
    heroImage ||
    branding.bannerUrl ||
    profile?.landingHeroImage ||
    profile?.photos.find((p) => p.imageUrl)?.imageUrl ||
    clubHeroImage(club.id);
  const next = club.upcomingEvents[0];
  const tradition = next ? `${next.title} · ${next.date}` : club.tagline;
  const href = isClubMember(club.id)
    ? `/member/clubs/${club.id}/world`
    : `/member/clubs/${club.id}`;

  return (
    <Link
      href={href}
      className="bb-club-polaroid"
      style={{ "--bb-tilt": `${(index % 3) - 1}deg` } as React.CSSProperties}
      onClick={() => trackClubPicked(club.id)}
    >
      <div className="bb-club-polaroid__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="bb-club-polaroid__photo"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <span className="bb-club-polaroid__count">{formatMembers(club.members)}</span>
      </div>
      <div className="bb-club-polaroid__body">
        <h3 className="bb-club-polaroid__name">{club.name}</h3>
        <p className="bb-club-polaroid__vibe">{club.tagline}</p>
        <p className="bb-club-polaroid__tradition">{tradition}</p>
        <span className="bb-club-polaroid__cta">Join →</span>
      </div>
    </Link>
  );
}
