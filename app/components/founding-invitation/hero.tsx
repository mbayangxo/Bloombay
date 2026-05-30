"use client";

import { useState } from "react";

const JOINED = 3482;
const GOAL = 5000;
const REMAINING = GOAL - JOINED;

function BloomBaySeal({
  breaking,
  onBreak,
}: {
  breaking: boolean;
  onBreak: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onBreak}
      disabled={breaking}
      aria-label="Break the BloomBay seal"
      className={`relative mx-auto flex h-[5.5rem] w-[5.5rem] flex-col items-center justify-center rounded-full bg-hot-pink text-white transition-transform hover:scale-[1.03] disabled:pointer-events-none ${breaking ? "seal-breaking" : ""}`}
    >
      <span className="font-display text-lg font-medium tracking-[0.25em]">BB</span>
      <span className="mt-0.5 text-[8px] uppercase tracking-[0.35em] opacity-90">
        BloomBay
      </span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-black/45">
        {label}
      </span>
      <input
        type={label === "Email" ? "email" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2 font-light text-black outline-none placeholder:text-black/25 focus:border-hot-pink disabled:opacity-60"
        placeholder=" "
      />
    </label>
  );
}

export function FoundingInvitationHero() {
  const [open, setOpen] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const breakSeal = () => {
    if (open || breaking) return;
    setBreaking(true);
    window.setTimeout(() => {
      setOpen(true);
      setBreaking(false);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex min-h-full w-full items-center justify-center bg-ivory px-4 py-12 md:px-8">
      <div
        className={`relative flex w-full max-w-[1100px] flex-col items-center transition-all duration-700 ${open ? "lg:flex-row lg:items-start lg:justify-center lg:gap-10" : ""}`}
      >
        {/* —— Founding Mothers Invitation —— */}
        <article
          className={`artifact-invite relative w-full max-w-[620px] ${open ? "artifact-invite--open" : ""}`}
          aria-label="Founding Mothers Invitation"
        >
          <div className="artifact-registration artifact-registration--tl" aria-hidden />
          <div className="artifact-registration artifact-registration--tr" aria-hidden />
          <div className="artifact-registration artifact-registration--bl" aria-hidden />
          <div className="artifact-registration artifact-registration--br" aria-hidden />

          <div
            className={`artifact-invite__body bg-white ${open ? "artifact-invite__body--open" : ""}`}
          >
            {!open ? (
              <div className="artifact-invite__closed relative px-10 py-14 text-center md:px-16 md:py-20">
                <div className="artifact-fold-line artifact-fold-line--left" aria-hidden />
                <div className="artifact-fold-line artifact-fold-line--right" aria-hidden />

                <p className="text-[10px] font-medium tracking-[0.55em] text-black">
                  BLOOMBAY SOCIETY
                </p>
                <p className="mt-3 text-[10px] tracking-[0.42em] text-black/55">
                  NEW YORK CHAPTER
                </p>

                <div className="artifact-rule mx-auto my-10 w-32" aria-hidden />

                <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-light leading-[0.92] tracking-[0.08em] text-black">
                  FOUNDING
                  <br />
                  MOTHERS
                </h1>

                <div className="mt-12 space-y-2">
                  <p className="text-[11px] font-medium tracking-[0.38em] text-black">
                    100 WOMEN
                  </p>
                  <p className="text-[11px] font-medium tracking-[0.38em] text-black">
                    ONE CITY
                  </p>
                </div>

                <div className="mt-14">
                  <BloomBaySeal breaking={breaking} onBreak={breakSeal} />
                </div>
                <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-black/40">
                  Break the seal to open
                </p>
              </div>
            ) : (
              <div className="artifact-invite__open">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setSubmitted(false);
                  }}
                  className="absolute right-5 top-5 z-10 text-[10px] uppercase tracking-[0.2em] text-black/35 hover:text-black"
                >
                  Refold
                </button>

                <div className="grid md:grid-cols-3">
                  <section className="artifact-panel artifact-panel--society px-7 py-10 md:py-12">
                    <p className="artifact-panel__label">The Society</p>
                    <p className="font-display mt-5 text-2xl font-light leading-snug text-black">
                      A membership society for women who want belonging —
                      not another app.
                    </p>
                    <p className="mt-5 text-sm font-light leading-relaxed text-black/60">
                      Clubs, gatherings, celebrations, and friendships that
                      feel like home.
                    </p>
                  </section>

                  <section className="artifact-panel artifact-panel--movement px-7 py-10 md:border-x md:border-black/8 md:py-12">
                    <p className="artifact-panel__label artifact-panel__label--accent">
                      The Movement
                    </p>
                    <p className="font-display mt-5 text-2xl font-light leading-snug text-black">
                      One hundred Founding Mothers open BloomBay together.
                    </p>
                    <p className="mt-5 text-sm font-light leading-relaxed text-black/60">
                      You are not applying to an exclusive club. You are
                      answering a call to build the social world we&apos;ve been
                      missing.
                    </p>
                  </section>

                  <section className="artifact-panel artifact-panel--city px-7 py-10 md:py-12">
                    <p className="artifact-panel__label">The City</p>
                    <p className="font-display mt-5 text-2xl font-light leading-snug text-black">
                      New York is already blooming.
                    </p>
                    <p className="mt-5 text-sm font-light leading-relaxed text-black/60">
                      {JOINED.toLocaleString()} women are in.{" "}
                      {REMAINING.toLocaleString()} more until the city-wide
                      welcome at {GOAL.toLocaleString()}.
                    </p>
                  </section>
                </div>

                <div className="border-t border-black/10 bg-ivory px-7 py-6 text-center">
                  <p className="font-display text-lg font-light italic text-black">
                    We saved you a place at the table.
                  </p>
                </div>
              </div>
            )}

            {submitted && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/40"
                aria-hidden
              >
                <span className="artifact-stamp-invite font-display text-2xl uppercase tracking-[0.2em] text-hot-pink md:text-3xl">
                  RSVP Received
                </span>
              </div>
            )}
          </div>
        </article>

        {/* —— Detachable RSVP —— */}
        <aside
          className={`artifact-rsvp w-full max-w-[320px] ${open ? "artifact-rsvp--detached" : "artifact-rsvp--hidden"}`}
          aria-label="RSVP card"
          aria-hidden={!open}
        >
          <form
            onSubmit={handleSubmit}
            className="artifact-rsvp__card relative bg-white px-8 py-9"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-black/45">
              BloomBay Society
            </p>
            <p className="font-display mt-2 text-xl text-black">RSVP</p>
            <div className="artifact-rule my-6 w-16" aria-hidden />

            <div className="space-y-6">
              <Field label="Name" value={name} onChange={setName} disabled={submitted} />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                disabled={submitted}
              />
              <Field
                label="Neighborhood"
                value={neighborhood}
                onChange={setNeighborhood}
                disabled={submitted}
              />
            </div>

            {!submitted ? (
              <button
                type="submit"
                className="mt-10 w-full bg-hot-pink py-3.5 text-[10px] font-medium uppercase tracking-[0.28em] text-white transition-opacity hover:opacity-90"
              >
                Count Me In
              </button>
            ) : (
              <p className="mt-10 text-center text-[10px] uppercase tracking-[0.25em] text-black/45">
                Welcome, Founding Mother
              </p>
            )}

            {submitted && (
              <div
                className="artifact-stamp-rsvp pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-live="polite"
              >
                <span className="rotate-[-14deg] border-[3px] border-hot-pink px-6 py-3 font-display text-xl uppercase tracking-[0.15em] text-hot-pink md:text-2xl">
                  RSVP Received
                </span>
              </div>
            )}
          </form>
        </aside>
      </div>
    </main>
  );
}
