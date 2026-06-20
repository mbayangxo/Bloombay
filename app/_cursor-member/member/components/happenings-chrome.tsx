"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { PlaceCover } from "@/app/components/member/place-cover";
import { GirlCalendarStrip } from "@/app/components/member/girl-calendar-strip";
import { HAPPENINGS_OBJECT } from "@/lib/bloom-object-assets";

export const HAPPENINGS_TABS = [
  { id: "invitations", label: "Invitations" },
  { id: "gatherings", label: "Gatherings" },
  { id: "city", label: "In the city" },
  { id: "solo", label: "Solo" },
  { id: "seats", label: "Seats", href: "/member/happenings/seats" },
  { id: "maps", label: "Maps & Eats", href: "/member/maps" },
] as const;

function tabIsActive(
  tab: (typeof HAPPENINGS_TABS)[number],
  pathname: string,
  queryTab: string | null
): boolean {
  const activeTab = queryTab ?? "invitations";

  if (tab.id === "maps") {
    return pathname === "/member/maps" || pathname === "/member/eats";
  }
  if (tab.id === "seats") {
    return pathname.startsWith("/member/happenings/seats");
  }
  if (tab.id === "invitations") {
    return (
      pathname.startsWith("/member/happenings/confetti") ||
      (pathname === "/member/happenings" && activeTab === "invitations")
    );
  }
  if ("href" in tab) {
    return pathname === tab.href;
  }

  return pathname === "/member/happenings" && activeTab === tab.id;
}

export function HappeningsChrome({
  children,
  invitationsFocus = false,
}: {
  children: React.ReactNode;
  invitationsFocus?: boolean;
}) {
  const pathname = usePathname();
  const queryTab = useSearchParams().get("tab");
  const focusInvitations =
    invitationsFocus || (pathname === "/member/happenings" && (queryTab ?? "invitations") === "invitations");

  return (
    <>
      <div
        className={`mp-happenings-head mp-happenings-head--slim${focusInvitations ? " mp-happenings-head--invitations" : ""}`}
      >
        {!focusInvitations ? (
          <>
            <div className="mp-happenings-head__top">
              <PlaceCover
                tone="envelope"
                eyebrow="BloomBay · tonight"
                title="Happenings"
                whisper="Gatherings · city · solo notes"
                object={
                  <BloomObjectIcon
                    src={HAPPENINGS_OBJECT}
                    size={48}
                    motion="stamp"
                    className="mp-happenings-ticket"
                  />
                }
                className="mp-happenings-cover"
              />
              <div className="mp-happenings-head__actions">
                <Link href="/member/calendar" className="mp-btn mp-btn--outline mp-btn--sm" aria-label="Open Girl Calendar">
                  Girl Calendar
                </Link>
                <Link href="/member/happenings/create" className="mp-btn mp-btn--hot mp-btn--sm" aria-label="Create a gathering">
                  + Create
                </Link>
              </div>
            </div>
            <GirlCalendarStrip />
          </>
        ) : (
          <div className="mp-happenings-head__invitations-bar">
            <h1 className="mp-happenings-head__invitations-title">Invitations</h1>
            <p className="mp-happenings-head__invitations-whisper">Confetti · open seats · envelopes waiting for you</p>
            <div className="mp-happenings-head__actions">
              <Link href="/member/calendar" className="mp-btn mp-btn--outline mp-btn--sm" aria-label="Open Girl Calendar">
                Girl Calendar
              </Link>
              <Link href="/member/happenings/create" className="mp-btn mp-btn--hot mp-btn--sm" aria-label="Create a gathering">
                + Create
              </Link>
            </div>
          </div>
        )}
        <nav className="mp-happenings-tabs" aria-label="Happenings sections">
          {HAPPENINGS_TABS.map((t) => {
            const href = "href" in t ? t.href : `/member/happenings?tab=${t.id}`;
            const active = tabIsActive(t, pathname, queryTab);
            return (
              <Link
                key={t.id}
                href={href}
                className={`mp-happenings-tab${active ? " mp-happenings-tab--active" : ""}`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </>
  );
}
