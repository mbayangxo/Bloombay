"use client";

import { useState } from "react";
import { MemberShell } from "../../components/member-shell";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("support");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/member/safety-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), category, body: message.trim() }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Could not send — try hello@bloombay.com");
        return;
      }
      setSent(true);
      setMessage("");
    } catch {
      setError("Offline — email hello@bloombay.com and we will respond.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MemberShell backHref="/member/settings" backLabel="Settings" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Contact BloomBay</h1>
        <p className="mp-hero__sub">Safety, billing, or anything else — we read every note.</p>
      </div>

      {sent ? (
        <div className="mp-confirm-card" style={{ margin: "1rem" }}>
          <span className="mp-confirm-card__mark">✦</span>
          <h1>Message received</h1>
          <p>Our team will follow up. For urgent safety, also text your host or use in-app report on a gathering.</p>
        </div>
      ) : (
        <form
          className="mp-section"
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem", paddingBottom: "2rem" }}
          onSubmit={(e) => void handleSubmit(e)}
        >
          <input
            className="mp-input"
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="mp-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="support">General support</option>
            <option value="safety">Safety</option>
            <option value="billing">Payments & gatherings</option>
            <option value="clubs">Clubs & hosts</option>
          </select>
          <textarea
            className="mp-input"
            rows={5}
            placeholder="Tell us what's going on…"
            style={{ resize: "vertical" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {error ? (
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--mp-hot)" }}>{error}</p>
          ) : null}
          <button type="submit" className="mp-btn mp-btn--hot mp-btn--block" disabled={busy}>
            {busy ? "Sending…" : "Send message"}
          </button>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--mp-muted)", textAlign: "center" }}>
            hello@bloombay.com · NYC team
          </p>
        </form>
      )}
    </MemberShell>
  );
}
