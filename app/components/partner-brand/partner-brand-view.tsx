"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dropSummary } from "@/lib/partner-drops/store";
import { addToGirlCalendar, isOnCalendar } from "@/lib/member-calendar-store";
import type { BoomDrop } from "@/lib/partner-drops/types";
import type { PartnerBrandProfile } from "@/lib/partner-brand/types";
import { templateLabel } from "@/lib/partner-brand/templates";

type Panel = "about" | "menu" | "drops";

export function PartnerBrandView({
  brand,
  drops = [],
  backHref = "/member/eats",
}: {
  brand: PartnerBrandProfile;
  drops?: BoomDrop[];
  backHref?: string;
}) {
  const [panel, setPanel] = useState<Panel>(drops.length ? "drops" : "about");
  const [slideIdx, setSlideIdx] = useState(0);
  const [seatSaved, setSeatSaved] = useState(false);
  const [seatBusy, setSeatBusy] = useState(false);
  const slides = brand.aboutSlides;
  const slide = slides[slideIdx];
  const seatSourceId = `partner-seat-${brand.slug}`;

  useEffect(() => {
    setSeatSaved(isOnCalendar(seatSourceId));
  }, [seatSourceId]);

  async function saveSeat() {
    if (seatSaved || seatBusy) return;
    setSeatBusy(true);
    try {
      await addToGirlCalendar({
        sourceId: seatSourceId,
        title: brand.name,
        when: "Open seat",
        place: brand.neighborhood,
        href: "/member/happenings/seats",
        kind: "partner",
        remind: true,
      });
      setSeatSaved(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not save seat");
    } finally {
      setSeatBusy(false);
    }
  }

  const style = {
    "--pb-accent": brand.colors.accent,
    "--pb-accent-soft": brand.colors.accentSoft,
    "--pb-bg": brand.colors.background,
    "--pb-text": brand.colors.text,
  } as React.CSSProperties;

  return (
    <div className="pb-view" style={style}>
      <header className="pb-view__hero">
        {brand.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.heroImageUrl} alt="" className="pb-view__hero-img" />
        ) : (
          <div className="pb-view__hero-fallback" aria-hidden />
        )}
        <div className="pb-view__hero-overlay">
          <Link href={backHref} className="pb-view__back">
            ← Back
          </Link>
          {brand.logoImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoImageUrl} alt="" className="pb-view__logo" />
          ) : null}
          <span className="pb-view__type">{templateLabel(brand.templateId)} · {brand.neighborhood}</span>
          <h1>{brand.name}</h1>
          <p>{brand.tagline}</p>
          {brand.heroCaption ? <p className="pb-view__hero-caption">{brand.heroCaption}</p> : null}
          <button
            type="button"
            className="pb-view__seat-btn mp-btn mp-btn--hot"
            disabled={seatSaved || seatBusy}
            onClick={saveSeat}
          >
            {seatSaved ? "Seat saved ✓" : seatBusy ? "Saving…" : "Save me a seat"}
          </button>
        </div>
      </header>

      <nav className="pb-view__tabs" aria-label="Partner page">
        {drops.length ? (
          <button
            type="button"
            className={panel === "drops" ? "pb-view__tab pb-view__tab--on" : "pb-view__tab"}
            onClick={() => setPanel("drops")}
          >
            Boom drops
          </button>
        ) : null}
        <button
          type="button"
          className={panel === "about" ? "pb-view__tab pb-view__tab--on" : "pb-view__tab"}
          onClick={() => setPanel("about")}
        >
          About us
        </button>
        <button
          type="button"
          className={panel === "menu" ? "pb-view__tab pb-view__tab--on" : "pb-view__tab"}
          onClick={() => setPanel("menu")}
        >
          Menu
        </button>
      </nav>

      <div className="pb-view__body">
        {panel === "drops" && drops.length ? (
          <ul className="pb-view__drops">
            {drops.map((d) => (
              <li key={d.id} className="pb-view__drop-card">
                <span className="pb-view__drop-badge">Boom drop</span>
                <strong>{d.title}</strong>
                <p className="pb-view__drop-deal">{dropSummary(d)}</p>
                <p>{d.caption}</p>
                {d.validUntil ? (
                  <span className="pb-view__drop-until">Through {d.validUntil}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {panel === "about" && slides.length ? (
          <section className="pb-view__slideshow">
            {slide?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.imageUrl} alt="" className="pb-view__slide-img" />
            ) : brand.heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.heroImageUrl} alt="" className="pb-view__slide-img" />
            ) : (
              <div className="pb-view__slide-fallback" aria-hidden />
            )}
            <div className="pb-view__slide-copy">
              <h2>{slide?.headline}</h2>
              {slide?.caption ? <p className="pb-view__slide-caption">{slide.caption}</p> : null}
              <p>{slide?.body}</p>
            </div>
            {slides.length > 1 ? (
              <div className="pb-view__slide-nav">
                <button
                  type="button"
                  className="pb-view__slide-btn"
                  disabled={slideIdx === 0}
                  onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
                >
                  ←
                </button>
                <span className="pb-view__slide-dots">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      className={i === slideIdx ? "pb-view__dot pb-view__dot--on" : "pb-view__dot"}
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => setSlideIdx(i)}
                    />
                  ))}
                </span>
                <button
                  type="button"
                  className="pb-view__slide-btn"
                  disabled={slideIdx >= slides.length - 1}
                  onClick={() => setSlideIdx((i) => Math.min(slides.length - 1, i + 1))}
                >
                  →
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        {panel === "about" && !slides.length ? (
          <p className="pb-view__empty">This partner is still writing their story.</p>
        ) : null}

        {panel === "menu" ? (
          <div className="pb-view__menu">
            {brand.menuSections.map((sec) => (
              <section key={sec.id} className="pb-view__menu-section">
                <h2>{sec.title}</h2>
                <ul>
                  {sec.items.map((item) => (
                    <li key={item.id} className="pb-view__menu-item">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt="" className="pb-view__menu-thumb" />
                      ) : null}
                      <div>
                        <div className="pb-view__menu-row">
                          <strong>{item.name}</strong>
                          {item.price ? <span>{item.price}</span> : null}
                        </div>
                        <p>{item.description}</p>
                        {item.caption ? <p className="pb-view__item-caption">{item.caption}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {!brand.menuSections.length ? (
              <p className="pb-view__empty">Menu coming soon.</p>
            ) : null}
          </div>
        ) : null}

        {brand.address ? (
          <p className="pb-view__address">{brand.address}</p>
        ) : null}
      </div>
    </div>
  );
}
