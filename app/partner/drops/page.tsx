import { PartnerDropsEditor } from "@/app/partner/components/partner-drops-editor";
import { PartnerShell } from "../components/partner-shell";

export default function PartnerDropsPage() {
  return (
    <PartnerShell
      title="Boom drops"
      sub="Discounts, BOGO, and bundles — editable captions members see on your page."
    >
      <PartnerDropsEditor />
    </PartnerShell>
  );
}
