"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export function GMSignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !password.trim()) return;
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: authErr } = await supabase.auth.signUp({ email, password });
    if (authErr) { setError(authErr.message); setLoading(false); return; }

    if (data.user) {
      // Update profile with first name and girlmate_user flag
      await supabase
        .from("profiles")
        .update({ first_name: firstName.trim(), full_name: firstName.trim(), girlmate_user: true })
        .eq("id", data.user.id);
    }

    router.push("/girlmate/home");
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
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>Women-only housing — find your person.</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(255,31,125,0.15)", border: "1px solid rgba(255,31,125,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: PINK }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => void handleSignup(e)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", marginBottom: 7 }}>FIRST NAME</p>
            <input
              className="gm-input"
              type="text"
              placeholder="Your first name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
          </div>

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
              placeholder="6+ characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
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
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Creating account…" : "Create my account →"}
          </button>
        </form>

        {/* Community note */}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          By signing up you agree to our community standards. GirlMate is women-only.
        </p>

        {/* Login link */}
        <div style={{ textAlign: "center", marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Already have an account?{" "}
            <Link href="/girlmate/login" style={{ color: PINK, fontWeight: 700, textDecoration: "none" }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
