"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { CityPlacePinForm } from "@/app/components/member/city-place-pin-form";
import { useArtifactMotion } from "@/lib/use-artifact-motion";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import { listCityPlacePins, type CityPlacePin } from "@/lib/city-place-pins-store";
import { MemberShell } from "../components/member-shell";
import { HappeningsChrome } from "../components/happenings-chrome";

const MAP_LAYERS = [
  { label: "Tonight", href: "/member/tonight", desc: "What's on right now" },
  { label: "Eats", href: "/member/eats", desc: "Girl favorites & photos" },
  { label: "The City", href: "/member/explore", desc: "Moments & place pins" },
  { label: "Solo", href: "/member/happenings?tab=solo", desc: "Things to do alone" },
];

function MapsContent() {
  const markerMotion = useArtifactMotion();
  const [pins, setPins] = useState<CityPlacePin[]>([]);

  const refresh = useCallback(() => {
    setPins(listCityPlacePins());
  }, []);

  useEffect(() => {
    markerMotion.trigger("marker-drop");
    refresh();
    window.addEventListener("bb-city-pins-updated", refresh);
    return () => window.removeEventListener("bb-city-pins-updated", refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- motion once on mount
  }, [refresh]);

  return (
    <MemberShell compactHeader>
      <HappeningsChrome>
        <div className="mp-happenings-sub">
          <h2 className="mp-happenings-sub__title">Maps & Eats</h2>
          <p className="mp-happenings-sub__sub">Girl pins on the map — real places women trust.</p>
        </div>
        <section className="mp-page-body bb-maps-page" style={{ paddingTop: 0 }}>
          <div id="pins" className="bb-maps-board">
            <p className="bb-maps-board__label">Live map · NYC & Hoboken</p>
            <div className="bb-maps-board__canvas">
              <BloomObjectIcon
                src={BLOOM_OBJECTS.pin}
                size={36}
                animate={false}
                className={`bb-maps-board__hero-pin ${markerMotion.className}`}
              />
              {pins.length === 0 ? (
                <div className="bb-maps-board__empty-overlay">
                  <BbEmptyState
                    {...bloomEmptyProps("maps", {
                      label: "Pin a place",
                      href: "/member/explore#pins",
                    })}
                  />
                </div>
              ) : (
                pins.slice(0, 12).map((pin, i) => (
                  <span
                    key={pin.id}
                    className="bb-maps-board__pin"
                    style={{
                      left: `${12 + (i * 17) % 72}%`,
                      top: `${18 + (i * 23) % 58}%`,
                    }}
                    title={`${pin.placeName} · ${pin.neighborhood}`}
                  >
                    <span className="bb-maps-board__pin-emoji">{pin.emoji}</span>
                    <span className="bb-maps-board__pin-name">{pin.neighborhood}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <CityPlacePinForm onPinned={refresh} />

          <ul className="bb-maps-pin-list">
            {pins.length === 0 ? (
              <li>
                <BbEmptyState
                  {...bloomEmptyProps("maps", {
                    label: "Open The City",
                    href: "/member/explore#pins",
                  })}
                />
              </li>
            ) : null}
            {pins.map((pin) => (
              <li key={pin.id} className="bb-maps-pin-card">
                <span className="bb-maps-pin-card__emoji">{pin.emoji}</span>
                <div>
                  <strong>{pin.placeName}</strong>
                  <p>{pin.neighborhood} · {pin.note}</p>
                  <span className="bb-maps-pin-card__meta">
                    {pin.author} · {new Date(pin.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {MAP_LAYERS.map((layer) => (
            <Link key={layer.href} href={layer.href} className="mp-ed-card bb-maps-layer-card">
              <p className="mp-list-row__title">{layer.label}</p>
              <p className="mp-list-row__meta">{layer.desc}</p>
            </Link>
          ))}
        </section>
      </HappeningsChrome>
    </MemberShell>
  );
}

export default function MapsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <MapsContent />
    </Suspense>
  );
}
