"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUpCompanyPortal } from "@/lib/auth/session";
import {
  decodePortalInvite,
  inviteMatchesEmail,
  roleLabelForInvite,
} from "@/lib/auth/portal-invites";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import "@/app/styles/bb-login.css";

function SignupInner() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const invite = decodePortalInvite(inviteToken);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(invite?.email ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!invite) {
    return (
      <div className="bb-login bb-login--company">
        <div className="bb-login__side" style={{ margin: "auto", maxWidth: 420 }}>
          <h1 className="bb-login__title">Invite required</h1>
          <p className="bb-login__sub">
            Accounts are created from a link your founder sends. Ask for a fresh invite, or sign in if you
            already have an account.
          </p>
          <p className="bb-login__footer">
            <Link href="/company">← Company sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invite) return;
    setError("");
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Fill in name, email, and password.");
      return;
    }
    if (!inviteMatchesEmail(invite, email)) {
      setError(`This invite is locked to ${invite.email}.`);
      return;
    }
    setLoading(true);
    try {
      await signUpCompanyPortal({
        email,
        password,
        fullName,
        inviteRole: invite.role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
      setLoading(false);
    }
  }

  return (
    <div className="bb-login bb-login--company bb-login--layout-founder">
      <div className="bb-login__art bb-login__art--founder">
        <Image src={BLOOM_OBJECTS.postcard} alt="" width={100} height={100} unoptimized className="bb-login__key" />
      </div>
      <div className="bb-login__side">
        <p className="bb-login__eyebrow">BloomBay company portal</p>
        <h1 className="bb-login__title">Create your account</h1>
        <p className="bb-login__sub">
          You&apos;re joining as <strong>{invite.label ?? roleLabelForInvite(invite.role)}</strong>. After this,
          sign in at the company portal — we&apos;ll take you to the right app automatically.
        </p>
        <div className="bb-login__panel">
          <form onSubmit={handleSubmit} className="bb-login__form">
            <input
              className="bb-login__input"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="email"
              className="bb-login__input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading || Boolean(invite.email)}
            />
            <input
              type="password"
              className="bb-login__input"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
            />
            {error ? <p className="bb-login__error">{error}</p> : null}
            <button type="submit" className="bb-login__submit" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="bb-login__footer">
            <Link href={inviteToken ? `/company?invite=${encodeURIComponent(inviteToken)}` : "/company"}>
              Already have an account? Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function CompanyPortalSignup() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh" }} />}>
      <SignupInner />
    </Suspense>
  );
}
