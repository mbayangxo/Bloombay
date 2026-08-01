"use client";

import { gatheringPricing, formatCents, type DbGathering } from "@/lib/happenings/gathering-to-poster";

const PINK = "#FF1F7D";

/** Real, itemized price breakdown — every line comes from the gathering's
 *  own fee columns. No generic "what's included" copy invented per event. */
export function InvestmentBreakdown({ gathering, accent = PINK }: { gathering: DbGathering; accent?: string }) {
  const p = gatheringPricing(gathering);
  if (p.totalCents === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#bbb" }}>
        INVESTMENT
      </p>
      <div className="flex flex-col gap-1.5 text-sm">
        {p.seatFeeCents > 0 && (
          <div className="flex justify-between"><span style={{ color: "#666" }}>Seat fee</span><span style={{ color: "#111" }}>{formatCents(p.seatFeeCents)}</span></div>
        )}
        {p.experienceFeeCents > 0 && (
          <div className="flex justify-between"><span style={{ color: "#666" }}>BloomBay experience fee</span><span style={{ color: "#111" }}>{formatCents(p.experienceFeeCents)}</span></div>
        )}
        {p.venueFeeCents > 0 && (
          <div className="flex justify-between"><span style={{ color: "#666" }}>Venue &amp; service</span><span style={{ color: "#111" }}>{formatCents(p.venueFeeCents)}</span></div>
        )}
      </div>
      <div className="flex justify-between mt-2 pt-2 font-bold" style={{ borderTop: "1px solid #eee" }}>
        <span style={{ color: "#111" }}>Total</span>
        <span style={{ color: accent }}>{formatCents(p.totalCents)}</span>
      </div>
      {p.hasDeposit && (
        <div className="mt-3 rounded-xl p-3 text-xs" style={{ background: `${accent}0C`, color: "#333" }}>
          A {formatCents(p.depositCents)} deposit secures your seat. The remaining {formatCents(p.remainderCents)} is due before the event.
        </div>
      )}
    </div>
  );
}
