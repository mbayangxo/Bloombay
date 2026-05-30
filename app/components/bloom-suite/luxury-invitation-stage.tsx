"use client";

import { BBPetalMark } from "./brand-mark";
import { LuxuryPetals, WaxSealButton } from "./decor";

export function LuxuryInvitationStage({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="invite-stage">
      <div className="invite-stage__gradient" aria-hidden />
      <div className="invite-stage__vignette" aria-hidden />
      <div className="invite-stage__glow invite-stage__glow--left" aria-hidden />
      <div className="invite-stage__glow invite-stage__glow--center" aria-hidden />
      <div className="invite-stage__glow invite-stage__glow--right" aria-hidden />

      <LuxuryPetals />

      <div className="invite-stage__hero-wrap">
        <div className="invite-hero__ribbon" aria-hidden>
          <span className="invite-hero__ribbon-sheen" aria-hidden />
        </div>

        <article className="invite-hero" aria-label="BloomBay invitation envelope">
          <div className="invite-hero__interior" aria-hidden>
            <div className="invite-hero__peek invite-hero__peek--photo" />
            <div className="invite-hero__peek invite-hero__peek--book" />
            <div className="invite-hero__peek invite-hero__peek--dinner" />
            <div className="invite-hero__card-peek">
              <div className="invite-hero__card-peek-mark">
                <BBPetalMark size={32} />
              </div>
              <p className="invite-hero__card-brand">
                BLOOM<span className="invite-hero__card-bay">BAY</span>
              </p>
              <p className="invite-hero__card-tagline font-script">Where you bloom.</p>
              <p className="invite-hero__card-heart" aria-hidden>
                ♥
              </p>
            </div>
          </div>

          <div className="invite-hero__flap">
            <div className="invite-hero__flap-inner" />
            <div className="invite-hero__flap-fold" aria-hidden />
          </div>

          <div className="invite-hero__liner" aria-hidden />

          <div className="invite-hero__copy">
            <p className="invite-hero__script font-script">You&apos;re invited to</p>
            <h1 className="invite-hero__title font-display">BloomBay</h1>
          </div>

          <button
            type="button"
            className="invite-hero__seal"
            onClick={onOpen}
            aria-label="Open the invitation"
          >
            <WaxSealButton className="invite-hero__wax" />
          </button>

          <button type="button" className="invite-hero__cta" onClick={onOpen}>
            Open Invitation&ensp;→
          </button>
        </article>
      </div>

      <footer className="invite-stage__footer">
        <span className="invite-stage__footer-tagline">
          ♡ ONE CITY. &nbsp;|&nbsp; WOMEN FIRST. &nbsp;|&nbsp; REAL CONNECTIONS.
        </span>
        <span className="invite-stage__footer-socials">
          <a href="https://instagram.com/welovebloombay" target="_blank" rel="noopener noreferrer">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @welovebloombay
          </a>
          <span aria-hidden>|</span>
          <a href="https://tiktok.com/@welovebloombay" target="_blank" rel="noopener noreferrer">
            <svg width="9" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.21 8.21 0 004.8 1.54V6.78a4.85 4.85 0 01-1.03-.09z" />
            </svg>
            @welovebloombay
          </a>
        </span>
      </footer>
    </div>
  );
}
