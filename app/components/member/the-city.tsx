"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { CityMomentCard, cityMomentTileSize } from "@/app/components/member/city-moment-card";
import { CityMomentUpload } from "@/app/components/member/city-moment-upload";
import { CityPlacePinForm } from "@/app/components/member/city-place-pin-form";
import { CityObjectPin } from "@/app/components/member/city-object-pin";
import { CityAliveStrip } from "@/app/components/member/city-alive-strip";
import { DiscoveryFeed } from "@/app/components/member/discovery-feed";
import { listAllCityMoments } from "@/lib/city-moments-store";
import {
  CITY_HERO,
  CITY_NAV,
  CITY_PICKS,
  CITY_SECTIONS,
  cityCardsForSection,
  type CitySectionId,
} from "@/lib/the-city-data";

const SECTION_ICONS: Record<CitySectionId, string> = {
  eat: BLOOM_OBJECTS.ticket,
  go: BLOOM_OBJECTS.pin,
  solo: BLOOM_OBJECTS.door,
  moments: BLOOM_OBJECTS.postcard,
  trending: BLOOM_OBJECTS.crest,
};

const GUIDE_SECTIONS = CITY_SECTIONS.filter((s) => s.id !== "moments");

function scrollToCitySection(hash: string) {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function TheCity() {
  const [moments, setMoments] = useState(() => listAllCityMoments());
  const [activeNav, setActiveNav] = useState<string>("moments");

  const refreshMoments = useCallback(() => {
    setMoments(listAllCityMoments());
  }, []);

  useEffect(() => {
    refreshMoments();
    window.addEventListener("bb-city-moments-updated", refreshMoments);
    return () => window.removeEventListener("bb-city-moments-updated", refreshMoments);
  }, [refreshMoments]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      scrollToCitySection(window.location.hash);
      setActiveNav(window.location.hash.replace("#", ""));
    }
  }, []);

  function onNavClick(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    e.preventDefault();
    const id = hash.replace("#", "");
    setActiveNav(id);
    window.history.replaceState(null, "", `/member/explore${hash}`);
    scrollToCitySection(hash);
  }

  return (
    <div className="bb-city bb-city--objects bb-explore-page bb-physical-surface">
      <header className="bb-city__hero bb-city__hero--compact">
        <h1 className="bb-city__title bb-display-lg">The city</h1>
        <p className="bb-city__whisper bb-accent-md">Places, moments, and what to do today.</p>
      </header>

      <CityAliveStrip />

      <nav className="bb-city-nav bb-city-nav--whisper" aria-label="Sections in the city">
        {CITY_NAV.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`bb-city-nav__link${activeNav === item.id ? " bb-city-nav__link--active" : ""}${item.id === "moments" ? " bb-city-nav__link--moments" : ""}`}
            onClick={(e) => onNavClick(e, item.href)}
          >
            {item.id === "moments" ? (
              <BloomObjectIcon src={BLOOM_OBJECTS.postcard} size={18} animate={false} />
            ) : null}
            {item.label}
          </a>
        ))}
      </nav>

      <section id="moments" className="bb-city-section bb-city-section--moments">
        <div className="bb-city-section__head">
          <BloomObjectIcon
            src={BLOOM_OBJECTS.postcard}
            size={44}
            animate={false}
            className="bb-city-section__object"
          />
          <div>
            <h2 className="bb-city-section__title bb-display-md">Moments</h2>
            <p className="bb-city-section__sub bb-accent-sm">
              Every photo is anchored — café, place in the city, or a feeling you name.
            </p>
          </div>
        </div>
        <CityMomentUpload onPosted={refreshMoments} />
        <ul className="bb-city-moments bb-city-moments--photogrid" aria-label="Moments photogrid">
          {moments.map((m, i) => (
            <li
              key={m.id}
              className={`bb-city-moments__cell bb-city-moments__cell--${cityMomentTileSize(i)}`}
            >
              <CityMomentCard moment={m} size={cityMomentTileSize(i)} />
            </li>
          ))}
        </ul>
      </section>

      <section id="for-you" className="bb-city-section bb-city-section--discovery">
        <DiscoveryFeed />
      </section>

      <div className="bb-city__picks" role="list" aria-label="Today in the city">
        {CITY_PICKS.map((pick, i) => (
          <Link
            key={pick.id}
            href={pick.href}
            className={`bb-city-pick bb-city-pick--object bb-city-pick--${pick.accent ?? "barbie"}`}
            role="listitem"
            onClick={(e) => {
              if (pick.href.startsWith("#")) {
                onNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, pick.href);
              }
            }}
            style={{ transform: `rotate(${i % 2 === 0 ? -1.5 : 1.2}deg)` }}
          >
            <span className="bb-city-pick__line">{pick.line}</span>
            <span className="bb-city-pick__sub">{pick.sub}</span>
          </Link>
        ))}
      </div>

      {GUIDE_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="bb-city-section">
          <div className="bb-city-section__head">
            <BloomObjectIcon
              src={SECTION_ICONS[section.id]}
              size={40}
              animate={false}
              className="bb-city-section__object"
            />
            <div>
              <h2 className="bb-city-section__title bb-display-md">{section.title}</h2>
              <p className="bb-city-section__sub bb-accent-sm">{section.sub}</p>
            </div>
          </div>

          {section.id === "go" ? (
            <div className="bb-city-objects" role="list">
              {cityCardsForSection(section.id).map((card, i) => (
                <CityObjectPin
                  key={card.id}
                  card={card}
                  index={i}
                  objectSrc={SECTION_ICONS[section.id]}
                />
              ))}
            </div>
          ) : (
            <div className="bb-city-objects" role="list">
              {cityCardsForSection(section.id).map((card, i) => (
                <CityObjectPin
                  key={card.id}
                  card={card}
                  index={i}
                  objectSrc={SECTION_ICONS[section.id]}
                />
              ))}
            </div>
          )}
        </section>
      ))}

      <section id="pins" className="bb-city-section bb-city-section--pins">
        <div className="bb-city-section__head">
          <BloomObjectIcon src={BLOOM_OBJECTS.pin} size={40} animate={false} className="bb-city-section__object" />
          <div>
            <h2 className="bb-city-section__title bb-display-md">Place pins</h2>
            <p className="bb-city-section__sub bb-accent-sm">Mark spots on the map — tied to neighborhoods.</p>
          </div>
        </div>
        <CityPlacePinForm />
        <Link href="/member/maps#pins" className="bb-city-section__map-link mp-link">
          Open full map →
        </Link>
      </section>

      <footer className="bb-city__foot">
        <p className="bb-city__foot-note bb-accent-sm">
          The city answers <em>what should I do today</em>. Confetti and open seats live in{" "}
          <Link href="/member/happenings?tab=invitations#confetti">Happenings · Invitations</Link>.
        </p>
        <div className="bb-city__foot-links">
          <Link href="#moments">Moments</Link>
          <Link href="/member/happenings?tab=invitations">Invitations</Link>
          <Link href="/member/maps#pins">Map</Link>
        </div>
      </footer>
    </div>
  );
}
