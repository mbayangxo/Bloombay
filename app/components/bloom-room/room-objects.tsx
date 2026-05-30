"use client";

import { useState } from "react";
import { WaxSeal } from "../waitlist-invitation/bb-logo";
import { BLOOM_STAGES, CLUB_CARDS, LIFE_MOMENTS } from "./constants";
import { PaperCardTab, RibbonTab, SealButton } from "./invitation-controls";

/* —— HERO: The invitation —— */

export function HeroInvitation({
  onOpenReply,
  onFoundingMother,
}: {
  onOpenReply: () => void;
  onFoundingMother: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const breakSeal = () => {
    if (open) return;
    setBreaking(true);
    setTimeout(() => {
      setOpen(true);
      setBreaking(false);
    }, 600);
  };

  return (
    <article
      className={`phys-invite mx-auto w-full max-w-[580px] ${open ? "phys-invite--open" : ""} ${breaking ? "phys-invite--breaking" : ""}`}
      aria-label="BloomBay invitation"
    >
      <div className="phys-invite__stack">
        <div className="phys-invite__paper-under" aria-hidden />
        <div className="phys-invite__paper-mid" aria-hidden />
        <div className="phys-invite__liner" aria-hidden />

        <div
          className="phys-invite__flap"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          aria-hidden={open}
        />

        <div className={`phys-invite__cover stationery ${open ? "phys-invite__cover--away" : ""}`}>
          <span className="corner-flourish corner-flourish--tl" />
          <span className="corner-flourish corner-flourish--tr" />
          <span className="corner-flourish corner-flourish--bl" />
          <span className="corner-flourish corner-flourish--br" />
          <div className="phys-invite__cover-inner text-center">
            <p className="font-display text-2xl tracking-[0.15em] text-ink md:text-3xl">
              BloomBay
            </p>
            <p className="mt-2 text-[10px] tracking-[0.38em] text-ink/45">NEW YORK</p>
            <h1 className="font-display mx-auto mt-8 max-w-md text-[1.65rem] font-light leading-snug text-ink md:text-[2rem]">
              The social world women have been missing.
            </h1>
            <p className="mx-auto mt-6 max-w-sm font-display text-lg font-light italic leading-relaxed text-ink/80">
              Walk into a room where someone saved you a seat.
            </p>
            <p className="mx-auto mt-4 max-w-xs text-[11px] font-light tracking-wide text-ink/45">
              Open to see your life inside BloomBay
            </p>
            <div className="my-8">
              <WaxSeal breaking={breaking} onClick={breakSeal} />
            </div>
            <p className="text-[10px] tracking-[0.28em] text-hot-pink">Break the seal</p>
          </div>
        </div>

        <div className={`phys-invite__interior ${open ? "phys-invite__interior--shown" : ""}`}>
          <div className="phys-invite__wing phys-invite__wing--left" aria-hidden />
          <div className="phys-invite__wing phys-invite__wing--right" aria-hidden />
          <div className="phys-invite__crease" aria-hidden />

          <div className="phys-invite__content stationery">
            <span className="corner-flourish corner-flourish--tl" />
            <span className="corner-flourish corner-flourish--tr" />
            <span className="corner-flourish corner-flourish--bl" />
            <span className="corner-flourish corner-flourish--br" />

            <h1 className="font-display text-center text-[1.75rem] font-light leading-snug text-ink md:text-[2.25rem]">
              The social world women have been missing.
            </h1>
            <p className="mx-auto mt-8 max-w-md text-center font-display text-xl font-light italic leading-snug text-ink/85 md:text-2xl">
              What would your life actually look like inside BloomBay?
            </p>

            <ul className="invite-moments mx-auto mt-10 max-w-md space-y-3">
              {LIFE_MOMENTS.map((moment, i) => (
                <li
                  key={moment}
                  className="moment-chip"
                  style={{ animationDelay: `${0.15 + i * 0.07}s` }}
                >
                  <span className="moment-chip__mark" aria-hidden>
                    ✓
                  </span>
                  <span className="font-display text-base font-light leading-snug text-ink md:text-lg">
                    {moment}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-10 max-w-sm border-t border-blush/80 pt-8 text-center text-sm font-light leading-relaxed text-ink/60">
              BloomBay isn&apos;t software. It isn&apos;t a feed.
              <span className="mt-2 block font-display text-base italic text-ink/80">
                It&apos;s a social life — warm, real, and yours in New York.
              </span>
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
              <SealButton onClick={onOpenReply}>Join Waitlist</SealButton>
              <RibbonTab onClick={onFoundingMother}>Apply as Founding Mother</RibbonTab>
            </div>
            <div className="mt-6 flex justify-center">
              <PaperCardTab onClick={onOpenReply}>Reply card →</PaperCardTab>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ReplyCard({
  visible,
  submitted,
  onSubmit,
  onClose,
}: {
  visible: boolean;
  submitted: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", neighborhood: "" });

  if (!visible) return null;

  return (
    <div className="reply-slip absolute left-1/2 top-[calc(100%+1.25rem)] z-30 w-full max-w-[300px] -translate-x-1/2">
      <form
        className="reply-slip__form acrylic"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[10px] tracking-[0.15em] text-ink/35 hover:text-hot-pink"
        >
          Close
        </button>
        <p className="text-[10px] tracking-[0.3em] text-ink/40">Your RSVP</p>
        <p className="font-display mt-1 text-xl text-ink">Join the waitlist</p>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[9px] tracking-[0.2em] text-ink/40">Name</span>
            <input
              className="mt-1 w-full border-0 border-b border-ink/15 bg-transparent py-2 text-sm outline-none focus:border-hot-pink"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={submitted}
            />
          </label>
          <label className="block">
            <span className="text-[9px] tracking-[0.2em] text-ink/40">Email</span>
            <input
              type="email"
              className="mt-1 w-full border-0 border-b border-ink/15 bg-transparent py-2 text-sm outline-none focus:border-hot-pink"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={submitted}
            />
          </label>
          <label className="block">
            <span className="text-[9px] tracking-[0.2em] text-ink/40">Neighborhood</span>
            <input
              className="mt-1 w-full border-0 border-b border-ink/15 bg-transparent py-2 text-sm outline-none focus:border-hot-pink"
              value={form.neighborhood}
              onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))}
              disabled={submitted}
            />
          </label>
        </div>
        {!submitted ? (
          <SealButton type="submit" fullWidth className="mt-6">
            Count Me In
          </SealButton>
        ) : (
          <p className="mt-6 text-center text-[10px] tracking-[0.25em] text-hot-pink">
            RSVP Received
          </p>
        )}
        {submitted && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/50">
            <span className="rotate-[-12deg] border-[3px] border-hot-pink px-4 py-2 font-display text-lg tracking-widest text-hot-pink">
              RSVP RECEIVED
            </span>
          </div>
        )}
      </form>
    </div>
  );
}

/* —— Supporting objects (periphery) —— */

function SupportShell({
  className = "",
  children,
  label,
}: {
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <aside
      className={`support-shell group ${className}`}
      aria-label={label}
    >
      {children}
    </aside>
  );
}

export function ClubStackSupport({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <SupportShell className={className} label="Club invitations">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="support-card support-card--acrylic text-left"
      >
        <p className="text-[9px] tracking-[0.25em] text-ink/40">Club invitations</p>
        <div className="relative mt-3 h-20 w-36">
          {CLUB_CARDS.slice(0, 3).map((c, i) => (
            <span
              key={c.title}
              className="stationery absolute left-0 block w-32 bg-white px-3 py-2 text-xs transition-transform duration-500 group-hover:translate-x-1"
              style={{ top: i * (open ? 14 : 5), zIndex: i, transform: `rotate(${i * 2 - 2}deg)` }}
            >
              {c.title}
            </span>
          ))}
        </div>
        {open && (
          <ul className="mt-3 space-y-1 text-[11px] font-light text-ink/60">
            {CLUB_CARDS.map((c) => (
              <li key={c.title}>{c.title}</li>
            ))}
          </ul>
        )}
      </button>
    </SupportShell>
  );
}

export function BloomMeterSupport({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);
  const s = BLOOM_STAGES[i];
  return (
    <SupportShell className={className} label="Bloom meter">
      <button
        type="button"
        onClick={() => setI((n) => (n + 1) % BLOOM_STAGES.length)}
        className="support-card support-card--acrylic text-center"
      >
        <p className="text-[9px] tracking-[0.25em] text-ink/40">NYC is blooming</p>
        <span className="mt-2 block text-4xl">{s.emoji}</span>
        <p className="mt-1 font-display text-sm text-ink">{s.label}</p>
      </button>
    </SupportShell>
  );
}

export function CityCardSupport({ className = "" }: { className?: string }) {
  return (
    <SupportShell className={className} label="The city">
      <div className="support-card support-card--acrylic">
        <p className="text-[9px] tracking-[0.3em] text-rose-gold">New York</p>
        <p className="font-display mt-2 text-lg text-ink">One city. Many tables.</p>
        <p className="mt-2 text-[11px] font-light leading-relaxed text-ink/55">
          BloomBay grows where women gather — neighborhoods, clubs, nights out.
        </p>
      </div>
    </SupportShell>
  );
}

export function CharterSupport({
  className = "",
  open,
  onOpen,
  onClose,
}: {
  className?: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <SupportShell className={className} label="Founding Mothers charter">
      <div className={`support-card support-card--acrylic charter-support ${open ? "charter-support--open" : ""}`}>
        {!open ? (
          <button type="button" onClick={onOpen} className="w-full text-left">
            <p className="text-[9px] tracking-[0.3em] text-hot-pink">Founding Mothers</p>
            <p className="font-display mt-2 text-base leading-snug text-ink">
              THE FOUNDING MOTHERS OF BLOOMBAY
            </p>
            <p className="mt-2 text-[10px] text-ink/45">Open the charter →</p>
          </button>
        ) : (
          <div>
            <button
              type="button"
              onClick={onClose}
              className="mb-3 text-[10px] tracking-[0.15em] text-ink/40"
            >
              Close
            </button>
            <h2 className="charter-title font-display text-sm leading-snug tracking-wide text-ink">
              THE FOUNDING MOTHERS OF BLOOMBAY
            </h2>
            <p className="mt-3 font-display text-sm italic text-ink/75">
              The first women who help BloomBay bloom.
            </p>
            <ul className="mt-4 space-y-2 text-[11px] font-light text-ink/65">
              <li>Early access</li>
              <li>Private gatherings</li>
              <li>Founding Mother badge</li>
              <li>Name preserved in history</li>
            </ul>
            <p className="mt-4 font-display text-2xl text-hot-pink">100</p>
          </div>
        )}
      </div>
    </SupportShell>
  );
}

export function MembershipPinSupport({ className = "" }: { className?: string }) {
  return (
    <SupportShell className={className} label="Membership">
      <div className="support-card support-card--acrylic flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hot-pink font-display text-xs text-white ring-2 ring-white">
          BB
        </span>
        <div>
          <p className="text-[9px] tracking-[0.2em] text-ink/40">Membership</p>
          <p className="font-display text-sm text-ink">You belong here.</p>
        </div>
      </div>
    </SupportShell>
  );
}
