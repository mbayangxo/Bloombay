"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

const PINK = "#FF1F7D";
const PAPER = "#FEFCF7";

interface Props {
  initial: string;
  name: string;
  role: string;
}

const PRIMARY_NAV = [
  { href: "/member/home",       label: "HOME",       icon: HomeIcon },
  { href: "/member/happenings", label: "HAPPENINGS", icon: HapIcon },
  { href: "/member/plans",      label: "PLANS",      icon: PlansIcon },
  { href: "/member/clubs",      label: "CLUBS",      icon: ClubsIcon },
  { href: "/member/avenue",     label: "AVENUE",     icon: AvenueIcon },
  { href: "/member/city",       label: "EATS & CITY",icon: CityIcon },
];

const SECONDARY_NAV = [
  { href: "/member/discover",       label: "DISCOVER" },
  { href: "/member/lounge",         label: "LOUNGE" },
  { href: "/member/messages",       label: "MAILBOX" },
  { href: "/member/notifications",  label: "PIN DROPS" },
  { href: "/member/apartment",      label: "APARTMENT" },
  { href: "/member/search",         label: "SEARCH" },
];

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? PINK : "rgba(0,0,0,0.32)";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function HapIcon({ active }: { active: boolean }) {
  const c = active ? PINK : "rgba(0,0,0,0.32)";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function PlansIcon({ active }: { active: boolean }) {
  const c = active ? PINK : "rgba(0,0,0,0.32)";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}
function ClubsIcon({ active }: { active: boolean }) {
  const c = active ? PINK : "rgba(0,0,0,0.32)";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4"/><circle cx="17" cy="17" r="4"/>
    </svg>
  );
}
function AvenueIcon({ active }: { active: boolean }) {
  const c = active ? PINK : "rgba(0,0,0,0.32)";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}
function CityIcon({ active }: { active: boolean }) {
  const c = active ? PINK : "rgba(0,0,0,0.32)";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export function MemberDesktopSidebar({ initial, name, role }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/member/home") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-full flex-col z-40"
      style={{ width: 240, background: PAPER, borderRight: "1px solid rgba(255,31,125,0.08)" }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,31,125,0.06)" }}>
        <Link href="/member/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: PINK, letterSpacing: "-0.02em" }}>bloomBay</span>
          <span style={{ color: PINK, fontSize: 14, opacity: 0.6 }}>✿</span>
        </Link>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.25)", marginTop: 4 }}>MEMBER PORTAL</p>
      </div>

      {/* Primary nav */}
      <nav style={{ padding: "16px 0 8px" }}>
        {PRIMARY_NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "10px 24px",
                textDecoration: "none",
                borderLeft: active ? `2px solid ${PINK}` : "2px solid transparent",
                background: active ? "rgba(255,31,125,0.04)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <Icon active={active} />
              <span style={{
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.16em",
                color: active ? PINK : "rgba(0,0,0,0.42)",
              }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ margin: "4px 24px", height: 1, background: "rgba(255,31,125,0.07)" }} />

      {/* Secondary nav */}
      <nav style={{ padding: "8px 0", flex: 1 }}>
        {SECONDARY_NAV.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}
              style={{
                display: "flex", alignItems: "center",
                padding: "8px 24px",
                textDecoration: "none",
                borderLeft: active ? `2px solid ${PINK}` : "2px solid transparent",
              }}
            >
              <span style={{
                fontFamily: "var(--font-jost)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: active ? PINK : "rgba(0,0,0,0.3)",
              }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Tagline */}
      <div style={{ padding: "12px 24px", borderTop: "1px solid rgba(255,31,125,0.05)" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.2)", lineHeight: 1.4, fontStyle: "italic" }}>
          A world made<br />for women. ♡
        </p>
      </div>

      {/* User footer */}
      <div style={{ padding: "12px 24px 16px", borderTop: "1px solid rgba(255,31,125,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/member/you" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "white", fontFamily: "var(--font-playfair)", fontStyle: "italic", boxShadow: "0 2px 10px rgba(255,31,125,0.28)" }}>
            {initial}
          </div>
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "rgba(0,0,0,0.7)", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em", marginTop: 1 }}>{role.toUpperCase()}</p>
        </div>
        <form action={logout}>
          <button type="submit" title="Sign out" aria-label="Sign out" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
