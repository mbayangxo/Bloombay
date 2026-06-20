"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MEMBER_SIDEBAR_NAV } from "@/lib/member-nav";
import { PortalUtilityIcons } from "./portal-utility-icons";

export function HomeScrapbookHeader({ initial = "M" }: { initial?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="bb-home-header">
        <Link href="/member/home" className="bb-home-header__mark" aria-label="BloomBay home">
          <span className="bb-home-header__bb">BB*</span>
        </Link>

        <Link href="/member/home" className="bb-home-header__brand">
          Bloom<span className="bb-home-header__star">Bay*</span>
        </Link>

        <div className="bb-home-header__actions">
          <PortalUtilityIcons
            iconClassName="bb-home-header__icon"
            showApartmentInitial={initial}
          />
          <button
            type="button"
            className="bb-home-header__menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`bb-home-header__burger${open ? " bb-home-header__burger--open" : ""}`} />
          </button>
        </div>
      </header>

      {open ? (
        <>
          <button
            type="button"
            className="bb-home-header__backdrop"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav className="bb-home-header__drawer" aria-label="Member navigation">
            <p className="bb-home-header__drawer-title">Navigate</p>
            <ul className="bb-home-header__drawer-list">
              {MEMBER_SIDEBAR_NAV.map((item) => {
                const active = item.match(pathname);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`bb-home-header__drawer-link${active ? " bb-home-header__drawer-link--active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/member/lounge"
                  className={`bb-home-header__drawer-link${pathname.startsWith("/member/lounge") ? " bb-home-header__drawer-link--active" : ""}`}
                >
                  My apartment
                </Link>
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </>
  );
}
