import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";

interface PortalCard {
  href: string;
  label: string;
  headline: string;
  sub: string;
  bg: string;
  textColor: string;
  labelColor: string;
  subColor: string;
  border: string;
  btnBg: string;
  btnText: string;
  logoDark?: boolean;
}

const portals: PortalCard[] = [
  {
    href: "/member/login",
    label: "Member App",
    headline: "Welcome home.",
    sub: "For BloomBay Members",
    bg: "#FFF5F8",
    textColor: "#0A0A0A",
    labelColor: "#FF1F7D",
    subColor: "#9e6070",
    border: "rgba(255,31,125,0.15)",
    btnBg: "#FF1F7D",
    btnText: "white",
    logoDark: false,
  },
  {
    href: "/admin/login",
    label: "Founder Portal",
    headline: "Mission Control",
    sub: "For Founders & Admins — Mission control for BloomBay.",
    bg: "#1A0514",
    textColor: "white",
    labelColor: "#FF1F7D",
    subColor: "#9e7a8a",
    border: "rgba(255,31,125,0.2)",
    btnBg: "#FF1F7D",
    btnText: "white",
    logoDark: true,
  },
  {
    href: "/club-owner/login",
    label: "Club Owner Portal",
    headline: "Your Clubhouse",
    sub: "Run Your Club",
    bg: "#FF1F7D",
    textColor: "white",
    labelColor: "rgba(255,255,255,0.85)",
    subColor: "rgba(255,255,255,0.75)",
    border: "rgba(255,255,255,0.25)",
    btnBg: "white",
    btnText: "#FF1F7D",
    logoDark: true,
  },
  {
    href: "/partner/login",
    label: "Partner Portal",
    headline: "Your Venue",
    sub: "For Partners & Venues",
    bg: "#120009",
    textColor: "white",
    labelColor: "#FF1F7D",
    subColor: "#7a4560",
    border: "rgba(255,31,125,0.2)",
    btnBg: "#FF1F7D",
    btnText: "white",
    logoDark: true,
  },
  {
    href: "/curator/login",
    label: "Curator Portal",
    headline: "You create culture.",
    sub: "For BloomBay Curators — the women who build the world.",
    bg: "#FFF5F8",
    textColor: "#0A0A0A",
    labelColor: "#FF1F7D",
    subColor: "#9e6070",
    border: "rgba(255,31,125,0.15)",
    btnBg: "#FF1F7D",
    btnText: "white",
    logoDark: false,
  },
];

export default function PortalsPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0D000A" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-14">
        <BBLogo size={56} light />
        <h1
          className="mt-5 text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Bloom<span style={{ color: "#FF1F7D" }}>Bay</span>
        </h1>
        <p
          className="mt-2 text-sm tracking-widest uppercase"
          style={{ color: "#7a4560", letterSpacing: "0.22em" }}
        >
          Choose your portal
        </p>
      </div>

      {/* Portal grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-5">
        {portals.map((portal) => (
          <Link
            key={portal.href}
            href={portal.href}
            className="group relative flex flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: portal.bg,
              border: `1px solid ${portal.border}`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              textDecoration: "none",
            }}
          >
            {/* Logo + label row */}
            <div className="flex items-center gap-3 mb-5">
              <BBLogo size={36} light={portal.logoDark} />
              <span
                className="text-xs font-semibold tracking-[0.18em] uppercase"
                style={{ color: portal.labelColor }}
              >
                {portal.label}
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-xl font-bold leading-tight mb-2"
              style={{ color: portal.textColor }}
            >
              {portal.headline}
            </h2>

            {/* Subtext */}
            <p
              className="text-sm font-normal leading-relaxed flex-1"
              style={{ color: portal.subColor }}
            >
              {portal.sub}
            </p>

            {/* CTA */}
            <div className="mt-6 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-5 py-2.5 rounded-full transition-all duration-200"
                style={{
                  background: portal.btnBg,
                  color: portal.btnText,
                  boxShadow:
                    portal.btnBg === "white"
                      ? "0 4px 16px rgba(255,255,255,0.2)"
                      : "0 4px 16px rgba(255,31,125,0.4)",
                }}
              >
                Enter
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6h8M6 2l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            {/* Hover glow overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgba(255,31,125,0.06), transparent 65%)",
              }}
            />
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p
        className="mt-12 text-xs tracking-widest uppercase"
        style={{ color: "#3d1a30" }}
      >
        100 Founding Mothers · NYC
      </p>
    </div>
  );
}
