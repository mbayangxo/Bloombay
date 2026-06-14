"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";
const IVORY = "#fdf4ec";
const INK   = "#111111";

const PLATFORMS = [
  "Facebook Group",
  "WhatsApp Group",
  "Telegram Group",
  "Instagram Community",
  "Discord Server",
  "Website / Company",
  "Other",
];

const GROUP_SIZES = [
  "Under 100 members",
  "100–500 members",
  "500–2,000 members",
  "2,000–10,000 members",
  "10,000+ members",
];

function GMLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="14" r="10" stroke={PINK} strokeWidth="2.2" />
      <path d="M12 13.5c0-1.5 1.2-2.5 2.5-2.5.8 0 1.4.4 1.8.9.4-.5 1-.9 1.8-.9 1.3 0 2.4 1 2.4 2.5 0 1.8-2 3.5-4.2 4.8-2.2-1.3-4.3-3-4.3-4.8z" fill={PINK} />
      <line x1="16" y1="24" x2="16" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="29" x2="20" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

type Field = {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
};

export function GirlMatePartnerPage() {
  const [form, setForm] = useState({
    contact_name: "",
    email:        "",
    group_name:   "",
    platform:     "",
    group_size:   "",
    cities:       "",
    description:  "",
    why_partner:  "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.contact_name || !form.email || !form.group_name || !form.platform) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/girlmate/partner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Something went wrong");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const fields: Field[] = [
    { name: "contact_name", label: "Your name *",        placeholder: "First and last name",    required: true },
    { name: "email",        label: "Your email *",       placeholder: "you@example.com", type: "email", required: true },
    { name: "group_name",   label: "Group / org name *", placeholder: "e.g. NYC Girls Sublets",  required: true },
    { name: "cities",       label: "Cities you serve",   placeholder: "e.g. New York, Atlanta" },
    { name: "description",  label: "What does your group do?", placeholder: "Tell us about your community…", type: "textarea" },
    { name: "why_partner",  label: "Why do you want to partner with GirlMate?", placeholder: "What would this mean for your members?", type: "textarea" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: IVORY, fontFamily: "var(--font-jost)" }}>

      <style>{`
        .gm-partner-nav { display: none; }
        @media (min-width: 768px) { .gm-partner-nav { display: flex; } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253,244,236,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ecddd4" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/girlmate" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <GMLogo size={24} />
            <span style={{ fontWeight: 900, fontSize: "15px", color: INK }}>GirlMate</span>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", color: "#bbb", paddingLeft: 8, borderLeft: "1px solid #e0d8d0" }}>by BloomBay</span>
          </Link>
          <Link href="/girlmate" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "#888", textDecoration: "none" }}>← BROWSE LISTINGS</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: PLUM, padding: "56px 20px 48px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.32em", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>✦ &nbsp;GIRLMATE PARTNERS</p>
          <h1 style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(28px,6vw,46px)", color: "white", lineHeight: 1.05, marginBottom: 14 }}>
            Your group deserves<br />
            <span style={{ color: PINK, fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>a better home.</span>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 500 }}>
            If you run a Facebook group, WhatsApp chat, or sublet company for women — bring your members to GirlMate. Safer, verified, and actually built for them.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section style={{ background: "white", padding: "48px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontWeight: 900, fontSize: "20px", color: INK, marginBottom: 28, textAlign: "center" }}>What partners get</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { icon: "🏷️", title: "Partner badge",        body: "All your members' listings show your group badge — builds trust instantly." },
              { icon: "🔗", title: "Bulk invite link",      body: "One link onboards your entire group. No BloomBay account needed to browse first." },
              { icon: "📊", title: "Group dashboard",       body: "See how many members joined, how many listed, how many matched." },
              { icon: "⚡", title: "Priority review",       body: "Your members' listings get reviewed and published faster." },
              { icon: "🛡️", title: "Safety layer",         body: "Women-only verification protects your group from bad actors." },
              { icon: "✦",  title: "Yande match notes",    body: "Members see AI-powered compatibility when browsing — unique to GirlMate." },
            ].map(item => (
              <div key={item.title} style={{ padding: "18px 16px", background: IVORY, borderRadius: 16, border: "1px solid #ecddd4" }}>
                <span style={{ fontSize: "22px", display: "block", marginBottom: 8 }}>{item.icon}</span>
                <p style={{ fontWeight: 800, fontSize: "12px", color: INK, marginBottom: 5 }}>{item.title}</p>
                <p style={{ fontSize: "11px", color: "#888", lineHeight: 1.55 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section style={{ padding: "48px 20px 72px", background: IVORY }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>

          {done ? (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "white", borderRadius: 24, border: "1px solid #ecddd4" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFE8F1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <span style={{ fontSize: "24px" }}>✦</span>
              </div>
              <h2 style={{ fontWeight: 900, fontSize: "22px", color: INK, marginBottom: 10 }}>Application received.</h2>
              <p style={{ fontSize: "14px", color: "#888", lineHeight: 1.7, marginBottom: 24 }}>
                We review every partner application personally. You&apos;ll hear from us within 48 hours at <strong>{form.email}</strong>.
              </p>
              <Link href="/girlmate" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: 999, background: PINK, color: "white", fontWeight: 800, fontSize: "12px", letterSpacing: "0.1em", textDecoration: "none" }}>
                BROWSE LISTINGS →
              </Link>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 24, border: "1px solid #ecddd4", overflow: "hidden" }}>
              <div style={{ height: 5, background: `linear-gradient(90deg,${PINK},#c4005a)` }} />
              <div style={{ padding: "32px 28px" }}>
                <h2 style={{ fontWeight: 900, fontSize: "20px", color: INK, marginBottom: 6 }}>Apply to become a Partner</h2>
                <p style={{ fontSize: "12px", color: "#aaa", marginBottom: 28 }}>We review every application. Women-only groups only.</p>

                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Contact name + email */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {fields.slice(0, 2).map(field => (
                      <div key={field.name}>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "#555", marginBottom: 6 }}>{field.label.toUpperCase()}</label>
                        <input
                          type={field.type ?? "text"}
                          value={form[field.name as keyof typeof form]}
                          onChange={e => set(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0d8d0", fontSize: "13px", fontFamily: "var(--font-jost)", color: INK, background: IVORY, outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Group name */}
                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "#555", marginBottom: 6 }}>GROUP / ORG NAME *</label>
                    <input
                      type="text"
                      value={form.group_name}
                      onChange={e => set("group_name", e.target.value)}
                      placeholder="e.g. NYC Girls Sublets"
                      required
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0d8d0", fontSize: "13px", fontFamily: "var(--font-jost)", color: INK, background: IVORY, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Platform */}
                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "#555", marginBottom: 8 }}>WHERE DOES YOUR GROUP LIVE? *</label>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                      {PLATFORMS.map(p => (
                        <button key={p} type="button" onClick={() => set("platform", p)} style={{ padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${form.platform === p ? PINK : "#e0d8d0"}`, background: form.platform === p ? "#FFE8F1" : "white", fontSize: "11px", fontWeight: 700, color: form.platform === p ? PINK : "#888", cursor: "pointer", fontFamily: "var(--font-jost)", transition: "all 0.12s" }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group size */}
                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "#555", marginBottom: 8 }}>GROUP SIZE</label>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                      {GROUP_SIZES.map(s => (
                        <button key={s} type="button" onClick={() => set("group_size", s)} style={{ padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${form.group_size === s ? PINK : "#e0d8d0"}`, background: form.group_size === s ? "#FFE8F1" : "white", fontSize: "11px", fontWeight: 700, color: form.group_size === s ? PINK : "#888", cursor: "pointer", fontFamily: "var(--font-jost)", transition: "all 0.12s" }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cities + text fields */}
                  {fields.slice(3).map(field => (
                    <div key={field.name}>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "#555", marginBottom: 6 }}>{field.label.toUpperCase()}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={form[field.name as keyof typeof form]}
                          onChange={e => set(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0d8d0", fontSize: "13px", fontFamily: "var(--font-jost)", color: INK, background: IVORY, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={form[field.name as keyof typeof form]}
                          onChange={e => set(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0d8d0", fontSize: "13px", fontFamily: "var(--font-jost)", color: INK, background: IVORY, outline: "none", boxSizing: "border-box" }}
                        />
                      )}
                    </div>
                  ))}

                  {error && <p style={{ fontSize: "12px", color: "#e53e3e", fontWeight: 600 }}>{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ padding: "16px", borderRadius: 12, border: "none", background: submitting ? "#ccc" : `linear-gradient(135deg,${PINK},#c4005a)`, color: "white", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "13px", letterSpacing: "0.1em", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 4px 18px rgba(255,31,125,0.35)" }}
                  >
                    {submitting ? "SUBMITTING…" : "APPLY TO BECOME A PARTNER →"}
                  </button>

                  <p style={{ fontSize: "11px", color: "#bbb", textAlign: "center", lineHeight: 1.6 }}>
                    Women-only groups only. We review every application personally and respond within 48 hours.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: PLUM, padding: "32px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GMLogo size={20} />
            <span style={{ fontWeight: 900, fontSize: "13px", color: "white" }}>GirlMate</span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", paddingLeft: 8, borderLeft: "1px solid rgba(255,255,255,0.1)" }}>by BloomBay</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ l: "Browse", h: "/girlmate" }, { l: "Safety", h: "/safety" }, { l: "BloomBay", h: "/" }].map(link => (
              <Link key={link.l} href={link.h} style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{link.l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
