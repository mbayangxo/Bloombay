"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BloomBayCrest } from "@/app/components/crest/bloombay-crest";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import { listMemberCrests, syncCrestsFromJoinedClubs, type MemberCrest } from "@/lib/crest-system";

export function MemberCrestCollection() {
  const [crests, setCrests] = useState<MemberCrest[]>([]);

  useEffect(() => {
    syncCrestsFromJoinedClubs();
    setCrests(listMemberCrests());
  }, []);

  if (!crests.length) {
    return (
      <BbEmptyState
        {...bloomEmptyProps("clubs", {
          label: "Browse clubs",
          href: "/member/clubs",
        })}
      />
    );
  }

  return (
    <div className="bb-crest-grid">
      {crests.map((c) => (
        <Link
          key={c.clubId}
          href={`/member/clubs/${c.clubId}`}
          className="bb-crest-grid__item"
        >
          <BloomBayCrest
            clubName={c.clubName}
            clubId={c.clubId}
            config={{ symbolId: c.symbolId, accentId: c.accentId }}
            size="sm"
            flippable
          />
          <p className="bb-crest-grid__name">{c.clubName}</p>
        </Link>
      ))}
    </div>
  );
}
