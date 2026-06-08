"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CAREER_ROLE_CATEGORIES,
  displayRoleCategory,
  type CareerRoleCategory,
} from "@/lib/careers-admin";

const INITIAL = {
  first_name: "",
  email: "",
  phone: "",
  role_title: "",
  role_category: "other" as CareerRoleCategory,
  city: "",
  resume_url: "",
  linkedin_url: "",
  portfolio_url: "",
  cover_letter: "",
};

export function CareersApplyForm() {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update<K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setDone(true);
      setForm(INITIAL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="careers-page__success">
        <h2>Thank you — we received your application.</h2>
        <p>
          Our team will review your resume and reach out if there is a fit. You can also
          explore joining BloomBay as a member on the home page.
        </p>
        <Link href="/" className="careers-page__back">
          ← Back to BloomBay
        </Link>
        <button
          type="button"
          className="careers-page__another"
          onClick={() => setDone(false)}
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form className="careers-page__form" onSubmit={handleSubmit}>
      <div className="careers-page__grid">
        <label>
          First name *
          <input
            required
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            autoComplete="given-name"
          />
        </label>
        <label>
          Email *
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
          />
        </label>
        <label>
          City
          <input
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Oakland, CA or Remote"
          />
        </label>
      </div>

      <label>
        Role you are applying for *
        <input
          required
          value={form.role_title}
          onChange={(e) => update("role_title", e.target.value)}
          placeholder="e.g. City curator — Brooklyn"
        />
      </label>

      <label>
        Team *
        <select
          required
          value={form.role_category}
          onChange={(e) => update("role_category", e.target.value as CareerRoleCategory)}
        >
          {CAREER_ROLE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {displayRoleCategory(c)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Resume link *
        <input
          required
          type="url"
          value={form.resume_url}
          onChange={(e) => update("resume_url", e.target.value)}
          placeholder="Google Drive, LinkedIn PDF, Notion, etc."
        />
      </label>

      <div className="careers-page__grid">
        <label>
          LinkedIn
          <input
            type="url"
            value={form.linkedin_url}
            onChange={(e) => update("linkedin_url", e.target.value)}
          />
        </label>
        <label>
          Portfolio / GitHub
          <input
            type="url"
            value={form.portfolio_url}
            onChange={(e) => update("portfolio_url", e.target.value)}
          />
        </label>
      </div>

      <label>
        Cover letter
        <textarea
          rows={6}
          value={form.cover_letter}
          onChange={(e) => update("cover_letter", e.target.value)}
          placeholder="Tell us why BloomBay and what you would bring to the team."
        />
      </label>

      {error ? (
        <p className="careers-page__error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="careers-page__submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
