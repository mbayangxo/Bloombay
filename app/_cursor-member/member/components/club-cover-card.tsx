"use client";

import { useEffect, useState } from "react";
import { ClubPoster } from "@/app/components/bloom-artifacts";
import type { Club } from "../clubs/club-data";
import { getClubProfile } from "@/lib/club-world-data";
import { getClubBranding } from "@/lib/bloombay-events-store";
import { trackClubPicked } from "@/lib/yande-member-state";
import { isClubMember } from "@/lib/club-world-data";

export function ClubCoverCard({ club, wide, compact }: { club: Club; wide?: boolean; compact?: boolean }) {
  const profile = getClubProfile(club.id);
  const [coverStyle, setCoverStyle] = useState<{ background?: string; backgroundImage?: string }>({
    background: club.gradient,
  });
  const [member, setMember] = useState(false);

  useEffect(() => {
    function refresh() {
      const branding = getClubBranding(club.id);
      if (branding.bannerUrl) {
        setCoverStyle({
          backgroundImage: `url(${branding.bannerUrl})`,
          background: undefined,
        });
      } else {
        setCoverStyle({ background: club.gradient });
      }
    }
    refresh();
    setMember(isClubMember(club.id));
    window.addEventListener("bb-events-updated", refresh);
    return () => window.removeEventListener("bb-events-updated", refresh);
  }, [club.id, club.gradient]);

  const href = member ? `/member/clubs/${club.id}/world` : `/member/clubs/${club.id}`;

  const posterClass = compact ? "bb-club-poster--compact" : wide ? "bb-club-poster--wide" : "";

  return (
    <ClubPoster
      name={club.name}
      category={club.category}
      tagline={club.tagline}
      meta={
        compact
          ? `${club.members.toLocaleString()} members`
          : `${profile?.hereNow ?? 0} here now · ${club.members.toLocaleString()} members`
      }
      coverStyle={coverStyle}
      href={href}
      joinLabel={member ? "Enter" : "Join"}
      className={posterClass}
      onClick={() => trackClubPicked(club.id)}
    />
  );
}
