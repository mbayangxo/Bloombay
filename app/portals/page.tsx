import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";

export default function PortalsPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0D000A" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
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
          Welcome back
        </p>
      </div>

      {/* Member portal — only public entry point */}
      <div className="w-full max-w-sm">
        <Link
          href="/member/login"
          className="group relative flex flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background: "#FFF5F8",
            border: "1px solid rgba(255,31,125,0.15)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
            textDecoration: "none",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BBLogo size={40} />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: "#FF1F7D" }}>
              Member App
            </span>
          </div>

          <h2 className="text-2xl font-bold leading-tight mb-2" style={{ color: "#0A0A0A" }}>
            Welcome home.
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#9e6070" }}>
            For BloomBay Members
          </p>

          <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-6 py-3 rounded-full self-start transition-all group-hover:brightness-110"
            style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.4)" }}
          >
            Enter
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(255,31,125,0.06), transparent 65%)" }}
          />
        </Link>

        <div className="mt-6 text-center">
          <p className="text-sm mb-3" style={{ color: "#5a2a45" }}>
            Not a member yet?
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest text-white transition-all hover:brightness-110 active:scale-95"
            style={{ background: "#FF1F7D" }}
          >
            JOIN BLOOMBAY
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>

      <p className="mt-14 text-xs tracking-widest uppercase" style={{ color: "#3d1a30" }}>
        100 Founding Mothers · NYC
      </p>
    </div>
  );
}
