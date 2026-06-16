import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const PINK = "#FF1F7D";

export default function CareersPage() {
  return (
    <MarketingLayout>
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 120px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.25em", color: PINK, marginBottom: 20 }}>CAREERS</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 700, color: "#111", lineHeight: 1.1, marginBottom: 24 }}>
          Build something<br />women deserve.
        </h1>
        <p style={{ fontSize: 16, color: "#777", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}>
          BloomBay is a women-first platform built in New York City. We&apos;re a small, focused team creating something that has never existed before — a real social world for women.
        </p>

        <div style={{ background: "#FFF5F8", borderRadius: 24, padding: "48px 36px", border: "1.5px solid #FFD0E8", marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 22, color: "#111", lineHeight: 1.4, marginBottom: 16 }}>
            &ldquo;We&apos;re not hiring right now, but we&apos;re always open to extraordinary people.&rdquo;
          </p>
          <p style={{ fontSize: 13, color: "#aaa", fontWeight: 600, letterSpacing: "0.06em" }}>— THE BLOOMBAY TEAM</p>
        </div>

        <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>
          If you believe in this vision, reach out directly.
        </p>
        <Link
          href="mailto:team@bloombay.app"
          style={{ display: "inline-block", background: PINK, color: "white", borderRadius: 999, padding: "14px 32px", fontWeight: 900, fontSize: 12, letterSpacing: "0.12em", textDecoration: "none", boxShadow: "0 4px 20px rgba(255,31,125,0.3)" }}
        >
          INTRODUCE YOURSELF →
        </Link>
      </section>
    </MarketingLayout>
  );
}
