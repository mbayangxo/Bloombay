"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUpCompanyPortal } from "@/lib/auth/session";
import { inviteMatchesEmail, roleLabelForInvite } from "@/lib/auth/portal-invites";
import type { UserRole } from "@/lib/auth/roles";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import "@/app/styles/bb-login.css";

type ValidInvite = {
  role: UserRole;
  email: string | null;
  label: string;
};

function SignupInner() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const [invite, setInvite] = useState<ValidInvite | null>(null);
  const [inviteLoading, setInviteLoading] = useState(Boolean(inviteToken));
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!inviteToken) {
      setInviteLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/auth/portal-invite?token=${encodeURIComponent(inviteToken)}`);
        const data = await res.json() as { valid?: boolean; role?: UserRole; email?: string | null; label?: string };
        if (!active) return;
        if (res.ok && data.valid && data.role) {
          const valid: ValidInvite = {
            role: data.role,
            email: data.email ?? null,
            label: data.label ?? roleLabelForInvite(data.role),
          };
          setInvite(valid);
          if (valid.email) setEmail(valid.email);
        }
      } finally {
        if (active) setInviteLoading(false);
      }
    })();
    return () => { active = false; };
  }, [inviteToken]);

  if (inviteLoading) {
    return <div style={{ minHeight: "100dvh" }} />;
  }

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
    if (!inviteMatchesEmail({ role: invite.role, exp: 0, email: invite.email ?? undefined }, email)) {
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
          You&apos;re joining as <strong>{invite.label}</strong>. After this,
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
