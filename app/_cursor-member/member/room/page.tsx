"use client";

import { Suspense } from "react";
import { MemberShell } from "../components/member-shell";
import { RoomBuilding } from "@/app/components/member/room-building";

export default function RoomPage() {
  return (
    <MemberShell hideHeader fullWidth flush>
      <Suspense fallback={<div style={{ padding: "2rem" }}>Loading the lobby…</div>}>
        <RoomBuilding />
      </Suspense>
    </MemberShell>
  );
}
