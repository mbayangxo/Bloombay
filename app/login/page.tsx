"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    params.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const m = params.get("mode");
    if (m === "signup") setMode("signup");
    else if (m === "login") setMode("login");
  }, [params]);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Check your email to confirm, then sign in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Incorrect email or password.");
      } else {
        const next = params.get("next") || "/dashboard";
        router.push(next);
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: FOREST,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background motif */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          right: "-100px",
          transform: "translateY(-50%)",
          width: 500,
          height: 500,
          opacity: 0.03,
        }}
      >
        <svg viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="160" r="85" fill={GOLD} />
          <ellipse cx="200" cy="160" rx="110" ry="105" fill={GOLD} opacity="0.4" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const rad = (angle * Math.PI) / 180;
            const x = 200 + Math.cos(rad) * 115;
            const y = 160 + Math.sin(rad) * 110;
            return (
              <ellipse key={i} cx={x} cy={y} rx="22" ry="14"
                transform={`rotate(${angle} ${x} ${y})`} fill={GOLD} />
            );
          })}
        </svg>
      </div>

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ display: "inline-block" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.01em",
              }}
            >
              Alkebulan <span style={{ color: GOLD }}>United</span>
            </div>
          </Link>
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            The African Opportunity Engine
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: 4,
            padding: "40px 36px",
            border: `1px solid rgba(201,168,76,0.15)`,
          }}
        >
          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              background: "#f5f0e8",
              borderRadius: 2,
              padding: 3,
              marginBottom: 32,
            }}
          >
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: mode === m ? "white" : "transparent",
                  color: mode === m ? FOREST : "#999",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {mode === "signup" && (
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(139,58,42,0.08)",
                  border: "1px solid rgba(139,58,42,0.2)",
                  borderRadius: 2,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "#8B3A2A",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: "rgba(13,59,46,0.08)",
                  border: "1px solid rgba(13,59,46,0.2)",
                  borderRadius: 2,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: FOREST,
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In →"
                : "Create Account →"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: 13,
              color: "#888",
            }}
          >
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              style={{
                color: GOLD,
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {mode === "login" ? "Create free account" : "Sign in"}
            </button>
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            lineHeight: 1.6,
          }}
        >
          By creating an account you agree that all opportunity information
          should be verified from official sources before applying.
        </p>
      </div>
    </div>
  );
}
