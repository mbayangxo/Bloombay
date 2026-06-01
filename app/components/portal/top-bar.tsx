import Link from "next/link";
import { BBLogo } from "./bb-logo";

export function TopBar({
  location = "Williamsburg",
  day = "Friday",
}: {
  location?: string;
  day?: string;
}) {
  return (
    <header className="flex items-center justify-between px-4 pt-12 pb-3">
      <div className="flex items-center gap-2">
        <BBLogo size={22} />
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--bb-black)" }}
        >
          Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
        </span>
      </div>
      <p className="text-xs text-gray-400 font-medium">
        {day} · {location}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href="/member/notifications"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: "var(--pale-pink-bg)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </Link>
        <div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: "var(--bb-pink)" }}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ background: "var(--mid-pink)" }}
          />
        </div>
      </div>
    </header>
  );
}
