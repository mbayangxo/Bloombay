import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";

export default function PortalsPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0D000A" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <BBLogo size={56} light />
        <h1
          className="mt-5 text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Bloom<span style={{ color: "#FF1F7D" }}>Bay</span>
        </h1>
        <p
          className="mt-2 text-xs tracking-[0.25em] uppercase"
          style={{ color: "#5a3048" }}
        >
          New York City
        </p>
      </div>

      {/* Member login card */}
      <Link
        href="/member/login"
        className="w-full max-w-sm rounded-3xl p-8 flex flex-col gap-5 transition-all hover:-translate-y-1 active:scale-[0.98]"
        style={{
          background: "#FFF5F8",
          border: "1px solid rgba(255,31,125,0.15)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          textDecoration: "none",
        }}
      >
        <div className="flex items-center gap-3">
          <BBLogo size={32} />
          <p
            className="text-xs font-bold tracking-[0.18em] uppercase"
            style={{ color: "#FF1F7D" }}
          >
            BloomBay Members
          </p>
        </div>

        <div>
          <h2
            className="text-2xl font-bold leading-tight"
            style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}
          >
            Welcome home.
          </h2>
          <p className="text-sm mt-1" style={{ color: "#9e6070" }}>
            Your world is waiting.
          </p>
        </div>

        <div
          className="self-start flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-wide text-white"
          style={{
            background: "#FF1F7D",
            boxShadow: "0 4px 16px rgba(255,31,125,0.4)",
          }}
        >
          Log in
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Link>

      {/* Join link */}
      <p className="mt-8 text-sm" style={{ color: "#5a3048" }}>
        Not a member?{" "}
        <Link href="/onboard" className="font-bold transition-colors hover:text-pink-300" style={{ color: "#FF1F7D" }}>
          Join BloomBay
        </Link>
      </p>
    </div>
  );
}
