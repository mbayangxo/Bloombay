"use client";

import { useState } from "react";
import { AGE_RANGES, INTERESTS } from "./constants";
import { BBPetalMark } from "./brand-mark";
import { ScatteredPetals } from "./decor";
import { LuxuryInvitationStage } from "./luxury-invitation-stage";
import { SignupTypeScreen } from "./signup-type";
import { WhyJoin } from "./why-join";
import { ClubForm } from "./club-form";
import { PartnerForm } from "./partner-form";
import { FoundingMothers } from "./founding-mothers";
import { submitToWaitlist, type SignupType } from "../../../lib/supabase";

// ── Scenes ────────────────────────────────────────────────────
type Scene =
  | "invite"
  | "signup-type"
  // Member path
  | "why-here"
  | "member-form"
  // Club path
  | "club-form"
  // Partner path
  | "partner-form"
  // Shared
  | "confirmed"
  | "founding-mothers";

// ── Social bar ────────────────────────────────────────────────
const INSTAGRAM = "https://instagram.com/welovebloombay";
const TIKTOK    = "https://tiktok.com/@welovebloombay";

function SocialBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`bb-social-bar ${light ? "bb-social-bar--light" : ""}`}>
      <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="bb-social-link" aria-label="BloomBay on Instagram">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
        @welovebloombay
      </a>
      <span className="bb-social-bar__dot" aria-hidden>·</span>
      <a href={TIKTOK} target="_blank" rel="noopener noreferrer" className="bb-social-link" aria-label="BloomBay on TikTok">
        <svg width="12" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.21 8.21 0 004.8 1.54V6.78a4.85 4.85 0 01-1.03-.09z" />
        </svg>
        @welovebloombay
      </a>
    </div>
  );
}

