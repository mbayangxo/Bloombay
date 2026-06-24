"use client";

import React from "react";
import Link from "next/link";
import {
  PINK,
} from "@/lib/city/tokens";

export function NeighborhoodMap() {
  const signs = [
    { href: "/member/city?area=les",         cls: "sign-s1", color: PINK,      side: "left",  ml: "5%",  label: "Lower East Side", sub: "UNDERGROUND SPOTS · LATE NIGHTS" },
    { href: "/member/city?area=williamsburg", cls: "sign-s2", color: "#D86487", side: "right", mr: "5%",  label: "Williamsburg",    sub: "ROOFTOPS · STUDIOS · EATS" },
    { href: "/member/city?area=crownheights", cls: "sign-s3", color: "#C0185F", side: "left",  ml: "8%",  label: "Crown Heights",   sub: "BRUNCHES · RHYTHM · CULTURE" },
    { href: "/member/city?area=harlem",       cls: "sign-s4", color: PINK,      side: "right", mr: "8%",  label: "Harlem",          sub: "CULTURE RUNS DEEP" },
    { href: "/member/city?area=soho",         cls: "sign-s5", color: "#E87BA8", side: "left",  ml: "5%",  label: "SoHo",            sub: "GALLERIES · DINNERS · FASHION" },
    { href: "/member/city?area=dumbo",        cls: "sign-s6", color: "#D86487", side: "right", mr: "5%",  label: "DUMBO",           sub: "WATERFRONT · BRIDGE VIEWS" },
    { href: "/member/city?area=bushwick",     cls: "sign-s7", color: "#C0185F", side: "left",  ml: "10%", label: "Bushwick",        sub: "ART · LATE NIGHTS · ENERGY" },
  ];
  return (
    <div style={{ padding: "0 0 32px", minHeight: "calc(100vh - 54px)", background: "linear-gradient(180deg, #D6E8F5 0%, #EAF2F9 35%, #F0EBE4 100%)" }}>
      <div style={{ padding: "20px 20px 8px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginBottom: 2 }}>New York City</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px, 8.5vw, 34px)", fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.01em" }}>Neighborhoods</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888", marginTop: 4 }}>tap one to explore</p>
      </div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 30px", minHeight: 500 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#8A8A8A", border: "3px solid #666", marginBottom: 0, zIndex: 2 }} />
        <div style={{ width: 8, height: "100%", position: "absolute", top: 14, background: "linear-gradient(90deg, #AAA 0%, #CCC 40%, #BBB 60%, #999 100%)", borderRadius: 4, zIndex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12, width: "100%", alignItems: "center", zIndex: 2 }}>
          {signs.map((s, i) => {
            const isLeft = s.side === "left";
            return (
              <Link key={i} href={s.href} style={{ textDecoration: "none", alignSelf: isLeft ? "flex-start" : "flex-end", marginLeft: isLeft ? s.ml : undefined, marginRight: !isLeft ? s.mr : undefined }}>
                <div className={s.cls} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                  {isLeft && <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: `16px solid ${s.color}` }} />}
                  <div style={{ background: s.color, padding: isLeft ? "10px 18px 10px 10px" : "10px 10px 10px 18px", borderRadius: isLeft ? "0 8px 8px 0" : "8px 0 0 8px" }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>{s.label}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{s.sub}</p>
                  </div>
                  {!isLeft && <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `16px solid ${s.color}` }} />}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "16px 18px", border: "1px solid rgba(255,31,125,0.15)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 6 }}>FULL CITY GUIDE</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 12 }}>
            Restaurants, bars, rooftops — curated by Bloomies for Bloomies.
          </p>
          <button style={{ display: "inline-flex", background: PINK, color: "white", borderRadius: 999, padding: "9px 20px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", boxShadow: `0 4px 14px ${PINK}55`, border: "none", cursor: "pointer" }}>
            ALL OF NYC →
          </button>
        </div>
      </div>
    </div>
  );
}
