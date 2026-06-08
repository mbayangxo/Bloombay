"use client";

import { useEffect, useState } from "react";

type NotificationPrefs = {
  phone: string | null;
  smsNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
};

export function SettingsNotifications() {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    phone: null,
    smsNotifications: false,
    emailNotifications: true,
    pushNotifications: true,
  });
  const [phoneInput, setPhoneInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/member/profile/notifications");
        if (!res.ok) return;
        const json = (await res.json()) as NotificationPrefs;
        setPrefs(json);
        setPhoneInput(json.phone ?? "");
      } catch {
        /* offline — keep defaults */
      }
    })();
  }, []);

  async function save(patch: Partial<NotificationPrefs & { phone: string }>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/member/profile/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: patch.phone !== undefined ? patch.phone : phoneInput,
          smsNotifications: patch.smsNotifications ?? prefs.smsNotifications,
          emailNotifications: patch.emailNotifications ?? prefs.emailNotifications,
          pushNotifications: patch.pushNotifications ?? prefs.pushNotifications,
        }),
      });
      const json = (await res.json()) as NotificationPrefs & { ok?: boolean; error?: string };
      if (!res.ok || json.error) {
        setError(json.error ?? "Could not save");
        return;
      }
      setPrefs(json);
      setPhoneInput(json.phone ?? "");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Offline — try again when you're connected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mp-settings-notifications">
      <p className="mp-settings-notifications__title">Reminders</p>
      <p className="mp-settings-notifications__sub">
        Save your number, opt into SMS, and we&apos;ll text you about seats and calendar plans.
      </p>

      <label className="mp-settings-notifications__field">
        <span className="mp-settings-notifications__label">Phone</span>
        <input
          className="mp-input"
          type="tel"
          placeholder="+1 212 555 0100"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          onBlur={() => {
            if (phoneInput.trim() !== (prefs.phone ?? "")) void save({ phone: phoneInput });
          }}
        />
      </label>

      <label className="mp-settings-notifications__toggle">
        <span>
          <span className="mp-settings-notifications__toggle-label">SMS reminders</span>
          <span className="mp-settings-notifications__toggle-sub">Seat saves &amp; Girl Calendar plans</span>
        </span>
        <input
          type="checkbox"
          checked={prefs.smsNotifications}
          disabled={busy}
          onChange={(e) => void save({ smsNotifications: e.target.checked })}
        />
      </label>

      <label className="mp-settings-notifications__toggle">
        <span>
          <span className="mp-settings-notifications__toggle-label">Email updates</span>
          <span className="mp-settings-notifications__toggle-sub">Welcome notes &amp; gathering mail</span>
        </span>
        <input
          type="checkbox"
          checked={prefs.emailNotifications}
          disabled={busy}
          onChange={(e) => void save({ emailNotifications: e.target.checked })}
        />
      </label>

      <label className="mp-settings-notifications__toggle">
        <span>
          <span className="mp-settings-notifications__toggle-label">Push pings</span>
          <span className="mp-settings-notifications__toggle-sub">In-app nudges when you&apos;re signed in</span>
        </span>
        <input
          type="checkbox"
          checked={prefs.pushNotifications}
          disabled={busy}
          onChange={(e) => void save({ pushNotifications: e.target.checked })}
        />
      </label>

      {error ? <p className="mp-settings-notifications__error">{error}</p> : null}
      {saved ? <p className="mp-settings-notifications__saved">Saved</p> : null}
    </div>
  );
}
