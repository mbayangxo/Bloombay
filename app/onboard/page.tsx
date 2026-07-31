import type { Metadata } from "next";
import { Suspense } from "react";
import { OnboardFlow } from "../components/portal/onboard-flow";

export const metadata: Metadata = {
  title: "Join BloomBay",
  description: "Create your BloomBay account — a social world for women in New York City.",
};

export default function Onboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <OnboardFlow />
    </Suspense>
  );
}
