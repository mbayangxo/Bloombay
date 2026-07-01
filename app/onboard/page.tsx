import { Suspense } from "react";
import { OnboardFlow } from "../components/portal/onboard-flow";

export default function Onboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <OnboardFlow />
    </Suspense>
  );
}
