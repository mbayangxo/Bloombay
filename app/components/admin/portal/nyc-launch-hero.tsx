"use client";

import { TickerNumber } from "./ticker-number";

export type LaunchHeroData = {
  percent: number;
  women: number;
  clubsForming: number;
  partnersApproved: number;
  waitingVerification: number;
  membersNeeded: number;
};

export function NycLaunchHero({ hero }: { hero: LaunchHeroData }) {
  return (
    <section id="nyc-launch" className="fp-nyc-hero">
      <div className="fp-nyc-hero__glow" aria-hidden />
      <span className="fp-nyc-hero__badge">Lead launch market · Campaign dashboard</span>
      <div className="fp-nyc-hero__main">
        <div className="fp-nyc-hero__copy">
          <h2 className="fp-nyc-hero__city">New York City</h2>
          <p className="fp-nyc-hero__tagline">
            BloomBay&apos;s first city — the network blooms here first
          </p>
        </div>
        <div className="fp-nyc-hero__ring" aria-label={`${hero.percent}% launch readiness`}>
          <svg viewBox="0 0 120 120" className="fp-nyc-hero__svg">
            <circle cx="60" cy="60" r="52" className="fp-nyc-hero__track" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="fp-nyc-hero__progress"
              style={{
                strokeDasharray: `${(hero.percent / 100) * 327} 327`,
              }}
            />
          </svg>
          <span className="fp-nyc-hero__pct">
            <TickerNumber value={hero.percent} className="fp-nyc-hero__pct-num" />
            <em>%</em>
          </span>
        </div>
      </div>

      <div className="fp-nyc-hero__stats">
        <div className="fp-nyc-hero__stat">
          <TickerNumber value={hero.women} live className="fp-nyc-hero__stat-num" />
          <span>women in NYC</span>
        </div>
        <div className="fp-nyc-hero__stat">
          <TickerNumber value={hero.membersNeeded} className="fp-nyc-hero__stat-num" />
          <span>women needed to launch</span>
        </div>
        <div className="fp-nyc-hero__stat">
          <TickerNumber value={hero.clubsForming} className="fp-nyc-hero__stat-num" />
          <span>clubs forming</span>
        </div>
        <div className="fp-nyc-hero__stat">
          <TickerNumber value={hero.partnersApproved} className="fp-nyc-hero__stat-num" />
          <span>partners approved</span>
        </div>
      </div>

      <div className="fp-overview-bar fp-overview-bar--launch fp-nyc-hero__bar">
        <div className="fp-overview-bar__fill" style={{ width: `${hero.percent}%` }} />
      </div>
    </section>
  );
}
