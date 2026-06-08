import Link from "next/link";
import { PartnerShell } from "../components/partner-shell";
import { partnerMemberHref } from "@/lib/partner-brand/paths";
import { SESSION_PARTNER_SLUG } from "@/lib/partner-brand/store";
import { PARTNER_PROFILE } from "@/lib/partner-portal-data";

export default function PartnerProfilePage() {
  return (
    <PartnerShell title="Venue profile" sub="Basics — full brand identity lives in Brand.">
      <div className="pp-card">
        <h2>{PARTNER_PROFILE.name}</h2>
        <p style={{ margin: "0 0 0.5rem" }}>{PARTNER_PROFILE.type}</p>
        <p style={{ margin: 0 }}>{PARTNER_PROFILE.address}</p>
        <p style={{ margin: "0.5rem 0 0", fontWeight: 600 }}>Capacity: {PARTNER_PROFILE.capacity} seats</p>
      </div>
      <p style={{ fontSize: "0.82rem", color: "var(--pp-muted)", marginBottom: "1rem" }}>
        Customize colors, photos, About us slideshow, and menu in Brand identity.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <Link href="/partner/brand" className="pp-btn pp-btn--primary">
          Edit brand identity →
        </Link>
        <Link
          href={partnerMemberHref(SESSION_PARTNER_SLUG)}
          className="pp-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Preview member page →
        </Link>
      </div>
    </PartnerShell>
  );
}
