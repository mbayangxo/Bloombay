"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAndRedirect } from "@/lib/auth/session";
import { portalLabel, type PortalId } from "@/lib/auth/roles";
import { signOutCompanyPortal } from "@/lib/auth/portal-sign-out";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { LOGIN_CROSS_LINKS, type LoginVariant } from "@/lib/portal-navigation";
import { PortalAccessNotice } from "@/app/components/auth/portal-access-notice";
import { PORTALS } from "@/lib/portal-identity";

export type LoginPortalVariant = LoginVariant;

const VARIANT_PORTAL: Record<LoginPortalVariant, PortalId> = {
  member: "member",
  founder: "founder",
  admin: "admin",
  club_owner: "club_owner",
  partner: "partner",
};

const COPY: Record<
  LoginPortalVariant,
  {
    eyebrow: string;
    title: string;
    sub: string;
    layout: "rose" | "founder" | "ticket" | "venue";
    secure?: boolean;
  }
> = {
  member: {
    eyebrow: `${PORTALS.member.name} portal`,
    title: "Welcome to BloomBay",
    sub: PORTALS.member.tagline,
    layout: "rose",
  },
  founder: {
    eyebrow: `${PORTALS.founder.name} portal`,
    title: "Founder",
    sub: PORTALS.founder.tagline,
    layout: "founder",
    secure: true,
  },
  admin: {
    eyebrow: `${PORTALS.admin.name} portal`,
    title: "Operations",
    sub: PORTALS.admin.tagline,
    layout: "founder",
    secure: true,
  },
  club_owner: {
    eyebrow: `${PORTALS.clubhouse.name} portal`,
    title: "Clubhouse",
    sub: `${PORTALS.clubhouse.tagline} ${PORTALS.clubhouse.notFor}`,
    layout: "ticket",
  },
  partner: {
    eyebrow: `${PORTALS.partner.name} portal`,
    title: "Partner",
    sub: `${PORTALS.partner.tagline} ${PORTALS.partner.notFor}`,
    layout: "venue",
  },
};

function LoginArt({ variant }: { variant: LoginPortalVariant }) {
  if (variant === "member") {
    return (
      <div className="bb-login__art bb-login__art--rose">
        <Image
          src={BLOOM_OBJECTS.bouquet}
          alt=""
          width={200}
          height={220}
          unoptimized
          className="bb-login__bouquet bb-object-wrap bb-object--bouquet-grow"
        />
      </div>
    );
  }
  if (variant === "founder" || variant === "admin") {
    return (
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
    );
  }
  if (variant === "club_owner") {
    return (
      <div className="bb-login__art bb-login__art--ticket">
        <Image
          src={BLOOM_OBJECTS.ticket}
          alt=""
          width={140}
          height={100}
          unoptimized
          className="bb-login__ticket-float"
        />
        <Image
          src={BLOOM_OBJECTS.postcard}
          alt=""
          width={100}
          height={120}
          unoptimized
          className="bb-login__polaroid"
        />
      </div>
    );
  }
  return (
    <div className="bb-login__art bb-login__art--venue">
      <Image
        src="/bloom-assets/refs/tonight.jpg"
        alt=""
        fill
        className="bb-login__venue-img"
        sizes="50vw"
        priority
      />
      <div className="bb-login__venue-shade" />
      <Image
        src={BLOOM_OBJECTS.ticket}
        alt=""
        width={80}
        height={80}
        unoptimized
        className="bb-login__partner-stamp"
      />
    </div>
  );
}

export function BloomBayLogin({
  variant,
  nextPath,
  joinHref,
}: {
  variant: LoginPortalVariant;
  nextPath?: string;
  joinHref?: string;
}) {
  const searchParams = useSearchParams();
  const portal = VARIANT_PORTAL[variant];
  const c = COPY[variant];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "wrong_portal") {
      setError(
        "You're signed in with a different portal. Sign out below, or use the founder dashboard password from .env.local (ADMIN_PASSWORD).",
      );
    }
  }, [searchParams]);

  async function signOutCurrentSession() {
    setLoading(true);
    setError("");
    try {
      await signOutCompanyPortal();
    } catch {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Enter a password.");
      return;
    }
    if (!email && variant !== "founder") {
      setError("Enter email and password.");
      return;
    }
    setLoading(true);
    try {
      if (typeof document !== "undefined") {
        document.cookie = "bb_dev_role=; path=/; max-age=0";
      }
      await signInAndRedirect(email, password, portal, nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <div className={`bb-login bb-login--${variant} bb-login--layout-${c.layout}`}>
      <LoginArt variant={variant} />
      <div className="bb-login__side">
        <p className="bb-login__eyebrow">{c.eyebrow}</p>
        <h1 className="bb-login__title">{c.title}</h1>
        <p className="bb-login__sub">{c.sub}</p>
        {c.secure ? <p className="bb-login__secure">Secure access only</p> : null}

        <div className="bb-login__panel">
          <Suspense fallback={null}>
            <PortalAccessNotice />
          </Suspense>
          <form onSubmit={handleSubmit} className="bb-login__form">
            <input
              type="email"
              className="bb-login__input"
              placeholder={variant === "founder" ? "founder@bloombay.app (optional)" : "you@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
            <input
              type="password"
              className="bb-login__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
            {error ? <p className="bb-login__error">{error}</p> : null}
            <button type="submit" className="bb-login__submit" disabled={loading}>
              {loading ? "Entering…" : "Log in"}
            </button>
          </form>
          <p className="bb-login__footer">
            <button
              type="button"
              className="bb-login__link-btn"
              onClick={() => void signOutCurrentSession()}
              disabled={loading}
            >
              Sign out
            </button>
            {" · "}
            <Link href="/portals">All portals</Link>
          </p>
          <p className="bb-login__hint">
            <Link href="/company">BloomBay company sign-in →</Link> (staff & partners only).
          </p>
          {joinHref ? (
            <p className="bb-login__footer">
              New? <Link href={joinHref}>Create account</Link>
            </p>
          ) : null}
          <p className="bb-login__portals bb-login__portals--solo">
            {LOGIN_CROSS_LINKS[variant].map((link, i) => (
              <span key={link.href}>
                {i > 0 ? " · " : null}
                <Link href={link.href}>{link.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
