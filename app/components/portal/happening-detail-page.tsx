"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import {
  gatheringToPoster,
  gatheringPriceLabel,
  type DbGathering,
} from "@/lib/happenings/gathering-to-poster";

export function HappeningDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [gathering, setGathering] = useState<DbGathering | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [rsvped, setRsvped] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/member/gatherings/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const json = await res.json();
        setGathering(json.gathering ?? null);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FDFAF5" }}>
        <p className="text-sm" style={{ color: "#888" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (!gathering) {
    return (
      <div className="min-h-screen px-5 pt-16" style={{ background: "#FDFAF5" }}>
        <p className="font-bold text-lg mb-2" style={{ color: "#111" }}>
          Happening not found
        </p>
        <Link href="/member/happenings" style={{ color: "#FF1F7D" }}>
          ← Back to Happenings
        </Link>
      </div>
    );
  }

  const poster = gatheringToPoster(gathering);
  const price = gatheringPriceLabel(gathering);

  async function reserveSeat() {
    setRsvpBusy(true);
    const res = await fetch("/api/irl/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gatheringId: gathering!.id }),
    });
    setRsvpBusy(false);
    if (res.ok) setRsvped(true);
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold mb-6"
          style={{ color: "#FF1F7D" }}
        >
          ← Happenings
        </button>

        <div className="mb-6">
          <PosterRenderer data={{ ...poster, ctaLabel: undefined, href: undefined }} />
        </div>

        <div className="rounded-3xl p-5 bg-white mb-4" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: poster.accentColor }}>
            {poster.category}
          </p>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
            {gathering.title}
          </h1>
          <p className="text-sm mb-1" style={{ color: "#666" }}>
            {poster.location}
          </p>
          <p className="text-sm font-semibold" style={{ color: "#111" }}>
            {poster.date} · {poster.time}
          </p>
          <p className="text-sm mt-3 font-bold" style={{ color: poster.accentColor }}>
            {price} · {(gathering.spots_left ?? gathering.capacity) ?? 0} seats left
          </p>
          {gathering.description ? (
            <p className="text-sm mt-4 leading-relaxed" style={{ color: "#666" }}>
              {gathering.description}
            </p>
          ) : null}
        </div>

        {rsvped ? (
          <div className="w-full py-4 rounded-2xl text-center font-bold" style={{ background: "#FFF9E6", color: "#b45309" }}>
            You&apos;re in ✓
          </div>
        ) : (
          <button
            type="button"
            disabled={rsvpBusy}
            onClick={() => void reserveSeat()}
            className="w-full py-4 rounded-2xl font-bold text-white disabled:opacity-50"
            style={{ background: poster.accentColor ?? "#FF1F7D" }}
          >
            {rsvpBusy ? "Saving…" : "I'm in →"}
          </button>
        )}
      </div>
    </div>
  );
}
