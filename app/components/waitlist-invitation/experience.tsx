"use client";

import { useEffect, useRef, useState } from "react";
import { AmbientWorld } from "./ambient-world";
import { FoundingCharter } from "./founding-charter";
import { LuxuryEnvelope } from "./luxury-envelope";
import { AcrylicPanel, RosetteBadge, SatinRibbon } from "./luxury-decor";
import { FloatingPetals } from "./petals";
import { useParallax } from "./use-parallax";
import { WaxSeal } from "./bb-logo";
import {
  AGE_RANGES,
  BLOOM_STAGES,
  BOOK_GENRES,
  HOPE_OPTIONS,
  WHY_OPTIONS,
} from "./constants";

export function WaitlistInvitationExperience() {
  const { mouse, scrollY } = useParallax();
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [sealBreaking, setSealBreaking] = useState(false);
  const [whyId, setWhyId] = useState<string | null>(null);
  const [bookGenre, setBookGenre] = useState<string | null>(null);
  const [hopes, setHopes] = useState<string[]>([]);
  const [bloomStage, setBloomStage] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    phone: "",
    city: "",
    neighborhood: "",
    ageRange: "",
  });

  const section2Ref = useRef<HTMLElement>(null);
  const bloomRef = useRef<HTMLElement>(null);

  const openEnvelope = () => {
    if (envelopeOpen) return;
    setSealBreaking(true);
    window.setTimeout(() => {
      setEnvelopeOpen(true);
      setSealBreaking(false);
      window.setTimeout(() => {
        section2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 700);
    }, 700);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleHope = (label: string) => {
    setHopes((prev) =>
      prev.includes(label) ? prev.filter((h) => h !== label) : [...prev, label],
    );
  };

  useEffect(() => {
    const el = bloomRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let step = 0;
        const interval = window.setInterval(() => {
          setBloomStage(step);
          step += 1;
          if (step > 3) window.clearInterval(interval);
        }, 900);
        obs.disconnect();
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ivory text-ink">
      <AmbientWorld mouse={mouse} scrollY={scrollY} />
      <FloatingPetals />

      {/* —— SECTION 1: Invitation envelope —— */}
      <section className="section-depth relative flex min-h-screen flex-col items-center justify-center px-4 py-24">
        <div
          className="relative z-20 w-full max-w-[720px] transition-transform duration-700"
          style={{
            transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 5}px, 0)`,
          }}
        >
          <LuxuryEnvelope
            open={envelopeOpen}
            sealBreaking={sealBreaking}
            onOpenSeal={openEnvelope}
            onOpenGentle={openEnvelope}
          >
            <h1 className="font-display text-center text-[clamp(1.85rem,4.8vw,3rem)] font-light leading-snug text-ink stationery-emboss">
              The social world women have been missing.
            </h1>
            <p className="mx-auto mt-8 max-w-lg text-center text-base font-light leading-relaxed text-ink/65">
              BloomBay is a social world for women to find friends, clubs,
              gatherings, celebrations, and meaningful real-life connection.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo("about-you")}
                className="luxury-cta luxury-cta--primary min-w-[220px]"
              >
                Join Waitlist
              </button>
              <button
                type="button"
                onClick={() => scrollTo("founding-mothers")}
                className="luxury-cta min-w-[220px]"
              >
                Apply as Founding Mother
              </button>
            </div>
          </LuxuryEnvelope>
        </div>

        <p className="relative z-10 mt-16 text-[10px] uppercase tracking-[0.38em] text-ink/30 transition-colors hover:text-rose-gold">
          Descend into your invitation ↓
        </p>
      </section>

      {/* —— SECTION 2 —— */}
      <section
        ref={section2Ref}
        id="why-here"
        className="section-depth relative border-t border-blush/60 px-4 py-28 md:px-8"
      >
        <RosetteBadge className="absolute -left-2 top-24 hidden lg:block" label="II" />
        <SatinRibbon className="mx-auto mb-12 w-fit">
          <p className="text-center text-[10px] uppercase tracking-[0.35em] text-ink/55">
            Why are you here?
          </p>
        </SatinRibbon>
        <h2 className="text-center font-display text-4xl font-light text-ink md:text-6xl">
          Choose your invitation.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-center text-sm font-light text-ink/55">
          Each card is a door into BloomBay.
        </p>

        <div className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-2">
          {WHY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setWhyId(opt.id);
                if (opt.id !== "book") setBookGenre(null);
              }}
              className={`invite-card acrylic acrylic--hover bg-white/60 px-7 py-6 text-left backdrop-blur-sm ${whyId === opt.id ? "invite-card--selected" : ""}`}
            >
              <span className="font-display text-xl text-ink">{opt.label}</span>
            </button>
          ))}
        </div>

        {whyId === "book" && (
          <AcrylicPanel className="mx-auto mt-14 max-w-3xl px-8 py-10">
            <p className="mb-6 text-center text-[10px] uppercase tracking-[0.3em] text-rose-gold">
              Your literary circle
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {BOOK_GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setBookGenre(genre)}
                  className={`invite-card px-5 py-3 text-sm ${bookGenre === genre ? "invite-card--selected bg-white" : "bg-ivory/90"}`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </AcrylicPanel>
        )}
      </section>

      {/* —— SECTION 3 —— */}
      <section
        id="about-you"
        className="section-depth relative px-4 py-28 md:px-8"
      >
        <div
          className="absolute -right-[10%] top-[20%] hidden w-[200px] md:block"
          style={{
            transform: `translate3d(${mouse.x * -20}px, ${mouse.y * 15}px, 0) rotate(8deg)`,
          }}
          aria-hidden
        >
          <AcrylicPanel hover={false} className="px-6 py-8 opacity-50">
            <p className="font-display text-lg text-ink/25">RSVP</p>
          </AcrylicPanel>
        </div>

        <SatinRibbon className="mx-auto mb-12 w-fit">
          <p className="text-center text-[10px] uppercase tracking-[0.35em] text-ink/55">
            Tell us about you
          </p>
        </SatinRibbon>
        <h2 className="text-center font-display text-4xl font-light md:text-5xl">
          Your story belongs here.
        </h2>

        <div className="stationery relative mx-auto mt-16 max-w-xl bg-white px-10 py-12 md:px-14">
          <span className="corner-flourish corner-flourish--tl" />
          <span className="corner-flourish corner-flourish--tr" />
          <span className="corner-flourish corner-flourish--bl" />
          <span className="corner-flourish corner-flourish--br" />
          <form
            className="space-y-7"
            onSubmit={(e) => {
              e.preventDefault();
              scrollTo("founding-mothers");
            }}
          >
            {(
              [
                ["First Name", "firstName"],
                ["Email", "email"],
                ["Phone Number", "phone"],
                ["City", "city"],
                ["Neighborhood", "neighborhood"],
              ] as const
            ).map(([label, key]) => (
              <label key={key} className="group block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-ink/40 transition-colors group-hover:text-hot-pink">
                  {label}
                </span>
                <input
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="mt-2 w-full border-0 border-b border-ink/12 bg-transparent py-2.5 font-light text-ink outline-none transition-colors focus:border-hot-pink"
                />
              </label>
            ))}

            <label className="group block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink/40">
                Age Range
              </span>
              <select
                value={form.ageRange}
                onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))}
                className="mt-2 w-full border-0 border-b border-ink/12 bg-transparent py-2.5 font-light text-ink outline-none focus:border-hot-pink"
              >
                <option value="">Select</option>
                {AGE_RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="text-[10px] uppercase tracking-[0.22em] text-ink/40">
                What are you hoping to find?
              </legend>
              <div className="mt-5 flex flex-wrap gap-2">
                {HOPE_OPTIONS.map((hope) => (
                  <button
                    key={hope}
                    type="button"
                    onClick={() => toggleHope(hope)}
                    className={`invite-card px-4 py-2.5 text-xs ${hopes.includes(hope) ? "invite-card--selected bg-blush/70" : "bg-ivory"}`}
                  >
                    {hope}
                  </button>
                ))}
              </div>
            </fieldset>

            <button type="submit" className="luxury-cta luxury-cta--primary mt-6 w-full">
              Continue
            </button>
          </form>
        </div>
      </section>

      {/* —— SECTION 4: Founding Mothers —— */}
      <FoundingCharter
        onJoin={() => scrollTo("about-you")}
        onFounding={() => scrollTo("about-you")}
      />

      {/* —— SECTION 5: Bloom Meter —— */}
      <section
        ref={bloomRef}
        id="bloom-meter"
        className="section-depth relative border-t border-blush/50 px-4 py-32 md:px-8"
      >
        <RosetteBadge className="absolute right-[4%] top-20" label="Bloom" />

        <h2 className="text-center font-display text-4xl font-light md:text-6xl">
          Bloom Meter
        </h2>
        <p className="mx-auto mt-5 max-w-md text-center text-sm font-light text-ink/50">
          New York is opening like a flower — feel the city arrive, not the
          numbers.
        </p>

        <AcrylicPanel className="mx-auto mt-20 max-w-2xl px-10 py-14 text-center">
          <div
            className={`flower-bloom-anim text-[5.5rem] md:text-[7rem] ${bloomStage >= 3 ? "bloom-stage-active" : ""}`}
          >
            {BLOOM_STAGES[bloomStage]?.emoji ?? "🌱"}
          </div>
          <p className="mt-10 font-display text-3xl text-ink">
            {BLOOM_STAGES[bloomStage]?.label ?? "Budding"}
          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            {BLOOM_STAGES.map((stage, i) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setBloomStage(i)}
                className={`invite-card flex min-w-[100px] flex-col items-center px-5 py-5 transition-all ${i <= bloomStage ? "invite-card--selected bg-white" : "bg-ivory/60 opacity-60"}`}
              >
                <span className="text-3xl">{stage.emoji}</span>
                <span className="mt-3 text-[9px] uppercase tracking-[0.18em] text-ink/50">
                  {stage.label}
                </span>
              </button>
            ))}
          </div>
        </AcrylicPanel>

        <footer className="mt-28 text-center">
          <WaxSeal size="sm" />
          <p className="mt-5 font-display text-2xl text-ink">BloomBay</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-ink/35">
            Where you bloom.
          </p>
        </footer>
      </section>
    </div>
  );
}
