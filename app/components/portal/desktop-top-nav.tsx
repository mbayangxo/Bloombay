"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

const PINK = "#FF1F7D";

const NAV = [
  { href: "/member/home",        label: "HOME" },
  { href: "/member/happenings",  label: "HAPPENINGS" },
  { href: "/member/city",        label: "EATS" },
  { href: "/member/clubs",       label: "CLUBS" },
  { href: "/member/messages",    label: "MAILBOX" },
];

export function DesktopTopNav({ initial = "M" }: { initial?: string }) {
  const pathname = usePathname();

  return (
    <header
      className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between"
      style={{
        background: "#FAF7F2",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
        height: "60px",
        paddingLeft: "32px",
        paddingRight: "32px",
      }}
    >
      {/* Logo */}
      <Link href="/member/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "20px",
          color: PINK,
          letterSpacing: "-0.02em",
        }}>
          bloomBay
        </span>
        <span style={{ color: PINK, fontSize: "14px", opacity: 0.7 }}>✿</span>
      </Link>

      {/* Nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
        {NAV.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: active ? PINK : "rgba(0,0,0,0.42)",
                textDecoration: "none",
                borderBottom: active ? `1.5px solid ${PINK}` : "1.5px solid transparent",
                paddingBottom: "2px",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right side: pin + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Notifications */}
        <Link href="/member/notifications" style={{ position: "relative", display: "flex" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: PINK,
              border: "1.5px solid #FAF7F2",
            }}
          />
        </Link>

        {/* Messages */}
        <Link href="/member/messages" style={{ position: "relative", display: "flex" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <div
            style={{
              position: "absolute",
              top: "-4px",
              right: "-5px",
              width: "13px",
              height: "13px",
              borderRadius: "50%",
              background: PINK,
              border: "1.5px solid #FAF7F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "7px",
              fontWeight: 900,
              color: "white",
              fontFamily: "var(--font-jost)",
              lineHeight: 1,
            }}
          >
            3
          </div>
        </Link>

        {/* Avatar */}
        <Link href="/member/lounge" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: PINK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 900,
              color: "white",
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              boxShadow: "0 2px 10px rgba(255,31,125,0.35)",
            }}
          >
            {initial}
          </div>
        </Link>

        {/* Sign out */}
        <form action={logout}>
          <button type="submit" title="Sign out" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}
