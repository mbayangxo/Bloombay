import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";

export default function PortalsPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, #FF69B4 0%, #FF1F7D 48%, #C4005A 100%)" }}
    >
      {/* Soft radial shine + decorative petals */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 28% 18%, rgba(255,255,255,0.22) 0%, transparent 52%)" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ top: -70, right: -70, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ bottom: -90, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(0,0,0,0.08)" }}
      />
      <div className="absolute top-10 left-8 opacity-25 pointer-events-none">
        <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-16 right-10 opacity-20 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Logo */}
      <div className="relative flex flex-col items-center mb-10">
        <BBLogo size={56} light />
        <h1
          className="mt-5 text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          BloomBay
        </h1>
        <p
          className="mt-2 text-xs tracking-[0.28em] uppercase"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          New York City
        </p>
      </div>

      {/* Member login card */}
      <Link
        href="/member/login"
        className="relative w-full max-w-sm rounded-3xl p-8 flex flex-col gap-5 transition-all hover:-translate-y-1 active:scale-[0.98]"
        style={{
          background: "#FFFDFE",
          boxShadow: "0 24px 70px rgba(90,0,40,0.45), 0 4px 18px rgba(0,0,0,0.12)",
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
            className="text-3xl font-bold leading-tight"
            style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}
          >
            Welcome home.
          </h2>
          <p
            className="text-base mt-1"
            style={{ color: "#c4005a", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
          >
            Your world is waiting.
          </p>
        </div>

        <div
          className="self-start flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold tracking-wide text-white"
          style={{
            background: "linear-gradient(135deg, #FF1F7D, #c4005a)",
            boxShadow: "0 6px 22px rgba(196,0,90,0.45)",
          }}
        >
          Log in
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Link>

      {/* Join link */}
      <p className="relative mt-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
        Not a member?{" "}
        <Link href="/onboard" className="font-bold underline underline-offset-2 text-white transition-opacity hover:opacity-80">
          Join BloomBay
        </Link>
      </p>
    </div>
  );
}
