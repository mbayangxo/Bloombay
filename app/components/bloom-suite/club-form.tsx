"use client";

import { useState } from "react";
import { submitToWaitlist } from "../../../lib/supabase";

const PLATFORMS = [
  { id: "fb_group",  label: "Facebook Group", emoji: "👥" },
  { id: "tiktok",   label: "TikTok",          emoji: "🎵" },
  { id: "instagram", label: "Instagram",       emoji: "📸" },
  { id: "youtube",  label: "YouTube",          emoji: "▶️" },
  { id: "other",    label: "Other",            emoji: "✨" },
];

const MEMBER_COUNTS = ["Under 100", "100–500", "500–1K", "1K–5K", "5K+"];

export function ClubForm({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const [platform, setPlatform] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [womenOnly, setWomenOnly] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    phone: "",
    clubName: "",
    city: "",
    country: "",
    extra: "",
  });

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitToWaitlist({
        signup_type: "club_host",
        first_name: form.firstName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        country: form.country,
        club_name: form.clubName,
        club_platform: platform,
        club_member_count: memberCount,
        club_women_only: womenOnly ?? false,
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
    <div className="bb-form-screen bb-club-form">
      <div className="bb-step-header">
        <span className="bb-step-badge" style={{ background: "#8B00CC" }}>2</span>
        <div>
          <p className="bb-page-label">PAGE 2 · ONBOARD YOUR CLUB</p>
          <h2 className="bb-screen-title font-display">
            Bring your club to BloomBay.
          </h2>
          <p className="bb-screen-sub">
            We&apos;re welcoming our first 10–20 founding clubs. Tell us about yours.
          </p>
        </div>
      </div>

      {/* Club info */}
      <div className="bb-section-label">About Your Club</div>

      <label className="bb-field">
        <span className="bb-field__label">Club / Group Name</span>
        <input type="text" value={form.clubName} onChange={f("clubName")} className="bb-field__input" placeholder="e.g. The Thursday Chapter" />
      </label>

      <div className="bb-field">
        <span className="bb-field__label">Where does your community live?</span>
        <div className="bb-platform-grid">
          {PLATFORMS.map((p) => (
            <button key={p.id} type="button"
              className={`bb-platform-btn ${platform === p.id ? "bb-platform-btn--on" : ""}`}
              onClick={() => setPlatform(p.id)}>
              <span className="bb-platform-btn__emoji" aria-hidden>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bb-field">
        <span className="bb-field__label">How many members?</span>
        <div className="bb-age-row">
          {MEMBER_COUNTS.map((c) => (
            <button key={c} type="button"
              className={`bb-age-pill ${memberCount === c ? "bb-age-pill--on" : ""}`}
              onClick={() => setMemberCount(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bb-field">
        <span className="bb-field__label">Is your club women-only?</span>
        <div className="bb-toggle">
          <button type="button"
            className={`bb-toggle__btn ${womenOnly === true ? "bb-toggle__btn--on" : ""}`}
            onClick={() => setWomenOnly(true)}>
            Yes — women only 👩
          </button>
          <button type="button"
            className={`bb-toggle__btn ${womenOnly === false ? "bb-toggle__btn--on" : ""}`}
            onClick={() => setWomenOnly(false)}>
            Mixed / open to all
          </button>
        </div>
        {womenOnly === false && (
          <p className="bb-field__note">
            ℹ️ BloomBay is a women&apos;s community — your club will join as a women&apos;s chapter.
          </p>
        )}
      </div>

      {/* Location */}
      <div className="bb-section-label">Location</div>
      <div className="bb-form-grid">
        <label className="bb-field">
          <span className="bb-field__label">City</span>
          <input type="text" value={form.city} onChange={f("city")} className="bb-field__input" placeholder="e.g. New York, Lagos" />
        </label>
        <label className="bb-field">
          <span className="bb-field__label">Country</span>
          <input type="text" value={form.country} onChange={f("country")} className="bb-field__input" placeholder="e.g. USA, Nigeria" />
        </label>
      </div>

      {/* Contact */}
      <div className="bb-section-label">Your Contact Info</div>
      <div className="bb-form-grid">
        <label className="bb-field">
          <span className="bb-field__label">Your Name</span>
          <input type="text" value={form.firstName} onChange={f("firstName")} className="bb-field__input" placeholder="First name" />
        </label>
        <label className="bb-field">
          <span className="bb-field__label">Phone</span>
          <input type="tel" value={form.phone} onChange={f("phone")} className="bb-field__input" placeholder="+1 212 000 0000" />
        </label>
      </div>
      <label className="bb-field">
        <span className="bb-field__label">Email <span className="bb-field__hint">(required)</span></span>
        <input type="email" value={form.email} onChange={f("email")} className="bb-field__input" placeholder="you@email.com" />
      </label>

      <label className="bb-field">
        <span className="bb-field__label">Anything else you&apos;d like us to know?</span>
        <textarea value={form.extra} onChange={f("extra")} className="bb-field__input bb-field__textarea" placeholder="Tell us about your club, your community, what you need..." rows={3} />
      </label>

      {error && <p className="bb-submit-error">{error}</p>}

      <button type="button" className="bb-cta bb-cta--purple"
        onClick={handleSubmit}
        disabled={submitting || !form.email}
        style={{ opacity: submitting || !form.email ? 0.6 : 1 }}>
        {submitting ? "Submitting…" : "Apply to Onboard My Club →"}
      </button>

      <button type="button" className="bb-soft-back font-script" onClick={onBack}>← back</button>
    </div>
  );
}
