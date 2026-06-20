"use client";

import Link from "next/link";
import { useId } from "react";

type DoorVariant =
  | "wall"
  | "moving"
  | "bulletin"
  | "favors"
  | "lost"
  | "magazine"
  | "working"
  | "office";

/** BloomBay palette only: black · hot pink · Barbie pink · white */
const DOOR_STYLE: Record<
  DoorVariant,
  { accent: string; panel: string; frame: string; knob: string }
> = {
  wall: { accent: "#ff0055", panel: "#1a0514", frame: "#ffffff", knob: "#ff0055" },
  moving: { accent: "#ff0055", panel: "#ffffff", frame: "#ffb7ce", knob: "#ff0055" },
  bulletin: { accent: "#ff0055", panel: "#ffe4ec", frame: "#ffffff", knob: "#1a0514" },
  favors: { accent: "#ff0055", panel: "#ffb7ce", frame: "#ffffff", knob: "#1a0514" },
  lost: { accent: "#ff0055", panel: "#ffffff", frame: "#ffe4ec", knob: "#ff0055" },
  magazine: { accent: "#1a0514", panel: "#ffe4ec", frame: "#ffffff", knob: "#1a0514" },
  working: { accent: "#ff0055", panel: "#ffffff", frame: "#ffb7ce", knob: "#1a0514" },
  office: { accent: "#1a0514", panel: "#ffe4ec", frame: "#ffffff", knob: "#ff0055" },
};

/** Labeled door — hallway of the members club. */
export function RoomDoor({
  label,
  tagline,
  variant,
  onEnter,
  href,
}: {
  label: string;
  tagline: string;
  variant: DoorVariant;
  onEnter?: () => void;
  href?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const { accent, panel, frame, knob } = DOOR_STYLE[variant];
  const frameId = `door-frame-${uid}`;

  const inner = (
    <>
      <span className="mp-room-door__plate">
        <span className="mp-room-door__plate-label">{label}</span>
        <span className="mp-room-door__plate-sub">{tagline}</span>
      </span>
      <svg className="mp-room-door__svg" viewBox="0 0 120 200" aria-hidden focusable="false">
        <defs>
          <linearGradient id={frameId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ffb7ce" />
          </linearGradient>
        </defs>
        <rect x="6" y="8" width="108" height="184" rx="6" fill={`url(#${frameId})`} stroke={accent} strokeWidth="3" />
        <rect x="14" y="18" width="92" height="162" rx="4" fill={panel} stroke={accent} strokeWidth="2.5" />
        <rect x="22" y="28" width="76" height="52" rx="2" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.4" />
        <rect x="22" y="88" width="76" height="82" rx="2" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.35" />
        <circle cx="86" cy="100" r="6" fill={knob} stroke={frame} strokeWidth="1.5" />
        <ellipse cx="60" cy="196" rx="32" ry="5" fill="rgba(255, 0, 85, 0.12)" />
      </svg>
      <span className="mp-room-door__enter">Enter</span>
    </>
  );

  const className = `mp-room-door mp-room-door--${variant}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onEnter}>
      {inner}
    </button>
  );
}
