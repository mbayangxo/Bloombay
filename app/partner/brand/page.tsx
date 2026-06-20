import { PartnerBrandBuilder } from "@/app/components/partner-brand/partner-brand-builder";
import { PartnerShell } from "../components/partner-shell";

export default function PartnerBrandPage() {
  return (
    <PartnerShell
      title="Brand identity"
      sub="Templates for cafés, restaurants, salons, studios, and venues — your colors, photos, About us, and menu."
    >
      <PartnerBrandBuilder />
    </PartnerShell>
  );
}
