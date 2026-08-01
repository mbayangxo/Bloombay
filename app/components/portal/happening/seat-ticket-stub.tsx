"use client";

const DARK = "#1C1B1C";

/** Real seat/table stub — seat_number/table_number come from the reservation
 *  trigger (migration 105), not invented per-render. */
export function SeatTicketStub({
  seatNumber,
  tableNumber,
  tableSize,
  accent = "#FF1F7D",
}: {
  seatNumber: number | null;
  tableNumber: number | null;
  tableSize: number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
      <div className="px-4 py-2" style={{ background: accent }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-white">YOUR SEAT</p>
      </div>
      <div className="flex bg-white px-4 py-4" style={{ borderTop: `2px dashed ${accent}55` }}>
        <div className="flex-1">
          <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>SEAT</p>
          <p className="text-3xl font-bold" style={{ color: DARK, fontFamily: "var(--font-playfair)" }}>
            {seatNumber ?? "—"}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>TABLE</p>
          <p className="text-sm font-bold" style={{ color: accent }}>{tableNumber ?? "—"}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#999" }}>Table of {tableSize} women</p>
        </div>
      </div>
      <div className="px-4 pb-3 bg-white">
        <p className="text-xs" style={{ color: "#999" }}>You&apos;re in good company. ✿</p>
      </div>
    </div>
  );
}
