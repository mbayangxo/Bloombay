import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { PinIcon } from "./pin-icon";

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
        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--bb-black)" }}>
          Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
        </span>
      </div>

      <p className="text-xs text-gray-400 font-medium">{day} · {location}</p>

      {/* Icon row: Messages · Pin drops · Plans */}
      <div className="flex items-center gap-1.5">

        {/* Messages */}
        <Link href="/member/messages" aria-label="Messages"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: "var(--pale-pink-bg)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </Link>

        {/* Pin drops */}
        <Link href="/member/pin-drops" aria-label="Pin drops"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: "var(--pale-pink-bg)" }}>
          <PinIcon size={15} stroke="var(--bb-pink)" />
        </Link>

        {/* Plans (tickets / events going to) */}
        <Link href="/member/plans" aria-label="Plans"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: "var(--pale-pink-bg)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
            <line x1="8" y1="4" x2="8" y2="2"/>
            <line x1="16" y1="4" x2="16" y2="2"/>
          </svg>
        </Link>

        {/* Avatar */}
        <Link href="/member/you">
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "var(--bb-pink)" }}>
            <div className="w-5 h-5 rounded-full" style={{ background: "var(--mid-pink)" }} />
          </div>
        </Link>
      </div>
    </header>
  );
}
