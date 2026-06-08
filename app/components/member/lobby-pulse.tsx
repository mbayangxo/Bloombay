"use client";

import Link from "next/link";
import type { LobbyTonight } from "@/lib/lobby-pulse";

export function LobbyPulse({ tonight }: { tonight: LobbyTonight }) {
  return (
    <section className="mp-lobby-pulse" aria-label="Tonight in the lobby">
      <div className="mp-lobby-pulse__head">
        <p className="mp-lobby-pulse__kicker">{tonight.headline}</p>
        <p className="mp-lobby-pulse__awake">{tonight.whisper}</p>
        <ul className="mp-lobby-pulse__stats">
          <li>
            <strong>{tonight.noteCount}</strong> new notes
          </li>
          <li>
            <strong>{tonight.roommateCount}</strong> women looking for roommates
          </li>
          <li>
            <strong>{tonight.invitationCount}</strong> brunch &amp; table invitations
          </li>
        </ul>
      </div>

      <div className="mp-lobby-pins" role="list">
        {tonight.pins.map((pin, i) => (
          <Link
            key={pin.id}
            href={pin.href}
            className={`mp-lobby-pin mp-lobby-pin--${pin.variant}`}
            role="listitem"
            style={{ transform: `rotate(${i % 2 === 0 ? -1.2 : 1.1}deg)` }}
          >
            <span className="mp-lobby-pin__label">{pin.label}</span>
            <span className="mp-lobby-pin__line">{pin.line}</span>
            <span className="mp-lobby-pin__meta">{pin.meta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
