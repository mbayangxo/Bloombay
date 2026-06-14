"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PINK = "#FF1F7D";
const PLUM = "#1A0A2E";

function GMLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="14" r="10" stroke={PINK} strokeWidth="2.2" />
      <path d="M12 13.5c0-1.5 1.2-2.5 2.5-2.5.8 0 1.4.4 1.8.9.4-.5 1-.9 1.8-.9 1.3 0 2.4 1 2.4 2.5 0 1.8-2 3.5-4.2 4.8-2.2-1.3-4.3-3-4.3-4.8z" fill={PINK} />
      <line x1="16" y1="24" x2="16" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="29" x2="20" y2="29" stroke={PINK} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function GMLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/girlmate/home";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push(redirect);
  }

  return (
    <div style={{ minHeight: "100vh", background: PLUM, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .gm-input {
          width: 100%; padding: 14px 16px; border-radius: 14px;
          background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.12);
          color: white; font-family: var(--font-jost); font-size: 15px; outline: none;
          box-sizing: border-box; transition: border-color 0.15s;
        }
        .gm-input:focus { border-color: rgba(255,31,125,0.5); }
        .gm-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <GMLogo size={48} />
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 26, color: "white", marginTop: 10, lineHeight: 1 }}>GirlMate</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>Welcome back.</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(255,31,125,0.15)", border: "1px solid rgba(255,31,125,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: PINK }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => void handleLogin(e)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", marginBottom: 7 }}>EMAIL</p>
            <input
              className="gm-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", marginBottom: 7 }}>PASSWORD</p>
            <input
              className="gm-input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "15px", borderRadius: 999, border: "none", marginTop: 4,
              background: loading ? "rgba(255,31,125,0.5)" : PINK,
              color: "white", fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.04em",
            }}
          >
            {loading ? "Logging in…" : "Log in →"}
          </button>
        </form>

        {/* Sign up link */}
        <div style={{ textAlign: "center", marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            New to GirlMate?{" "}
            <Link href="/girlmate/signup" style={{ color: PINK, fontWeight: 700, textDecoration: "none" }}>Create an account</Link>
          </p>
        </div>

        {/* Back to public */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link href="/girlmate" style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>
            ← Browse listings
          </Link>
        </div>
      </div>
    </div>
  );
}
