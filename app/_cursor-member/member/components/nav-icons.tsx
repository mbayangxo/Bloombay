import type { ComponentType } from "react";

/** Minimal stroke icons — shared by sidebar and bottom nav. */

export function NavIconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
    </svg>
  );
}

export function NavIconHappenings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" strokeLinecap="round" />
    </svg>
  );
}

export function NavIconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

export function NavIconClubs({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="9" cy="7" r="3.5" />
      <path d="M3 20v-1.5a4 4 0 0 1 4-4h4M16 4a3.5 3.5 0 0 1 0 7M21 20v-1.5a3.5 3.5 0 0 0-3-3.45" strokeLinecap="round" />
    </svg>
  );
}

export function NavIconIntros({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M3 20v-1a5 5 0 0 1 5-5h1M16 4.5a3 3 0 0 1 0 6M21 20v-1a4 4 0 0 0-3-3.87" strokeLinecap="round" />
    </svg>
  );
}

export function NavIconCity({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="10" r="7" />
      <path d="M12 3v14M5 10h14" strokeLinecap="round" />
    </svg>
  );
}

export function NavIconApartment({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 20V9l8-5 8 5v11" strokeLinejoin="round" />
      <path d="M9 20v-5h6v5" />
    </svg>
  );
}

export function NavIconLobby({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M5 20V9.5L12 5l7 4.5V20" strokeLinejoin="round" />
      <path d="M9 20v-4h6v4" />
    </svg>
  );
}

export function NavIconSettings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2" strokeLinecap="round" />
    </svg>
  );
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  home: NavIconHome,
  happenings: NavIconHappenings,
  calendar: NavIconCalendar,
  clubs: NavIconClubs,
  intros: NavIconIntros,
  city: NavIconCity,
  apartment: NavIconApartment,
  lobby: NavIconLobby,
};

export function MemberNavIcon({ id, className }: { id: string; className?: string }) {
  const Icon = ICONS[id] ?? NavIconHome;
  return <Icon className={className} />;
}
