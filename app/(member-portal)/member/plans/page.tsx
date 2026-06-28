import { PlansPageClient } from "@/app/components/plans/plans-page-client";
import { getPlansData } from "@/lib/plans/get-plans-data";

export default async function PlansPage() {
  const data = await getPlansData();

  if (!data.ok) {
    return (
      <PlansPageClient
        userId=""
        initialPlans={[]}
        initialMemories={[]}
        initialError={data.error}
      />
    );
  }

  return (
    <PlansPageClient
      userId={data.userId}
      initialPlans={data.plans}
      initialMemories={data.memories}
      initialError={null}
    />
  );
}
