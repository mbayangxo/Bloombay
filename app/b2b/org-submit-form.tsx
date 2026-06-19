// FILE: app/b2b/org-submit-form.tsx
"use client";

import { useState } from "react";

const GOLD     = "#C9A84C";
const FOREST   = "#0D3B2E";
const IVORY    = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH    = "#8B3A2A";
const ROYAL    = "#1B3A6B";
const SAND     = "#D4A97A";

export default function OrgSubmitForm() {
  const [orgName, setOrgName]           = useState("");
  const [programName, setProgramName]   = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [description, setDescription]   = useState("");
  const [sourceUrl, setSourceUrl]       = useState("");
  const [orgType, setOrgType]           = useState("");
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/b2b/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName,
          orgType,
          programName,
          contactEmail,
          description,
          sourceUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Submission failed. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid rgba(34,139,70,0.25)",
          borderLeft: "4px solid #22A855",
          borderRadius: 4,
          padding: "40px 36px",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(34,168,85,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#22A855",
              flexShrink: 0,
            }}
          >
            ✓
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              color: FOREST,
              margin: 0,
            }}
          >
            Program Submitted for Review
          </h3>
        </div>
        <p
          style={{
            fontSize: 15,
            color: "#444",
            fontFamily: "var(--font-body)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Your program has been submitted for review. We&apos;ll be in touch within 3–5 business days at{" "}
          <strong style={{ color: FOREST }}>{contactEmail}</strong>.
        </p>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-ui)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: FOREST,
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    border: `1px solid rgba(201,168,76,0.3)`,
    borderRadius: 3,
    fontFamily: "var(--font-body)",
    fontSize: 15,
    color: OBSIDIAN,
    background: IVORY,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 22,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        padding: "40px",
        border: `1px solid rgba(201,168,76,0.2)`,
        borderRadius: 4,
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      <div style={fieldStyle}>
        <label htmlFor="orgName" style={labelStyle}>
          Organization Name
        </label>
        <input
          id="orgName"
          className="form-input"
          type="text"
          required
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="e.g. African Development Bank"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="orgType" style={labelStyle}>
          Organization Type
        </label>
        <select
          id="orgType"
          className="form-select"
          required
          value={orgType}
          onChange={(e) => setOrgType(e.target.value)}
          style={{
            ...inputStyle,
            cursor: "pointer",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230D3B2E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
            paddingRight: 40,
          }}
        >
          <option value="" disabled>
            Select organization type
          </option>
          <option value="development_bank">Development Bank</option>
          <option value="government_ministry">Government Ministry</option>
          <option value="accelerator">Accelerator</option>
          <option value="foundation">Foundation</option>
          <option value="corporation">Corporation</option>
          <option value="diaspora_fund">Diaspora Fund</option>
          <option value="ngo">NGO</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="programName" style={labelStyle}>
          Program Name
        </label>
        <input
          id="programName"
          className="form-input"
          type="text"
          required
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          placeholder="e.g. Youth Entrepreneurship Fund 2026"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="contactEmail" style={labelStyle}>
          Contact Email
        </label>
        <input
          id="contactEmail"
          className="form-input"
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="you@organization.org"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="description" style={labelStyle}>
          Program Description
        </label>
        <textarea
          id="description"
          className="form-input"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe who this program is for, what it offers, and how to apply"
          style={{
            ...inputStyle,
            resize: "vertical",
            minHeight: 110,
          }}
        />
      </div>

      <div style={{ ...fieldStyle, marginBottom: 32 }}>
        <label htmlFor="sourceUrl" style={labelStyle}>
          Program / Application URL
        </label>
        <input
          id="sourceUrl"
          className="form-input"
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://yourorganization.org/apply"
          style={inputStyle}
        />
      </div>

      {error && (
        <div
          style={{
            background: "rgba(139,58,42,0.08)",
            border: "1px solid rgba(139,58,42,0.25)",
            borderRadius: 3,
            padding: "12px 16px",
            marginBottom: 20,
            fontSize: 13,
            color: EARTH,
            fontFamily: "var(--font-ui)",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{
          width: "100%",
          padding: "16px 24px",
          fontSize: 15,
          fontWeight: 700,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: "0.02em",
        }}
      >
        {loading ? "Submitting…" : "Submit for Review →"}
      </button>

      <p
        style={{
          marginTop: 14,
          fontSize: 12,
          color: "#aaa",
          fontFamily: "var(--font-ui)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Free listings reviewed within 3–5 business days. Featured listings go live within 24 hours.
      </p>
    </form>
  );
}
