"use client";
import { use } from "react";
import { ZoneInteriorPage } from "@/app/components/portal/zone-interior";

export default function ZonePage({ params }: { params: Promise<{ id: string; zoneId: string }> }) {
  const { id, zoneId } = use(params);
  return <ZoneInteriorPage clubId={id} zoneId={zoneId} />;
}
