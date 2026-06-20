"use client";

import { useEffect, useState } from "react";

type MemberProfile = {
  fullName: string | null;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  email: string | null;
};

export function SettingsProfile() {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/member/profile");
        if (!res.ok) return;
        const json = (await res.json()) as MemberProfile;
        setFullName(json.fullName ?? "");
        setCity(json.city ?? "");
        setState(json.state ?? "");
        setNeighborhood(json.neighborhood ?? "");
        setEmail(json.email);
      } catch {
        const stored = sessionStorage.getItem("gf_name");
        if (stored) setFullName(stored);
      }
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Enter your name.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          city: city.trim(),
          state: state.trim(),
          neighborhood: neighborhood.trim(),
        }),
      });
      const json = (await res.json()) as MemberProfile & { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Could not save profile");
        return;
      }

      setFullName(json.fullName ?? fullName);
      setCity(json.city ?? "");
      setState(json.state ?? "");
      setNeighborhood(json.neighborhood ?? "");
      sessionStorage.setItem("gf_name", json.fullName ?? fullName);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Offline — try again when you're connected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="mp-settings-profile" onSubmit={(e) => void handleSave(e)}>
      <p className="mp-settings-profile__title">Your account</p>
      <p className="mp-settings-profile__sub">Name and where you&apos;re based — shown on your profile.</p>

      {email ? (
        <p className="mp-settings-profile__email">
          Signed in as <span>{email}</span>
        </p>
      ) : null}

      <label className="mp-settings-profile__field">
        <span className="mp-settings-profile__label">Full name</span>
        <input
          className="mp-input"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </label>

      <label className="mp-settings-profile__field">
        <span className="mp-settings-profile__label">City</span>
        <input
          className="mp-input"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="New York"
          autoComplete="address-level2"
        />
      </label>

      <label className="mp-settings-profile__field">
        <span className="mp-settings-profile__label">State</span>
        <input
          className="mp-input"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="New York"
          autoComplete="address-level1"
        />
      </label>

      <label className="mp-settings-profile__field">
        <span className="mp-settings-profile__label">Neighborhood</span>
        <input
          className="mp-input"
          type="text"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          placeholder="Williamsburg"
        />
      </label>

      {error ? <p className="mp-settings-profile__error">{error}</p> : null}
      {saved ? <p className="mp-settings-profile__saved">Saved</p> : null}

      <button type="submit" className="mp-btn mp-btn--hot mp-btn--block" disabled={busy}>
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
