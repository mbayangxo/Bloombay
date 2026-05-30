"use client";

import { useState } from "react";
import { submitToWaitlist } from "../../../lib/supabase";

const BUSINESS_TYPES = [
  { id: "venue",     label: "Venue / Space",          emoji: "🏛" },
  { id: "brand",     label: "Brand / Product",         emoji: "✨" },
  { id: "organizer", label: "Event Organizer",          emoji: "🎉" },
  { id: "creator",   label: "Content Creator",          emoji: "📱" },
  { id: "other",     label: "Other",                   emoji: "🤝" },
];

export function PartnerForm({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const [bizType, setBizType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    phone: "",
    businessName: "",
    businessSocials: "",
    city: "",
    country: "",
    offering: "",
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
        signup_type: "partner",
        first_name: form.firstName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        country: form.country,
        business_name: form.businessName,
        business_type: bizType,
        business_socials: form.businessSocials,
        offering: form.offering,
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
    <div className="bb-form-screen bb-partner-form">
      <div className="bb-step-header">
        <span className="bb-step-badge" style={{ background: "#C9A27A" }}>2</span>
        <div>
          <p className="bb-page-label">PAGE 2 · PARTNER WITH BLOOMBAY</p>
          <h2 className="bb-screen-title font-display">
            Let&apos;s build something together.
          </h2>
          <p className="bb-screen-sub">
            Venues, brands & organizers — host and grow with BloomBay women.
          </p>
        </div>
      </div>

      {/* Business info */}
      <div className="bb-section-label">About Your Business</div>

      <label className="bb-field">
        <span className="bb-field__label">Business / Organization Name</span>
        <input type="text" value={form.businessName} onChange={f("businessName")} className="bb-field__input" placeholder="e.g. The Garden Room, Lux Events Co." />
      </label>

      <div className="bb-field">
        <span className="bb-field__label">Type of Partnership</span>
        <div className="bb-platform-grid">
          {BUSINESS_TYPES.map((t) => (
            <button key={t.id} type="button"
              className={`bb-platform-btn ${bizType === t.id ? "bb-platform-btn--on" : ""}`}
              onClick={() => setBizType(t.id)}>
              <span className="bb-platform-btn__emoji" aria-hidden>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="bb-field">
        <span className="bb-field__label">What would you offer BloomBay members?</span>
        <textarea value={form.offering} onChange={f("offering")} className="bb-field__input bb-field__textarea"
          placeholder="e.g. Private dining room hire, co-branded events, product gifting, content creation..." rows={3} />
      </label>

      {/* Location */}
      <div className="bb-section-label">Location</div>
      <div className="bb-form-grid">
        <label className="bb-field">
          <span className="bb-field__label">City</span>
          <input type="text" value={form.city} onChange={f("city")} className="bb-field__input" placeholder="e.g. New York, London" />
        </label>
        <label className="bb-field">
          <span className="bb-field__label">Country</span>
          <input type="text" value={form.country} onChange={f("country")} className="bb-field__input" placeholder="e.g. USA, UK" />
        </label>
      </div>

      <label className="bb-field">
        <span className="bb-field__label">Website / Socials</span>
        <input type="text" value={form.businessSocials} onChange={f("businessSocials")} className="bb-field__input" placeholder="e.g. @yourbusiness or yoursite.com" />
      </label>

      {/* Contact */}
      <div className="bb-section-label">Your Contact Info</div>
      <label className="bb-field">
        <span className="bb-field__label">Your Name</span>
        <input type="text" value={form.firstName} onChange={f("firstName")} className="bb-field__input" placeholder="First name" />
      </label>
      <div className="bb-form-grid">
        <label className="bb-field">
          <span className="bb-field__label">Email <span className="bb-field__hint">(required)</span></span>
          <input type="email" value={form.email} onChange={f("email")} className="bb-field__input" placeholder="you@business.com" />
        </label>
        <label className="bb-field">
          <span className="bb-field__label">Phone</span>
          <input type="tel" value={form.phone} onChange={f("phone")} className="bb-field__input" placeholder="+1 212 000 0000" />
        </label>
      </div>

      <label className="bb-field">
        <span className="bb-field__label">Anything else? <span className="bb-field__hint">(optional)</span></span>
        <textarea value={form.extra} onChange={f("extra")} className="bb-field__input bb-field__textarea"
          placeholder="Any other details about your business or what you have in mind..." rows={2} />
      </label>

      {error && <p className="bb-submit-error">{error}</p>}

      <button type="button" className="bb-cta bb-cta--gold"
        onClick={handleSubmit}
        disabled={submitting || !form.email}
        style={{ opacity: submitting || !form.email ? 0.6 : 1 }}>
        {submitting ? "Submitting…" : "Apply as a Partner →"}
      </button>

      <button type="button" className="bb-soft-back font-script" onClick={onBack}>← back</button>
    </div>
  );
}
