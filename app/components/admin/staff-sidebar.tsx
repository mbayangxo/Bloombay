"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { canMissionControl, ROLE_DISPLAY } from "@/lib/auth/mission-control";
import { MC_NAV } from "@/lib/portal-navigation";
import { useMissionControlRole } from "./mission-control-provider";

const ICONS: Record<string, string> = {
  "/dashboard": "✦",
  "/people": "♣",
  "/cities": "◆",
  "/clubs": "✾",
  "/events": "🎫",
  "/bloom-requests": "✿",
  "/team": "♢",
  "/invites": "✉",
  "/club-hosts": "✧",
  "/verification": "❀",
  "/safety": "♡",
  "/applications": "✿",
  "/partners": "✧",
  "/inbox": "✉",
  "/messaging": "✎",
  "/girls-working": "💼",
  "/submissions": "◎",
  "/reports": "▤",
  "/yande": "✎",
  "/markets": "◇",
  "/neighborhoods": "◈",
  "/qa-lab": "◎",
  "/create": "✎",
};

export function StaffSidebar({
  basePath,
  portalTitle,
}: {
  basePath: "/founder" | "/admin";
  portalTitle: string;
}) {
  const pathname = usePathname();
  const role = useMissionControlRole();

  function isActive(href: string) {
    const full = `${basePath}${href}`;
    return pathname === full || pathname.startsWith(`${full}/`);
  }

  return (
    <aside className="bb-admin-sidebar bb-mission-sidebar">
      <div className="bb-admin-mark bb-admin-mark--logo">
        <Image
          src="/logosbloombay/Vector-1.svg"
          alt=""
          width={28}
          height={46}
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <div>
          BloomBay
          <span>{portalTitle}</span>
          <span className="bb-mission-nav__role-badge">{ROLE_DISPLAY[role]}</span>
        </div>
      </div>
      <nav className="bb-admin-nav bb-mission-nav" aria-label={portalTitle}>
        {MC_NAV.map((section) => {
          const items = section.items.filter((item) => canMissionControl(role, item.cap));
          if (!items.length) return null;
          return (
            <div key={section.title} className="bb-mission-nav__section">
              <p className="bb-mission-nav__section-title">{section.title}</p>
              {items.map((item) => {
                const href = `${basePath}${item.path}`;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      isActive(item.path) ? "bb-admin-nav--active bb-mission-nav__link" : "bb-mission-nav__link"
                    }
                  >
                    <span className="bb-mission-nav__icon" aria-hidden>
                      {ICONS[item.path] ?? "•"}
                    </span>
                    <span className="bb-mission-nav__label">{item.label}</span>
                    <span className="bb-mission-nav__petal" aria-hidden />
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
