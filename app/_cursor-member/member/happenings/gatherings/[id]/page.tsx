"use client";

import { use } from "react";
import { LiveGatheringDetail } from "../../live-gathering-detail";

export default function GatheringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <LiveGatheringDetail id={id} />;
}
