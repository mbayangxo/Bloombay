"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listAllCityMoments } from "@/lib/city-moments-store";
import { listPartnerBrands } from "@/lib/partner-brand/store";
import { partnerMemberHref } from "@/lib/partner-brand/paths";
import { GATHERINGS } from "@/lib/member-portal-data";

export function CityAliveStrip() {
  const [moments, setMoments] = useState(() => listAllCityMoments());

  useEffect(() => {
    function refresh() {
      setMoments(listAllCityMoments());
    }
    refresh();
    window.addEventListener("bb-city-moments-updated", refresh);
    return () => window.removeEventListener("bb-city-moments-updated", refresh);
  }, []);

  const goingCount = useMemo(() => {
    const fromGatherings = GATHERINGS.reduce((n, g) => n + (g.attendees?.length ?? 2), 0);
    return Math.max(4, fromGatherings + moments.length);
  }, [moments.length]);

  const recs = useMemo(() => {
    const partners = listPartnerBrands(true).slice(0, 3);
    const momentRecs = moments.slice(0, 2).map((m) => ({
      id: m.id,
      place: m.place,
      who: m.author,
      quote: m.caption,
      photo: m.imageUrl ?? "/bloom-assets/refs/tonight.jpg",
      href: m.href,
    }));
    const partnerRecs = partners.map((p) => ({
      id: p.id,
      place: p.name,
      who: "Girl favorite",
      quote: p.heroCaption ?? p.tagline,
      photo: p.heroImageUrl ?? "/bloom-assets/refs/lounge.jpg",
      href: partnerMemberHref(p.slug),
    }));
    return [...momentRecs, ...partnerRecs].slice(0, 5);
  }, [moments]);

  return (
    <section className="bb-city-alive" aria-label="City pulse">
      <div className="bb-city-alive__pulse">
        <span className="bb-city-alive__wave" aria-hidden />
        <div>
          <p className="bb-city-alive__line">{goingCount} women out in the city right now</p>
          <p className="bb-city-alive__sub">Real places · real photos · women recommending</p>
        </div>
      </div>
      <div className="bb-city-recs">
        {recs.map((rec, i) => (
          <Link
            key={rec.id}
            href={rec.href}
            className="bb-city-rec"
            style={{ "--bb-tilt": `${i % 2 === 0 ? -0.4 : 0.5}deg` } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rec.photo} alt="" className="bb-city-rec__photo" />
            <div className="bb-city-rec__body">
              <p className="bb-city-rec__place">{rec.place}</p>
              <p className="bb-city-rec__who">{rec.who} recommends</p>
              <p className="bb-city-rec__quote">&ldquo;{rec.quote}&rdquo;</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
