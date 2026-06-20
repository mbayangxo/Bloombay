export type BoomDropKind = "percent_off" | "bogo" | "bundle";

export type BoomDrop = {
  id: string;
  partnerSlug: string;
  title: string;
  /** Editable social / member-facing caption */
  caption: string;
  kind: BoomDropKind;
  buyItem: string;
  getItem?: string;
  percentOff?: number;
  validUntil?: string;
  active: boolean;
  createdAt: string;
};
