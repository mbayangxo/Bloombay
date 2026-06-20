export type GatheringRow = {
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  area: string | null;
  capacity: number;
  spots_left: number;
  club_slug: string | null;
};

export type ReserveSeatResult =
  | { ok: true; gathering: GatheringRow; alreadyReserved?: boolean }
  | { ok: false; error: string };
