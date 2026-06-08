import { BLOOM_TRUST_LINE } from "@/lib/founder-dashboard-metrics";

export function BloomTrustQuote() {
  return (
    <blockquote className="bb-admin-card bb-admin-trust-quote">
      <p>{BLOOM_TRUST_LINE}</p>
    </blockquote>
  );
}
