"use client";

import Link from "next/link";
import { BloomBayBrand } from "./bloombay-logo";
import { MemberHeaderIcons } from "@/app/components/member/member-header-icons";

/** Slim bar when page hides the main shell header — Mail, Plans, and Ping stay top-right. */
export function MemberTopBar() {
  return (
    <div className="mp-top-bar">
      <BloomBayBrand height={22} href="/member/home" showText className="mp-top-bar__brand" />
      <div className="mp-top-bar__actions">
        <MemberHeaderIcons className="bb-header-icons" />
        <Link href="/member/settings" className="mp-top-bar__settings" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
