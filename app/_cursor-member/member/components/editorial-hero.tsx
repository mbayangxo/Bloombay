"use client";

import Image from "next/image";
import { BloomBayBrand } from "./bloombay-logo";
import { MEMBER_UI_REFS } from "@/lib/member-ui-assets";
import { MemberHeaderIcons } from "@/app/components/member/member-header-icons";

export function EditorialHomeHero() {
  return (
    <section className="mp-ed-hero">
      <div
        className="mp-ed-hero__bg"
        style={{ backgroundImage: `url(${MEMBER_UI_REFS.homeHero})` }}
        aria-hidden
      />
      <div className="mp-ed-hero__inner">
        <div className="mp-ed-hero__brand">
          <BloomBayBrand height={28} href="/member/home" showText />
          <MemberHeaderIcons />
        </div>
        <h1 className="mp-ed-hero__title">Where her world comes to life</h1>
        <p className="mp-ed-hero__script">You belong here ♡</p>
        <div className="mp-torn-note">
          Real connections. Beautiful places. Unforgettable moments.
          <Image
            src="/logosbloombay/Vector-1.svg"
            alt=""
            width={20}
            height={20}
            style={{ display: "block", marginTop: "0.5rem", opacity: 0.9 }}
          />
        </div>
      </div>
    </section>
  );
}