// ── Confirmed screen ──────────────────────────────────────────
function ConfirmedScreen({
  signupType,
  onFoundingMothers,
  onHome,
}: {
  signupType: SignupType | null;
  onFoundingMothers: () => void;
  onHome: () => void;
}) {
  const messages: Record<SignupType, { headline: string; sub: string }> = {
    member: {
      headline: "We can't wait to bloom with you.",
      sub: "We'll be in touch when BloomBay opens in your city.",
    },
    club_host: {
      headline: "Your club application is in.",
      sub: "We'll review it and reach out within 5 business days. We're so excited to welcome you.",
    },
    partner: {
      headline: "Partnership request received.",
      sub: "Our team will be in touch shortly. Thank you for believing in what we're building.",
    },
  };

  const msg = messages[signupType ?? "member"];

  return (
    <div className="bb-confirmed">
      <ScatteredPetals />
      <div className="bb-confirmed__inner">
        <div className="bb-notebook">
          <div className="bb-notebook__stamp" aria-hidden>
            <div className="bb-notebook__stamp-ring">
              <BBPetalMark size={28} />
            </div>
          </div>
          <p className="bb-notebook__brand font-display">BLOOMBAY</p>
          <p className="bb-notebook__headline font-script">{msg.headline}</p>
          <p className="bb-notebook__line">{msg.sub}</p>
          <p className="bb-notebook__line">See you inside.</p>
          <p className="bb-notebook__sig font-script">BloomBay ♥</p>
        </div>

        <div className="bb-confirmed__social">
          <p className="bb-confirmed__social-label">Follow us while you wait</p>
          <SocialBar light />
        </div>

        <div className="bb-confirmed__actions">
          {signupType === "member" && (
            <button type="button" className="bb-confirmed__fm-btn" onClick={onFoundingMothers}>
              Apply as Founding Mother 👑
            </button>
          )}
          <button
            type="button"
            className="bb-soft-back font-script"
            style={{ color: "rgba(255,255,255,0.8)" }}
            onClick={onHome}
          >
            ← Back to homepage
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Member form ───────────────────────────────────────────────
function MemberForm({
  reasons,
  onBack,
  onDone,
}: {
  reasons: string[];
  onBack: () => void;
  onDone: () => void;
}) {
  const [interests, setInterests]         = useState<string[]>([]);
  const [foundingMother, setFoundingMother] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "", email: "", phone: "",
    neighborhood: "", city: "", country: "",
    ageRange: "31–35", extra: "",
  });

  const toggleInterest = (id: string) =>
    setInterests((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length >= 5 ? p : [...p, id]);

  const handleSubmit = async () => {
    if (!form.email) return;
    setSubmitting(true); setError(null);
    try {
      await submitToWaitlist({
        signup_type: "member",
        first_name: form.firstName,
        email: form.email,
        phone: form.phone,
        neighborhood: form.neighborhood,
        city: form.city,
        country: form.country,
        age_range: form.ageRange,
        reasons,
        interests,
        founding_mother: foundingMother,
        extra_notes: form.extra,
      });
      onDone();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bb-form-screen">
      <div className="bb-step-header">
        <span className="bb-step-badge">3</span>
        <div>
          <p className="bb-page-label">PAGE 3 · TELL US ABOUT YOU</p>
          <h2 className="bb-screen-title font-display">Let&apos;s get to know you a little better.</h2>
          <p className="bb-screen-sub">♥</p>
        </div>
      </div>

      <div className="bb-form-grid">
        <label className="bb-field">
          <span className="bb-field__label">First Name</span>
          <input type="text" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="bb-field__input" placeholder="Your first name" />
        </label>
        <label className="bb-field">
          <span className="bb-field__label">Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="bb-field__input" placeholder="you@email.com" />
        </label>
      </div>

      <label className="bb-field">
        <span className="bb-field__label">Phone Number</span>
        <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="bb-field__input" placeholder="e.g. +1 212 555 0100" />
      </label>

      <div className="bb-form-grid">
        <label className="bb-field">
          <span className="bb-field__label">City</span>
          <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="bb-field__input" placeholder="e.g. New York, London, Lagos" />
        </label>
        <label className="bb-field">
          <span className="bb-field__label">Country</span>
          <input type="text" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="bb-field__input" placeholder="e.g. USA, Nigeria, UK" />
        </label>
      </div>

      <label className="bb-field">
        <span className="bb-field__label">Neighborhood <span className="bb-field__hint">(optional)</span></span>
        <input type="text" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))} className="bb-field__input" placeholder="e.g. West Village, Peckham" />
      </label>

      <div className="bb-field">
        <span className="bb-field__label">Age Range</span>
        <div className="bb-age-row">
          {AGE_RANGES.map((range) => (
            <button key={range} type="button"
              className={`bb-age-pill ${form.ageRange === range ? "bb-age-pill--on" : ""}`}
              onClick={() => setForm((f) => ({ ...f, ageRange: range }))}>
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="bb-field">
        <span className="bb-field__label">What are you hoping to find? <span className="bb-field__hint">(Select up to 5)</span></span>
        <div className="bb-interest-pills">
          {INTERESTS.map((interest) => (
            <button key={interest.id} type="button"
              className={`bb-interest-pill ${interests.includes(interest.id) ? "bb-interest-pill--on" : ""}`}
              onClick={() => toggleInterest(interest.id)}
              aria-pressed={interests.includes(interest.id)}>
              {interest.label}
              {interests.includes(interest.id) && <span className="bb-interest-pill__check" aria-hidden> ✓</span>}
            </button>
          ))}
        </div>
      </div>

      <label className="bb-field">
        <span className="bb-field__label">Anything else? <span className="bb-field__hint">(optional)</span></span>
        <textarea value={form.extra} onChange={(e) => setForm((f) => ({ ...f, extra: e.target.value }))} className="bb-field__input bb-field__textarea" placeholder="Share here..." rows={3} />
      </label>

      <label className="bb-checkbox">
        <input type="checkbox" checked={foundingMother} onChange={(e) => setFoundingMother(e.target.checked)} className="bb-checkbox__input" />
        <span className="bb-checkbox__box" aria-hidden />
        <span>I want to be considered for <strong>Founding Mothers</strong> 👑</span>
      </label>

      {error && <p className="bb-submit-error">{error}</p>}

      <button type="button" className="bb-cta" onClick={handleSubmit}
        disabled={submitting || !form.email}
        style={{ opacity: submitting || !form.email ? 0.6 : 1 }}>
        {submitting ? "Saving…" : "Join the Waitlist →"}
      </button>

      <button type="button" className="bb-soft-back font-script" onClick={onBack}>← back</button>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────
export function BloomSuite() {
  const [scene, setScene]           = useState<Scene>("invite");
  const [signupType, setSignupType] = useState<SignupType | null>(null);
  const [reasons, setReasons]       = useState<string[]>([]);

  const go = (s: Scene) => setScene(s);

  const toggleReason = (id: string) =>
    setReasons((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  // Route "Continue" from signup-type to the right next screen
  const handleSignupContinue = () => {
    if (signupType === "member")    go("why-here");
    if (signupType === "club_host") go("club-form");
    if (signupType === "partner")   go("partner-form");
  };

  // ── Render current scene ──────────────────────────────────
  const renderScene = () => {
    switch (scene) {
      case "invite":
        return (
          <div className="bloom-scene bloom-scene--full">
            <LuxuryInvitationStage onOpen={() => go("signup-type")} />
          </div>
        );

      case "signup-type":
        return (
          <div className="bloom-scene bloom-scene--ivory">
            <SignupTypeScreen
              chosen={signupType}
              onSelect={setSignupType}
              onContinue={handleSignupContinue}
              onBack={() => go("invite")}
            />
          </div>
        );

      case "why-here":
        return (
          <div className="bloom-scene bloom-scene--ivory">
            <WhyJoin
              chosen={reasons}
              onToggle={toggleReason}
              onContinue={() => go("member-form")}
              onBack={() => go("signup-type")}
            />
          </div>
        );

      case "member-form":
        return (
          <div className="bloom-scene bloom-scene--ivory">
            <MemberForm
              reasons={reasons}
              onBack={() => go("why-here")}
              onDone={() => go("confirmed")}
            />
          </div>
        );

      case "club-form":
        return (
          <div className="bloom-scene bloom-scene--ivory">
            <ClubForm
              onBack={() => go("signup-type")}
              onDone={() => go("confirmed")}
            />
          </div>
        );

      case "partner-form":
        return (
          <div className="bloom-scene bloom-scene--ivory">
            <PartnerForm
              onBack={() => go("signup-type")}
              onDone={() => go("confirmed")}
            />
          </div>
        );

      case "confirmed":
        return (
          <div className="bloom-scene bloom-scene--pink">
            <ConfirmedScreen
              signupType={signupType}
              onFoundingMothers={() => go("founding-mothers")}
              onHome={() => go("invite")}
            />
          </div>
        );

      case "founding-mothers":
        return (
          <div className="bloom-scene bloom-scene--blush">
            <FoundingMothers
              onBack={() => go("confirmed")}
              onJoin={() => go("invite")}
            />
          </div>
        );
    }
  };

  return (
    <div className="bloom-root">
      {/* Social bar only on non-invite screens */}
      {scene !== "invite" && (
        <div className="bb-global-social">
          <SocialBar />
        </div>
      )}

      {/* Scene — key forces re-mount + re-animation on each transition */}
      <div key={scene} className="bloom-scene-root">
        {renderScene()}
      </div>
    </div>
  );
}
