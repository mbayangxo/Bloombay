"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/portal-navigation";

export function PortalFooter({
  links,
  tourHref,
  className = "",
}: {
  links: NavLink[];
  /** Reopen illustrated portal tour (?tour=1) */
  tourHref?: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <footer className={`bb-portal-footer ${className}`.trim()} aria-label="Portal navigation">
      <nav className="bb-portal-footer__nav">
        {tourHref ? (
          <Link href={tourHref} className="bb-portal-footer__link bb-portal-footer__link--tour">
            Take tour
          </Link>
        ) : null}
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(`${link.href}/`));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "bb-portal-footer__link bb-portal-footer__link--active" : "bb-portal-footer__link"}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
