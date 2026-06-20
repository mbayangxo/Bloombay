"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DbGathering } from "@/lib/happenings/gathering-to-poster";
import { HappeningPlanRoom } from "./happening-plan-room";

export function HappeningPlanRoomLoader({ gatheringId }: { gatheringId: string }) {
  const [gathering, setGathering] = useState<DbGathering | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/member/gatherings/${encodeURIComponent(gatheringId)}`);
      if (res.ok) {
        const json = await res.json();
        setGathering(json.gathering ?? null);
      }
      setLoading(false);
    })();
  }, [gatheringId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FDFAF5" }}>
        <p className="text-sm" style={{ color: "#888" }}>
          Loading plan room…
        </p>
      </div>
    );
  }

  if (!gathering) {
    return (
      <div className="min-h-screen px-5 pt-16" style={{ background: "#FDFAF5" }}>
        <p className="font-bold mb-2" style={{ color: "#111" }}>
          Plan not found
        </p>
        <Link href="/member/plans" style={{ color: "#FF1F7D" }}>
          ← Plans
        </Link>
      </div>
    );
  }

  return <HappeningPlanRoom gathering={gathering} />;
}
