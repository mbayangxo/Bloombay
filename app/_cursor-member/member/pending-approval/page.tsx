"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MemberShell } from "../components/member-shell";

export default function PendingApprovalPage() {
  const router = useRouter();

  // If the user already has a session (they're logged in), let them into home.
  // They ended up here due to the old redirect logic — don't trap them.
  useEffect(() => {
    const verified = sessionStorage.getItem("bb_member_verified") === "1";
    if (verified) {
      router.replace("/member/home");
    }
  }, [router]);

  return (
    <MemberShell showNav={false} hideHeader>
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          textAlign: "center",
          background: "var(--bb-ivory)",
        }}
      >
        {/* Wax seal */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #c9527a, #8b1a3a)",
            boxShadow: "0 4px 16px rgba(139,26,58,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            marginBottom: "2rem",
          }}
        >
          BB
        </div>

        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--bb-hot)",
            marginBottom: "1rem",
          }}
        >
          Almost there
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 8vw, 3rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.95,
            color: "var(--bb-velvet)",
            margin: "0 0 1rem",
          }}
        >
          You&apos;re in<br />the queue
        </h1>

        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "var(--bb-muted)",
            lineHeight: 1.5,
            maxWidth: 320,
            margin: "0 0 2.5rem",
          }}
        >
          Yande is reviewing your profile. You&apos;ll get full access once approved — usually within 24 hours.
        </p>

        {/* Primary: go home now */}
        <Link
          href="/member/home"
          style={{
            display: "block",
            width: "100%",
            maxWidth: 320,
            padding: "0.9rem 1.5rem",
            background: "var(--bb-hot)",
            color: "#fff",
            fontFamily: "var(--font-ui)",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            borderRadius: 999,
            textDecoration: "none",
            textAlign: "center",
            marginBottom: "0.75rem",
            boxShadow: "0 4px 20px rgba(255,0,85,0.25)",
          }}
        >
          Enter BloomBay →
        </Link>

        {/* Secondary: sign in later */}
        <Link
          href="/member/login"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.8rem",
            color: "var(--bb-muted)",
            textDecoration: "none",
          }}
        >
          Sign in later
        </Link>
      </div>
    </MemberShell>
  );
}
