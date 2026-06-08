"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { signUpMember } from "@/lib/auth/member-signup";
import { signInWithGoogle, signInWithPhoneOtp, verifyPhoneOtp } from "@/lib/auth/social-auth";
import { BLOOMBAY_SOCIAL } from "@/lib/social-links";

export default function MemberJoinPage() {
  const [step, setStep] = useState<"options" | "email" | "phone" | "otp">("options");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle("/member/onboarding");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  async function sendSms() {
    setError("");
    if (!phone.trim()) {
      setError("Enter your phone number with country code.");
      return;
    }
    setLoading(true);
    try {
      await signInWithPhoneOtp(phone);
      setStep("otp");
    } catch (e) {
      setError(e instanceof Error ? e.message : "SMS failed");
    } finally {
      setLoading(false);
    }
  }

  async function confirmOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyPhoneOtp(phone, otp);
      sessionStorage.setItem("gf_phone", phone.trim());
      const bootstrapRes = await fetch("/api/member/profile/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const bootstrapJson = (await bootstrapRes.json()) as { ok?: boolean };
      if (bootstrapJson.ok) {
        void fetch("/api/member/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone.trim(),
            fullName: sessionStorage.getItem("gf_name") ?? "Member",
          }),
        });
      }
      window.location.href = "/member/onboarding";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) {
      setError("Enter your full name.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Enter email and password.");
      return;
    }
    if (!phone.trim()) {
      setError("Enter your phone number.");
      return;
    }
    if (!city.trim() || !neighborhood.trim()) {
      setError("Enter your city and neighborhood.");
      return;
    }
    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUpMember({
        email,
        password,
        fullName,
        phone,
        city,
        neighborhood,
      });
      sessionStorage.setItem("gf_email", email.trim());
      sessionStorage.setItem("gf_name", fullName.trim());
      sessionStorage.setItem("gf_phone", phone.trim());
      window.location.href = "/member/onboarding";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.bg} />

      <a href="/member" style={s.back}>← back</a>

      <div style={s.headingWrap}>
        <motion.p style={s.eyebrow}
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          Create your account
        </motion.p>
        <motion.h1 style={s.heading}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06 }}>
          Welcome to
        </motion.h1>
        <motion.h1 style={s.headingName}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14 }}>
          Bloombay.
        </motion.h1>
        <motion.p style={s.sub}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.22 }}>
          Find your clubs. Meet your people. Build your world.
        </motion.p>
      </div>

      <motion.div style={s.panel}
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}>

        <AnimatePresence mode="wait">
          {step === "options" && (
            <motion.div key="options" style={s.optionsList}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button type="button" style={s.authBtn} disabled={loading}
                onClick={handleGoogle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, s.authBtnHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, s.authBtn)}>
                <GoogleIcon /> Join with Google
              </button>
              <button type="button" style={s.authBtn} disabled={loading}
                onClick={() => { setStep("phone"); setError(""); }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, s.authBtnHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, s.authBtn)}>
                <PhoneIcon /> Join with phone
              </button>
              <button style={s.emailBtn} onClick={() => setStep("email")}>
                Join with email →
              </button>
            </motion.div>
          )}

          {step === "phone" && (
            <motion.div key="phone" style={s.form}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button type="button" style={s.stepBack} onClick={() => { setStep("options"); setError(""); }}>
                ← Other options
              </button>
              <label style={s.field}>
                <span style={s.fieldLabel}>Phone number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 212 555 0100"
                  style={s.input}
                  autoFocus
                  disabled={loading}
                  autoComplete="tel"
                  required
                />
              </label>
              {error && <p style={s.error}>{error}</p>}
              <button type="button" style={loading ? s.submitLoading : s.submit} disabled={loading} onClick={sendSms}>
                {loading ? "Sending code…" : "Send SMS code →"}
              </button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.form key="otp" style={s.form} onSubmit={confirmOtp}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button type="button" style={s.stepBack} onClick={() => { setStep("phone"); setError(""); }}>
                ← Change number
              </button>
              <input value={otp} onChange={e => setOtp(e.target.value)}
                placeholder="6-digit code" style={s.input} autoFocus disabled={loading} />
              {error && <p style={s.error}>{error}</p>}
              <button type="submit" style={loading ? s.submitLoading : s.submit} disabled={loading}>
                {loading ? "Verifying…" : "Verify & continue →"}
              </button>
            </motion.form>
          )}

          {step === "email" && (
            <motion.form key="email" style={s.form} onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button type="button" style={s.stepBack} onClick={() => { setStep("options"); setError(""); }}>
                ← Other options
              </button>
              <label style={s.field}>
                <span style={s.fieldLabel}>Full name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  style={s.input}
                  autoFocus
                  disabled={loading}
                  autoComplete="name"
                  required
                  onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, s.input)}
                />
              </label>
              <label style={s.field}>
                <span style={s.fieldLabel}>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={s.input}
                  disabled={loading}
                  autoComplete="email"
                  required
                  onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, s.input)}
                />
              </label>
              <label style={s.field}>
                <span style={s.fieldLabel}>Phone number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 212 555 0100"
                  style={s.input}
                  disabled={loading}
                  autoComplete="tel"
                  required
                  onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, s.input)}
                />
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                style={s.input}
                disabled={loading}
                autoComplete="address-level2"
                onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, s.input)}
              />
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Neighborhood"
                style={s.input}
                disabled={loading}
                onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, s.input)}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (6+ characters)"
                style={s.input}
                disabled={loading}
                autoComplete="new-password"
                onFocus={(e) => Object.assign(e.currentTarget.style, s.inputFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, s.input)}
              />
              {error && <p style={s.error}>{error}</p>}
              <button type="submit" style={loading ? s.submitLoading : s.submit} disabled={loading}>
                {loading ? "Creating your world…" : "Enter Bloombay →"}
              </button>
              <p style={s.terms}>
                By joining you agree to our <a href="/" style={s.termsLink}>Terms</a> & <a href="/" style={s.termsLink}>Privacy</a>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        <div style={s.panelFooter}>
          <span style={s.switchText}>Already a member?</span>
          <a href="/member/login" style={s.switchLink}>Sign in</a>
        </div>
      </motion.div>

      <div style={s.footerSocials}>
        <a href={BLOOMBAY_SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={s.socialLink}><InstagramIcon /></a>
        <a href={BLOOMBAY_SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" style={s.socialLink}><TikTokIcon /></a>
        <a href={BLOOMBAY_SOCIAL.x} target="_blank" rel="noopener noreferrer" style={s.socialLink}><XIcon /></a>
      </div>
    </div>
  );
}

