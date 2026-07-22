"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "./bb-logo";
import { logout } from "@/lib/auth/actions";

export interface MobileNavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | null;
  n?: string;
}

export interface MobileNavSection {
  title: string;
  items: MobileNavItem[];
}

interface Props {
  portalLabel: string;
  items: MobileNavItem[];
  /** When provided, the drawer renders grouped sections with headers instead of one flat list. */
  sections?: MobileNavSection[];
  theme: "dark" | "light";
  userName?: string;
  userInitial?: string;
  userRole?: string;
}

export function MobilePortalNav({ portalLabel, items, sections, theme, userName, userInitial = "?", userRole }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const dark = theme === "dark";
  const bg       = dark ? "#111111" : "#ffffff";
  const border   = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const text      = dark ? "rgba(255,255,255,0.9)" : "#111111";
  const textMuted = dark ? "rgba(255,255,255,0.35)" : "rgba(17,17,17,0.4)";

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);
  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── MOBILE TOP BAR ─────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center px-4"
        style={{
          height: 56,
          background: bg,
          borderBottom: `1px solid ${border}`,
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          style={{ color: text, padding: "8px 8px 8px 0", lineHeight: 0 }}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo + portal name */}
        <div className="flex items-center gap-2 ml-3 flex-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: dark ? "linear-gradient(135deg, #FF1F7D, #FF69B4)" : "#111111" }}
          >
            <BBLogo size={16} light />
          </div>
          <div>
            <span className="font-bold text-sm tracking-widest uppercase block leading-none" style={{ color: text }}>
              BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
            </span>
            <span className="text-[8px] font-semibold tracking-wider leading-none" style={{ color: textMuted }}>
              {portalLabel}
            </span>
          </div>
        </div>

        {/* User avatar pill */}
        {userInitial && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)" }}
          >
            {userInitial}
          </div>
        )}
      </div>

      {/* ── OVERLAY ────────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── SLIDE-OUT DRAWER ───────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 h-full z-50 flex flex-col overflow-y-auto"
        style={{
          width: 280,
          background: bg,
          borderRight: `1px solid ${border}`,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: dark ? "linear-gradient(135deg, #FF1F7D, #FF69B4)" : "#111111" }}
            >
              <BBLogo size={20} light />
            </div>
            <div>
              <span className="font-bold text-sm tracking-widest uppercase block" style={{ color: text }}>
                BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider" style={{ color: textMuted }}>
                {portalLabel}
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ color: textMuted, lineHeight: 0, padding: 4 }}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col">
          {(sections ?? [{ title: "", items }]).map((section, si) => (
            <div key={section.title || si} className={si > 0 ? "mt-5" : undefined}>
              {section.title && (
                <p
                  className="px-4 mb-1.5 text-[9px] font-extrabold uppercase"
                  style={{ color: "#FF1F7D", letterSpacing: "0.2em" }}
                >
                  {section.title}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const base = item.href.split("?")[0];
                  const active = pathname === base || pathname.startsWith(`${base}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all"
                      style={
                        active
                          ? { background: "#FF1F7D", color: "white" }
                          : { color: dark ? "rgba(255,255,255,0.6)" : "rgba(17,17,17,0.6)" }
                      }
                    >
                      {item.n && (
                        <span className="text-[9px] font-mono w-5 flex-shrink-0" style={{ color: active ? "rgba(255,255,255,0.7)" : "rgba(255,31,125,0.5)" }}>
                          {item.n}
                        </span>
                      )}
                      {item.icon && (
                        <span className="flex-shrink-0 w-5 flex items-center justify-center" style={{ color: active ? "white" : (dark ? "rgba(255,255,255,0.4)" : "rgba(17,17,17,0.4)") }}>
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
                          style={{ background: active ? "rgba(255,255,255,0.3)" : "#FF1F7D", color: "white" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-5" style={{ borderTop: `1px solid ${border}` }}>
          {userName && (
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)" }}
              >
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-none" style={{ color: text }}>{userName}</p>
                {userRole && <p className="text-xs mt-0.5 truncate" style={{ color: textMuted }}>{userRole}</p>}
              </div>
            </div>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold"
              style={{ background: dark ? "rgba(255,255,255,0.07)" : "rgba(17,17,17,0.05)", color: dark ? "rgba(255,255,255,0.4)" : "rgba(17,17,17,0.45)" }}
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
