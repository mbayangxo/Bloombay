"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BloomiesPlanner } from "@/app/components/portal/bloomies-planner";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

export default function BloomiesPlannerPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    void import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F8", paddingBottom: 100 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,240,248,0.96)", borderBottom: "1px solid rgba(255,31,125,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <Link href="/member/plans" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.4" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: DARK }}>Bloomies Planner</span>
        </div>
      </div>

      {userId ? (
        <BloomiesPlanner userId={userId} />
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
    </div>
  );
}
