"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PartnerBrandView } from "@/app/components/partner-brand/partner-brand-view";
import { listDropsForPartner } from "@/lib/partner-drops/store";
import { getPartnerBrandBySlug } from "@/lib/partner-brand/store";
import type { PartnerBrandProfile } from "@/lib/partner-brand/types";
import { MemberShell } from "../../components/member-shell";
import "@/app/styles/partner-brand.css";

export default function MemberPartnerPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [brand, setBrand] = useState<PartnerBrandProfile | null>(null);
  const [drops, setDrops] = useState<ReturnType<typeof listDropsForPartner>>([]);

  useEffect(() => {
    setBrand(getPartnerBrandBySlug(slug));
    setDrops(listDropsForPartner(slug, true));
  }, [slug]);

  if (!brand) {
    return (
      <MemberShell compactHeader>
        <div className="mp-page-body">
          <p>Partner not found.</p>
          <Link href="/member/eats" className="mp-link">
            ← Back to Eats
          </Link>
        </div>
      </MemberShell>
    );
  }

  if (!brand.published) {
    return (
      <MemberShell compactHeader>
        <div className="mp-page-body">
          <p>This partner page isn&apos;t published yet.</p>
          <Link href="/member/eats" className="mp-link">
            ← Back to Eats
          </Link>
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell compactHeader>
      <PartnerBrandView brand={brand} drops={drops} backHref="/member/eats" />
    </MemberShell>
  );
}
