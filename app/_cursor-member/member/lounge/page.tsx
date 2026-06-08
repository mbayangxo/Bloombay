"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MemberShell } from "../components/member-shell";
import { SpaceMood } from "@/app/components/member/space-mood";
import { MemberNavIcon } from "../components/nav-icons";
import { getTimeOfDayGreeting } from "@/lib/time-of-day";
import { readYandeMemberState } from "@/lib/yande-member-state";
import { BLOOM_PLACES } from "@/lib/bloom-places";
import { APARTMENT_OBJECTS } from "@/lib/apartment-objects";

const APARTMENT_NAV_ICONS: Record<string, string> = {
  memories: "city",
  bouquet: "clubs",
  bloomies: "intros",
  invitations: "happenings",
  library: "calendar",
  "girl-code": "lobby",
  "event-qr": "home",
};
import { PlaceCover } from "@/app/components/member/place-cover";

export default function LoungePage() {
  const [name, setName] = useState("you");
  const [greeting, setGreeting] = useState(() => getTimeOfDayGreeting());
  const [bouquet, setBouquet] = useState({ filled: 0, max: 12 });

  useEffect(() => {
    const stored = sessionStorage.getItem("gf_name");
    if (stored) setName(stored.split(" ")[0] ?? stored);
    setGreeting(getTimeOfDayGreeting());
    const s = readYandeMemberState();
    setBouquet({ filled: s.bouquetFilled, max: s.bouquetMax });
  }, []);

  return (
    <MemberShell hideHeader flush fullWidth>
      <SpaceMood mood="lounge" showIntro={false}>
        <div className="bb-apartment bb-apartment--full-pink">
          <PlaceCover
            tone="editorial"
            className="bb-apartment__hero"
            eyebrow={`${greeting} · ${name}`}
            title="My apartment"
            whisper={`${bouquet.filled} of ${bouquet.max} stems in your bouquet · your private corner.`}
            authored="Touch something — memories, invites, and your door QR live here."
          />

          <div className="bb-apartment-objects bb-apartment-objects--home" aria-label="Objects in your apartment">
            {APARTMENT_OBJECTS.map((obj) => (
              <Link key={obj.id} href={obj.href} className="bb-apartment-object">
                <span className="bb-apartment-object__icon" aria-hidden>
                  <MemberNavIcon id={APARTMENT_NAV_ICONS[obj.id] ?? "home"} className="bb-apartment-object__svg" />
                </span>
                <span className="bb-apartment-object__label">{obj.title}</span>
                <span className="bb-apartment-object__hint">{obj.hint}</span>
              </Link>
            ))}
          </div>

          <p className="bb-apartment__utility">
            Need eats, gems, or solo ideas?{" "}
            <Link href={BLOOM_PLACES.places.href} className="mp-link">
              {BLOOM_PLACES.places.label}
            </Link>{" "}
            is in your nav — tap City anytime.
          </p>
        </div>
      </SpaceMood>
    </MemberShell>
  );
}
