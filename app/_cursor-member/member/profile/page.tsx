"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileTemplateHeader } from "@/app/components/member/profile-template-header";
import { MemberShell } from "../components/member-shell";
import { CLUB_INTERESTS } from "@/lib/member-portal-data";
import { MemberCrestCollection } from "../components/member-crest-collection";
import { DEMO_BLOOM_HISTORY, TRUST_BADGES } from "@/lib/member-bloom-history";
import { IrlFunnelDev } from "../components/irl-funnel-dev";

export default function ProfilePage() {
  const [name, setName] = useState("Member");
  const [location, setLocation] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/member/profile");
        if (res.ok) {
          const json = (await res.json()) as {
            fullName?: string | null;
            city?: string | null;
            state?: string | null;
            neighborhood?: string | null;
          };
          if (json.fullName) setName(json.fullName);
          const place = [json.neighborhood, json.city, json.state].filter(Boolean).join(", ");
          if (place) setLocation(place);
          return;
        }
      } catch {
        /* fall through */
      }
      const stored = sessionStorage.getItem("gf_name");
      if (stored) setName(stored);
    })();
  }, []);

  return (
    <MemberShell flush fullWidth>
      <div className="bb-physical-surface">
        <ProfileTemplateHeader name={name} location={location} />

        <div className="bb-profile-desk">
          <div className="bb-desk-scrap" style={{ "--bb-tilt": "-0.8deg" } as React.CSSProperties}>
            <p className="bb-desk-scrap__label">Trust</p>
            <p className="bb-desk-scrap__line">
              {TRUST_BADGES.slice(0, 3)
                .map((b) => b.label)
                .join(" · ")}
            </p>
          </div>

          <div className="bb-desk-scrap" style={{ "--bb-tilt": "0.5deg" } as React.CSSProperties}>
            <p className="bb-desk-scrap__label">Bloom history</p>
            <p className="bb-desk-scrap__line">
              Tickets, seats, stamps, polaroids — your real-world story.{" "}
              <Link href="/member/vault">Open My BloomBay →</Link>
            </p>
            <div className="bb-desk-polaroid-row">
              {DEMO_BLOOM_HISTORY.slice(0, 3).map((h, i) => (
                <Link
                  key={h.id}
                  href="/member/vault"
                  className="bb-desk-polaroid"
                  style={{ "--bb-tilt": `${(i - 1) * 2}deg` } as React.CSSProperties}
                >
                  <p className="bb-desk-polaroid__cap">
                    {h.title}
                    <br />
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-ui)" }}>
                      {h.kind} · {h.when}
                    </span>
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bb-desk-scrap" style={{ "--bb-tilt": "-0.3deg" } as React.CSSProperties}>
            <p className="bb-desk-scrap__label">Club crests</p>
            <MemberCrestCollection />
          </div>

          <div className="bb-desk-scrap" style={{ "--bb-tilt": "0.7deg" } as React.CSSProperties}>
            <p className="bb-desk-scrap__label">Interests</p>
            <p className="bb-desk-scrap__line">{CLUB_INTERESTS.join(" · ")}</p>
          </div>

          <div className="bb-desk-polaroid-row">
            <Link href="/member/bloomies" className="bb-desk-polaroid" style={{ "--bb-tilt": "-2deg" } as React.CSSProperties}>
              <p className="bb-desk-polaroid__cap">Bloomies — scan QR IRL</p>
            </Link>
            <Link href="/member/bouquet" className="bb-desk-polaroid" style={{ "--bb-tilt": "1.5deg" } as React.CSSProperties}>
              <p className="bb-desk-polaroid__cap">Bouquet — your 12 closest</p>
            </Link>
          </div>

          <IrlFunnelDev />

          <div className="bb-desk-scrap" style={{ "--bb-tilt": "-0.5deg" } as React.CSSProperties}>
            <p className="bb-desk-scrap__label">Around your dossier</p>
            <p className="bb-desk-scrap__line">
              <Link href="/member/profile/qr">QR codes</Link>
              {" · "}
              <Link href="/member/scan">Scan Bloomie</Link>
              {" · "}
              <Link href="/member/check-in">Check in</Link>
              {" · "}
              <Link href="/member/settings">Settings</Link>
              {" · "}
              <Link href="/member/clubs">Clubs</Link>
            </p>
          </div>
        </div>
      </div>
    </MemberShell>
  );
}
