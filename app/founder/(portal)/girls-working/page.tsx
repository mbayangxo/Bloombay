import { FounderShell } from "@/app/components/admin/founder-shell";
import { GirlsWorkingStudio } from "@/app/components/founder/girls-working-studio";

export default function FounderGirlsWorkingPage() {
  return (
    <FounderShell
      title="Girls Working"
      subtitle="Curate NYC jobs women want — fashion, cafés, libraries, social, creative."
      compactHeader
    >
      <GirlsWorkingStudio />
    </FounderShell>
  );
}
