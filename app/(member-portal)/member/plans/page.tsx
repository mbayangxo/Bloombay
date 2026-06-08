import { Suspense } from "react";
import { PlansHub } from "@/app/components/portal/plans-hub";

export default function PlansPage() {
  return (
    <Suspense fallback={null}>
      <PlansHub />
    </Suspense>
  );
}
