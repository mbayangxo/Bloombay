"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BloomBayCrest } from "@/app/components/crest/bloombay-crest";
import type { Club } from "@/app/member/clubs/club-data";
import { getClubBranding } from "@/lib/bloombay-events-store";
import { clubHeroImage } from "@/lib/club-hero-images";
import { getClubCrestConfig } from "@/lib/crest-system";
import { getClubProfile, isClubMember } from "@/lib/club-world-data";
import { trackClubPicked } from "@/lib/yande-member-state";

export function ClubWorldObject({
  club,
  index = 0,
  heroImage,
}: {
  club: Club;
  index?: number;
  heroImage?: string;
}) {
  const profile = getClubProfile(club.id);
  const crestConfig = getClubCrestConfig(club.id);
  const [heroSrc, setHeroSrc] = useState(() => heroImage ?? clubHeroImage(club.id));
  const [member, setMember] = useState(false);

  useEffect(() => {
    const prof = getClubProfile(club.id);
    if (heroImage) {
      setHeroSrc(heroImage);
    } else {
      const branding = getClubBranding(club.id);
      if (branding.bannerUrl) setHeroSrc(branding.bannerUrl);
      else if (prof?.landingHeroImage) setHeroSrc(prof.landingHeroImage);
      else if (prof?.photos.find((p) => p.imageUrl)?.imageUrl) {
        setHeroSrc(prof.photos.find((p) => p.imageUrl)!.imageUrl!);
      }
    }
    setMember(isClubMember(club.id));

    function refresh() {
      const b = getClubBranding(club.id);
      if (b.bannerUrl) setHeroSrc(b.bannerUrl);
    }
    window.addEventListener("bb-events-updated", refresh);
    return () => window.removeEventListener("bb-events-updated", refresh);
  }, [club.id, heroImage]);

  const nextEvent = club.upcomingEvents[0];
  const activity = club.vibeBoard[0];
  const href = member ? `/member/clubs/${club.id}/world` : `/member/clubs/${club.id}`;

  return (
    <Link
      href={href}
      className="bb-club-world-object"
      style={{ "--bb-tilt": `${index % 2 === 0 ? -0.5 : 0.4}deg` } as React.CSSProperties}
      onClick={() => trackClubPicked(club.id)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={heroSrc} alt="" className="bb-club-world-object__photo" />
      <div className="bb-club-world-object__veil" aria-hidden />
      <div className="bb-club-world-object__crest">
        <BloomBayCrest clubName={club.name} config={crestConfig} clubId={club.id} size="sm" />
      </div>
      <div className="bb-club-world-object__body">
        <h3 className="bb-club-world-object__name">{club.name}</h3>
        {nextEvent ? (
          <p className="bb-club-world-object__next">
            Next · {nextEvent.title} · {nextEvent.date}
          </p>
        ) : null}
        <p className="bb-club-world-object__meta">
          {club.members.toLocaleString()} members
          {profile ? ` · ${profile.hereNow} here now` : ""}
        </p>
        {activity ? (
          <p className="bb-club-world-object__pulse">
            <strong>{activity.author}</strong> · {activity.text.slice(0, 72)}
            {activity.text.length > 72 ? "…" : ""}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
