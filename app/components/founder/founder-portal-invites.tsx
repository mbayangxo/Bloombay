"use client";

import { useState } from "react";
import {
  INVITEABLE_ROLES,
  companySignupUrl,
  createPortalInvite,
  encodePortalInvite,
  roleLabelForInvite,
} from "@/lib/auth/portal-invites";
import type { UserRole } from "@/lib/auth/roles";
import { COMPANY_LOGIN, suggestClubMamaEmail } from "@/lib/auth/roles";

export function FounderPortalInvites() {
  const [role, setRole] = useState<UserRole>("club_owner");
  const [email, setEmail] = useState("");
  const [label, setLabel] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function buildLinks() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const payload = createPortalInvite({
      role,
      email: email.trim() || undefined,
      label: label.trim() || undefined,
    });
    const token = encodePortalInvite(payload);
    const signup = `${origin}${companySignupUrl(token)}`;
    const signin = `${origin}${COMPANY_LOGIN}?invite=${encodeURIComponent(token)}`;
    return { signup, signin, token, payload };
  }

  function copy(text: string, key: string) {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const { signup, signin, payload } = buildLinks();

  return (
    <section className="fp-invites">
      <p className="fp-invites__lead">
        Send one link — they create an account with the right role, then always sign in at the{" "}
        <strong>BloomBay company portal</strong>. No role dropdown; email and profile decide where they land.
      </p>
      <form
        className="fp-invites__form"
        onSubmit={(e) => {
          e.preventDefault();
          copy(signup, "signup");
        }}
      >
        <label>
          Portal role
          <select
            className="fp-invites__input"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {INVITEABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {roleLabelForInvite(r)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Email (optional)
          <input
            className="fp-invites__input"
            type="email"
            placeholder={
              role === "club_owner"
                ? suggestClubMamaEmail("morning-run-club")
                : "you@company.com"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {role === "club_owner" ? (
          <p className="fp-invites__hint">
            <strong>Blank email is fine</strong> for an open invite. To reserve one host, use{" "}
            <code>{suggestClubMamaEmail("morning-run-club")}</code> or{" "}
            <code>morning-run-club@bloombay.app</code> — one <code>@bloombay.app</code> domain, club name in
            the address (we recommend <code>mama.clubslug@</code>). Still set role via invite + Supabase
            profile in production.
          </p>
        ) : null}
        <label>
          Label (optional)
          <input
            className="fp-invites__input"
            placeholder="SoHo Run Club Mama"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>
        {role !== "club_owner" ? (
          <p className="fp-invites__hint">
            Invite as <strong>{roleLabelForInvite(payload.role)}</strong> · expires in 14 days
          </p>
        ) : null}
        <div className="fp-invites__actions">
          <button type="submit" className="fp-invites__btn fp-invites__btn--hot">
            {copied === "signup" ? "Copied create-account link" : "Copy create-account link"}
          </button>
          <button
            type="button"
            className="fp-invites__btn"
            onClick={() => copy(signin, "signin")}
          >
            {copied === "signin" ? "Copied sign-in link" : "Copy sign-in link"}
          </button>
        </div>
      </form>
      <div className="fp-invites__preview">
        <p>
          <strong>Create account</strong>
          <br />
          <code className="fp-invites__code">{signup}</code>
        </p>
        <p>
          <strong>Sign in (existing users)</strong>
          <br />
          <code className="fp-invites__code">{signin}</code>
        </p>
      </div>
    </section>
  );
}
