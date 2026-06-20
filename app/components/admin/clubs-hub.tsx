import { ClubsCenter } from "./portal/clubs-center";

import type { StaffBase } from "@/lib/mc-paths";

export function ClubsHub({ staffBase = "/admin" }: { staffBase?: StaffBase }) {
  return <ClubsCenter staffBase={staffBase} />;
}
