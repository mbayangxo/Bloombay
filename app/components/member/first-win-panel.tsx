"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FIRST_WIN_ACTIONS,
  NEW_IN_TOWN_PERKS,
  getNewInTownProgram,
  isNewInTown,
} from "@/lib/new-in-town";

export function FirstWinPanel() {
  const [showNew, setShowNew] = useState(false);
  const [program, setProgram] = useState<ReturnType<typeof getNewInTownProgram>>(null);

  useEffect(() => {
    setShowNew(isNewInTown());
    setProgram(getNewInTownProgram());
  }, []);

  if (showNew && program) {
    return (
      <section className="mp-first-win mp-first-win--new">
        <p className="mp-first-win__kicker">New in town · Day {program.day} of 30</p>
        <h2 className="mp-first-win__title">Your first 30 days in {program.city}</h2>
        <p className="mp-first-win__sub">
          BloomBay isn&apos;t about finishing your profile — it&apos;s your first seat, club, event, and
          another woman within 14 days.
        </p>
        <div className="mp-first-win__perks">
          {NEW_IN_TOWN_PERKS.map((p) => (
            <Link key={p.label} href={p.href} className="mp-first-win__perk">
              <strong>{p.label}</strong>
              <span>{p.sub}</span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mp-first-win">
      <p className="mp-first-win__kicker">First real action · 14 days</p>
      <h2 className="mp-first-win__title">Your next win</h2>
      <div className="mp-first-win__actions">
        {FIRST_WIN_ACTIONS.map((a) => (
          <Link key={a.id} href={a.href} className="mp-first-win__action">
            <span className="mp-first-win__check" aria-hidden />
            {a.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
