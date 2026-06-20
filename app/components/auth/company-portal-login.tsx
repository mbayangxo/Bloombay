"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortalAccessNotice } from "@/app/components/auth/portal-access-notice";
import { signInCompanyPortal } from "@/lib/auth/session";
import { signOutCompanyPortal } from "@/lib/auth/portal-sign-out";
import {
  decodePortalInvite,
  inviteMatchesEmail,
  roleLabelForInvite,
} from "@/lib/auth/portal-invites";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { COMPANY_LOGIN } from "@/lib/auth/roles";
import "@/app/styles/bb-login.css";

function CompanyLoginInner() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? undefined;
  const inviteToken = searchParams.get("invite");
  const invite = decodePortalInvite(inviteToken);
  const [email, setEmail] = useState(invite?.email ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const notice = searchParams.get("notice");
    if (notice === "confirm_email") {
      setError("Check your email to confirm your account, then sign in here.");
    }
    if (notice === "member_not_company") {
      setError("Member accounts cannot use the company portal. Sign in as a member instead.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Enter your password.");
      return;
    }
    if (invite && email.trim() && !inviteMatchesEmail(invite, email)) {
      setError(`This invite is for ${invite.email}. Use that email or ask your founder for a new link.`);
      return;
    }
    setLoading(true);
    try {
      await signInCompanyPortal(email, password, next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <div className="bb-login bb-login--company bb-login--layout-founder">
      <div className="bb-login__art bb-login__art--founder">
        <Image
          src="/logosbloombay/Vector-1.svg"
          alt=""
          width={48}
          height={72}
          className="bb-login__crest-mark"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <Image
          src={BLOOM_OBJECTS.key}
          alt=""
          width={120}
          height={140}
          unoptimized
          className="bb-login__key"
        />
      </div>
      <div className="bb-login__side">
        <p className="bb-login__eyebrow">BloomBay company portal</p>
        <h1 className="bb-login__title">Sign in</h1>
        <p className="bb-login__sub">
          For BloomBay staff and partners only — founders, Club Mamas, venues, and operations. Community
          members use{" "}
          <Link href="/member/login" style={{ color: "#ffb7ce", fontWeight: 700 }}>
            member sign-in
          </Link>
          .
        </p>

        {invite ? (
          <p className="bb-login__invite-banner">
            Invite: <strong>{invite.label ?? roleLabelForInvite(invite.role)}</strong>
            {invite.email ? ` · use ${invite.email}` : ""}
            {!inviteToken ? null : (
              <>
                {" "}
                ·{" "}
                <Link href={`/company/create?invite=${encodeURIComponent(inviteToken)}`}>Create account</Link>
              </>
            )}
          </p>
        ) : null}

        <div className="bb-login__panel">
          <Suspense fallback={null}>
            <PortalAccessNotice />
          </Suspense>
          <form onSubmit={handleSubmit} className="bb-login__form">
            <input
              type="email"
              className="bb-login__input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
              required={!invite}
            />
            <input
              type="password"
              className="bb-login__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
              required
            />
            {error ? <p className="bb-login__error">{error}</p> : null}
            <button type="submit" className="bb-login__submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in to BloomBay"}
            </button>
          </form>
          <p className="bb-login__footer">
            <button
              type="button"
              className="bb-login__link-btn"
              onClick={() => void signOutCompanyPortal()}
              disabled={loading}
            >
              Sign out
            </button>
            {inviteToken ? (
              <>
                {" · "}
                <Link href={`/company/create?invite=${encodeURIComponent(inviteToken)}`}>Create account</Link>
              </>
            ) : (
              <>
                {" · "}
                <Link href="/member/join">New member (no invite)</Link>
              </>
            )}
          </p>
          <p className="bb-login__portals bb-login__portals--solo">
            <Link href="/portals">About BloomBay portals</Link>
            {" · "}
            <Link href="/">Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function CompanyPortalLogin() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh" }} />}>
      <CompanyLoginInner />
    </Suspense>
  );
}
