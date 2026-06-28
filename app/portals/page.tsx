import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { BETA_PORTALS } from "@/lib/beta-portals";
import { CLUB_MAMA_LABELS } from "@/lib/product-role-labels";

const ACCENT: Record<
  (typeof BETA_PORTALS)[number]["accent"],
  { bg: string; border: string; label: string; btn: string; btnText: string }
> = {
  rose: {
    bg: "#FFF5F8",
    border: "rgba(255,31,125,0.15)",
    label: "#FF1F7D",
    btn: "#FF1F7D",
    btnText: "#ffffff",
  },
  mama: {
    bg: "#FFF0F5",
    border: "rgba(255,31,125,0.25)",
    label: "#FF1F7D",
    btn: "#FF1F7D",
    btnText: "#ffffff",
  },
  host: {
    bg: "#FBF6F0",
    border: "rgba(28,27,28,0.12)",
    label: "#1C1B1C",
    btn: "#1C1B1C",
    btnText: "#FBF6F0",
  },
  founder: {
    bg: "#180010",
    border: "rgba(255,31,125,0.2)",
    label: "#FF1F7D",
    btn: "#FF1F7D",
    btnText: "#ffffff",
  },
};

function PortalCard({ portal }: { portal: (typeof BETA_PORTALS)[number] }) {
  const a = ACCENT[portal.accent];
  const featured = portal.featured;
  const dark = portal.accent === "founder";

  return (
    <Link
      href={portal.login}
      className={`flex flex-col gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.99] ${
        featured ? "p-8 gap-5" : "p-5"
      }`}
      style={{
        background: a.bg,
        border: `1px solid ${a.border}`,
        borderRadius: featured ? 24 : 20,
        boxShadow: featured ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.25)",
        textDecoration: "none",
      }}
    >
      <div className="flex items-center gap-2.5">
        {featured ? <BBLogo size={32} /> : null}
        <p
          className="text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ color: a.label }}
        >
          {portal.name}
        </p>
      </div>

      <div>
        <h2
          className={`font-bold leading-tight ${featured ? "text-2xl" : "text-lg"}`}
          style={{
            color: dark ? "#ffffff" : "#111111",
            fontFamily: "var(--font-playfair)",
          }}
        >
          {featured ? "Welcome home." : portal.name}
        </h2>
        <p
          className={`mt-1 ${featured ? "text-sm" : "text-xs leading-relaxed"}`}
          style={{ color: dark ? "#9e6070" : "#9e6070" }}
        >
          {portal.tagline}
        </p>
      </div>

      <div
        className={`self-start flex items-center gap-2 rounded-full font-bold tracking-wide ${
          featured ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs"
        }`}
        style={{
          background: a.btn,
          color: a.btnText,
          boxShadow: featured ? "0 4px 16px rgba(255,31,125,0.4)" : "none",
        }}
      >
        {portal.cta}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6h8M6 2l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}

export default function PortalsPage() {
  const [member, ...operators] = BETA_PORTALS;

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-16"
      style={{ background: "#0D000A" }}
    >
      <div className="flex flex-col items-center mb-10">
        <BBLogo size={56} light />
        <h1
          className="mt-5 text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Bloom<span style={{ color: "#FF1F7D" }}>Bay</span>
        </h1>
        <p className="mt-2 text-xs tracking-[0.25em] uppercase" style={{ color: "#5a3048" }}>
          New York City
        </p>
        <p className="mt-4 text-sm text-center max-w-xs" style={{ color: "#7a5068" }}>
          Choose your portal — Member, Club Mama, Host, or Founder.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <PortalCard portal={member} />

        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-center pt-2"
          style={{ color: "#5a3048" }}
        >
          Operators & hosts
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {operators.map((portal) => (
            <PortalCard key={portal.id} portal={portal} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-sm">
        <p style={{ color: "#5a3048" }}>
          Not a member?{" "}
          <Link
            href="/onboard"
            className="font-bold transition-colors hover:text-pink-300"
            style={{ color: "#FF1F7D" }}
          >
            Join BloomBay
          </Link>
        </p>
        <p style={{ color: "#5a3048" }}>
          {CLUB_MAMA_LABELS.become}?{" "}
          <Link
            href="/member/apply-club-mama"
            className="font-bold transition-colors hover:text-pink-300"
            style={{ color: "#FF1F7D" }}
          >
            Apply here
          </Link>
        </p>
      </div>
    </div>
  );
}
