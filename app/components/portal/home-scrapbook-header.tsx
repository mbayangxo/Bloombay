"use client";

import Link from "next/link";
import { BBLogo } from "./bb-logo";

/** Mockup-style header — solid bar so scrapbook layers never show through. */
export function HomeScrapbookHeader() {
  return (
    <header className="bb-home-header">
      <Link href="/member/home" className="bb-home-header__mark" aria-label="BloomBay home">
        <span className="bb-home-header__bb">BB*</span>
      </Link>

      <Link href="/member/home" className="bb-home-header__brand">
        Bloom<span className="bb-home-header__star">Bay*</span>
      </Link>

      <Link href="/member/pin-drops" className="bb-home-header__bell" aria-label="Pin drops">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="bb-home-header__badge">3</span>
      </Link>
    </header>
  );
}