function GoogleIcon() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>; }
function PhoneIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>; }
function InstagramIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>; }
function TikTokIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.53V6.79a4.86 4.86 0 0 1-1.02-.1z"/></svg>; }
function XIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh", position: "relative",
    display: "flex", flexDirection: "column",
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    overflow: "hidden",
  },
  bg: {
    position: "absolute", inset: 0,
    background: "linear-gradient(160deg, #FF69B4 0%, #ff1a6b 45%, #ff0055 80%, #cc003f 100%)",
    zIndex: 0,
  },
  back: {
    position: "relative", zIndex: 10,
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "14px", fontWeight: 500,
    color: "rgba(255,255,255,0.65)", textDecoration: "none",
    padding: "28px 32px 0",
    display: "inline-block", letterSpacing: "0.04em",
  },
  headingWrap: {
    position: "relative", zIndex: 5,
    flex: 1, padding: "24px 36px 0",
    display: "flex", flexDirection: "column", justifyContent: "flex-end",
    paddingBottom: "8px",
  },
  eyebrow: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "12px", fontWeight: 700,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 18px",
  },
  heading: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "clamp(44px, 11vw, 80px)", fontWeight: 700,
    color: "#ffffff", margin: 0,
    letterSpacing: "-0.04em", lineHeight: 1.0,
  },
  headingName: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "clamp(44px, 11vw, 80px)", fontWeight: 300,
    fontStyle: "italic",
    color: "#0a0a0a", margin: 0,
    letterSpacing: "-0.04em", lineHeight: 1.0,
  },
  sub: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "16px", fontWeight: 300,
    color: "rgba(255,255,255,0.7)", margin: "16px 0 0",
    lineHeight: 1.6,
  },
  panel: {
    position: "relative", zIndex: 10,
    background: "#ffffff",
    borderRadius: "28px 28px 0 0",
    padding: "36px 32px 16px",
    marginTop: "32px",
  },
  optionsList: { display: "flex", flexDirection: "column", gap: "12px" },
  authBtn: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "#fff5f7", border: "1.5px solid #FF69B4",
    borderRadius: "14px", padding: "15px 20px",
    fontSize: "15px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 500, color: "#0a0a0a", cursor: "pointer",
    width: "100%", textAlign: "left" as const, transition: "all 0.18s",
  },
  authBtnHover: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "#ffe4ec", border: "1.5px solid #ff0055",
    borderRadius: "14px", padding: "15px 20px",
    fontSize: "15px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 500, color: "#0a0a0a", cursor: "pointer",
    width: "100%", textAlign: "left" as const, transition: "all 0.18s",
  },
  emailBtn: {
    background: "#ff0055", border: "none",
    borderRadius: "14px", padding: "15px 20px",
    fontSize: "15px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 700, color: "#ffffff", cursor: "pointer",
    width: "100%", textAlign: "left" as const, letterSpacing: "0.02em",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "rgba(10,10,10,0.55)",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  stepBack: {
    background: "none", border: "none",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "13px", color: "rgba(10,10,10,0.4)",
    cursor: "pointer", padding: "0 0 4px", textAlign: "left" as const,
  },
  input: {
    background: "#fff5f7", border: "1.5px solid rgba(255,105,180,0.3)",
    borderRadius: "12px", padding: "15px 18px",
    fontSize: "16px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 300, color: "#0a0a0a", outline: "none",
    width: "100%", boxSizing: "border-box" as const, letterSpacing: "0.01em",
  },
  inputFocus: {
    background: "#fff5f7", border: "1.5px solid #ff0055",
    borderRadius: "12px", padding: "15px 18px",
    fontSize: "16px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 300, color: "#0a0a0a", outline: "none",
    width: "100%", boxSizing: "border-box" as const, letterSpacing: "0.01em",
  },
  error: {
    fontFamily: "var(--font-outfit), sans-serif", fontSize: "13px",
    color: "#ff0055", margin: 0, padding: "10px 14px",
    background: "#fff0f4", borderRadius: "8px",
    border: "1px solid rgba(255,0,85,0.2)",
  },
  submit: {
    background: "#ff0055", border: "none", borderRadius: "12px",
    padding: "16px", fontSize: "16px",
    fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700,
    color: "#ffffff", cursor: "pointer", letterSpacing: "0.04em", width: "100%",
  },
  submitLoading: {
    background: "#ffd6e4", border: "none", borderRadius: "12px",
    padding: "16px", fontSize: "16px",
    fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700,
    color: "rgba(255,0,85,0.5)", cursor: "not-allowed", width: "100%",
  },
  terms: {
    fontFamily: "var(--font-outfit), sans-serif", fontSize: "12px",
    color: "rgba(10,10,10,0.35)", textAlign: "center" as const, margin: 0,
  },
  termsLink: { color: "#FF69B4", textDecoration: "none", fontWeight: 600 },
  panelFooter: {
    padding: "20px 0 12px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    borderTop: "1px solid rgba(255,105,180,0.15)", marginTop: "16px",
  },
  switchText: {
    fontFamily: "var(--font-outfit), sans-serif", fontSize: "14px",
    color: "rgba(10,10,10,0.4)",
  },
  switchLink: {
    fontFamily: "var(--font-outfit), sans-serif", fontSize: "14px",
    fontWeight: 700, color: "#ff0055", textDecoration: "none",
  },
  footerSocials: {
    position: "relative", zIndex: 10, background: "#ffffff",
    padding: "16px 32px 32px",
    display: "flex", gap: "28px", alignItems: "center", justifyContent: "center",
  },
  socialLink: {
    color: "#FF69B4", textDecoration: "none",
    display: "flex", alignItems: "center",
  },
};
