"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { createClient } from "@/lib/supabase/client";

// ─── STATIC DATA ────────────────────────────────────────────────────────────

const GOALS = [
  "Find my people in NYC",
  "Build real friendships",
  "Find my girl group",
  "Get out of my routine",
  "Sober social life",
  "Network with ambitious women",
];

const ERAS = [
  "Building something big",
  "Healing era",
  "Soft life era",
  "Learning & growing",
  "New chapter",
  "Focused & driven",
];

const INTERESTS = [
  "Brunch and dinners",
  "Museums and culture",
  "Gym and fitness",
  "Faith community",
  "Afrobeats and live music",
  "Fashion and style",
  "Building and tech",
  "City walks and cafés",
  "Reading and book clubs",
  "Sober social life",
  "Wellness and healing",
  "Travel and exploring",
];

const LIFESTYLE = [
  "I don't drink",
  "Halal food matters to me",
  "Faith is central to my social life",
  "No smoking please",
  "I have kids",
  "Drug-free spaces only",
];

const SCHEDULE = [
  "Weekday mornings",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend afternoons",
  "Weekend evenings",
  "Spontaneous — just send me things",
];

const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"];

const CLUBS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Dinner Society",  desc: "Girls dinners, reservations, and table talks", count: 312 },
  { id: "22222222-2222-2222-2222-222222222222", name: "Museum Girls",    desc: "Culture, art, and city walks together",         count: 187 },
  { id: "33333333-3333-3333-3333-333333333333", name: "Book Club",       desc: "Reading, reflection, and good conversations",   count: 156 },
  { id: "44444444-4444-4444-4444-444444444444", name: "Wellness Circle", desc: "Pilates, yoga, and feeling good together",      count: 203 },
  { id: "55555555-5555-5555-5555-555555555555", name: "Sunday Walks",    desc: "Morning walks, coffee, and fresh air",          count: 142 },
  { id: "66666666-6666-6666-6666-666666666666", name: "Travel Girls",    desc: "Plan trips, share spots, explore together",     count: 98  },
];

const TOTAL_STEPS = 9; // 0 = welcome, 1–8 = form steps

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function toggleNum(set: Set<number>, i: number): Set<number> {
  const next = new Set(set);
  if (next.has(i)) next.delete(i); else next.add(i);
  return next;
}

function toggleStr(set: Set<string>, v: string): Set<string> {
  const next = new Set(set);
  if (next.has(v)) next.delete(v); else next.add(v);
  return next;
}

// ─── UI ATOMS ────────────────────────────────────────────────────────────────

function Progress({ step }: { step: number }) {
  return (
    <div className="flex gap-1 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full flex-1 transition-all duration-300"
          style={{ background: i <= step ? "var(--bb-pink)" : "#F0E0E8" }}
        />
      ))}
    </div>
  );
}

function PinkBtn({
  children, onClick, disabled, loading, type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 rounded-full font-bold text-base transition-all active:scale-[0.98]"
      style={{
        background: disabled || loading ? "#FFB6D0" : "var(--bb-pink)",
        color: "white",
        cursor: disabled || loading ? "default" : "pointer",
      }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          Working…
        </span>
      ) : children}
    </button>
  );
}

function Field({
  label, children, hint,
}: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text",
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent transition-colors"
      style={{ color: "var(--bb-black)" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
      onBlur={(e) => (e.target.style.borderColor = "transparent")}
    />
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style={{ background: "#FFE0EE", color: "#c40060" }}>
      {msg}
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5 mt-6 first:mt-0">
      <h3 className="text-xl font-bold" style={{ color: "var(--bb-black)" }}>{title}</h3>
      {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function MultiGrid({ items, selected, toggle }: { items: string[]; selected: Set<number>; toggle: (i: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-2">
      {items.map((label, i) => {
        const on = selected.has(i);
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="rounded-2xl px-3 py-3.5 text-sm font-medium text-left transition-all active:scale-[0.98]"
            style={{
              background: on ? "var(--light-pink)" : "white",
              border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
              color: "var(--bb-black)",
            }}
          >
            {on && <span className="font-bold mr-1.5" style={{ color: "var(--bb-pink)" }}>✓</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({ label, on, toggle }: { label: string; on: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="w-full rounded-2xl px-4 py-3.5 flex items-center justify-between text-left transition-all"
      style={{
        background: on ? "var(--light-pink)" : "white",
        border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
      }}
    >
      <span className="text-sm font-medium" style={{ color: "var(--bb-black)" }}>{label}</span>
      {on && <span className="font-bold text-sm" style={{ color: "var(--bb-pink)" }}>✓</span>}
    </button>
  );
}

// ─── SCATTERED BLOB CHIPS (Onboarding interest selector) ─────────────────────

const BLOB_COLORS = [
  { bg: "#FF1F7D", text: "white" },
  { bg: "#FF69B4", text: "white" },
  { bg: "#FFB6D0", text: "#c40060" },
  { bg: "#FFC2D4", text: "#8B0040" },
  { bg: "#FF1F7D", text: "white" },
  { bg: "#FF69B4", text: "white" },
  { bg: "#FFD6E8", text: "#c40060" },
  { bg: "#FFB6D0", text: "#8B0040" },
];
const BLOB_ROTATIONS = [-4, 3, -6, 5, -2, 7, -5, 2, -3, 6, -1, 4];
const BLOB_OFFSETS   = [0, 18, -10, 28, -18, 8, -28, 14, -4, 22, -14, 4];
const BLOB_ICONS     = ["🌸", "✿", "🌷", "✦", "🌺", "✿", "🌸", "✦", "🌷", "🌸", "✿", "🌺"];

function ScatteredBlobs({ items, selected, toggle }: { items: string[]; selected: Set<number>; toggle: (i: number) => void }) {
  const [shaking, setShaking] = React.useState<number | null>(null);

  function handlePress(i: number) {
    toggle(i);
    setShaking(i);
    setTimeout(() => setShaking(null), 550);
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "4px 0 12px" }}>
        {items.map((label, i) => {
          const on = selected.has(i);
          const col = BLOB_COLORS[i % BLOB_COLORS.length];
          const rot = BLOB_ROTATIONS[i % BLOB_ROTATIONS.length];
          const dx  = BLOB_OFFSETS[i % BLOB_OFFSETS.length];
          const icon = BLOB_ICONS[i % BLOB_ICONS.length];
          return (
            <button
              key={i}
              onClick={() => handlePress(i)}
              style={{
                borderRadius: "100px",
                padding: "10px 18px",
                background: on ? col.bg : "white",
                color: on ? col.text : "#c40060",
                border: `2px solid ${on ? col.bg : "#FFB6D0"}`,
                fontWeight: on ? 700 : 500,
                fontSize: "13px",
                transform: `rotate(${rot}deg) translateX(${dx}px)`,
                animation: shaking === i ? "blobShake 0.55s ease-in-out" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: on ? `0 4px 16px ${col.bg}55` : "0 2px 8px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "11px", lineHeight: 1 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>
      <style>{`
        @keyframes blobShake {
          0%   { transform: rotate(var(--r, 0deg)) scale(1.0); }
          12%  { transform: rotate(calc(var(--r, 0deg) + 14deg)) scale(1.18); }
          25%  { transform: rotate(calc(var(--r, 0deg) - 12deg)) scale(1.18); }
          38%  { transform: rotate(calc(var(--r, 0deg) + 8deg)) scale(1.12); }
          50%  { transform: rotate(calc(var(--r, 0deg) - 5deg)) scale(1.07); }
          65%  { transform: rotate(calc(var(--r, 0deg) + 3deg)) scale(1.04); }
          80%  { transform: rotate(calc(var(--r, 0deg) - 1deg)) scale(1.02); }
          100% { transform: rotate(var(--r, 0deg)) scale(1.0); }
        }
      `}</style>
    </>
  );
}

// ─── WELCOME SPLASH ───────────────────────────────────────────────────────────

function WelcomeSplash({ onStart }: { onStart: () => void }) {
  const [agreeTerms,   setAgreeTerms]   = React.useState(false);
  const [agreePrivacy, setAgreePrivacy] = React.useState(false);
  const [agreeRules,   setAgreeRules]   = React.useState(false);
  const [agreeAge,     setAgreeAge]     = React.useState(false);
  const allAgreed = agreeTerms && agreePrivacy && agreeRules && agreeAge;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: "#FF1F7D" }}>

      {/* Decorative circles */}
      <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "60px", right: "20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "200px", left: "-80px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(0,0,0,0.06)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ position: "absolute", top: "52px", left: "24px", zIndex: 10 }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "22px", color: "white", letterSpacing: "0.06em" }}>BB</span>
      </div>

      {/* Main text hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "24px", paddingRight: "24px", paddingTop: "80px" }}>
        <p style={{ fontWeight: 500, fontSize: "32px", color: "white", lineHeight: 1.1, margin: "0 0 4px" }}>
          it&apos;s a
        </p>
        <p style={{ fontWeight: 900, fontSize: "72px", color: "#111", lineHeight: 0.9, margin: "0 0 0" }}>
          girls
        </p>
        <p style={{ fontWeight: 900, fontSize: "72px", color: "#111", lineHeight: 0.9, margin: "0 0 4px" }}>
          world,
        </p>
        {/* Outlined/stroke text */}
        <p style={{
          fontWeight: 900, fontSize: "64px", lineHeight: 0.95, margin: "0 0 20px",
          WebkitTextStroke: "3px white",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}>
          wear it.
        </p>

        {/* Divider */}
        <div style={{ width: "40px", height: "3px", background: "rgba(255,255,255,0.4)", borderRadius: "2px", marginBottom: "16px" }} />

        {/* Secondary line */}
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "22px", color: "rgba(255,255,255,0.82)", lineHeight: 1.3 }}>
          women<br/>are gathering.
        </p>
      </div>

      {/* Bottom strip */}
      <div style={{ background: "rgba(0,0,0,0.22)", padding: "20px 24px", paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))" }}>
        {[
          { key: "terms",   state: agreeTerms,   set: setAgreeTerms,   label: "I agree to the Terms of Service" },
          { key: "privacy", state: agreePrivacy, set: setAgreePrivacy, label: "I agree to the Privacy Policy"    },
          { key: "rules",   state: agreeRules,   set: setAgreeRules,   label: "I agree to the Community Rules"  },
          { key: "age",     state: agreeAge,     set: setAgreeAge,     label: "I am 18 or older"                },
        ].map(({ key, state, set, label }) => (
          <button key={key} onClick={() => set((v: boolean) => !v)}
            className="w-full flex items-center gap-3 py-2 text-left"
            style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div style={{
              width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0,
              background: state ? "white" : "rgba(255,255,255,0.15)",
              border: `2px solid ${state ? "white" : "rgba(255,255,255,0.35)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {state && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8L9 3" stroke="#FF1F7D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.78)", fontWeight: 500 }}>{label}</span>
          </button>
        ))}

        <button
          onClick={allAgreed ? onStart : undefined}
          style={{
            marginTop: "14px", width: "100%", padding: "16px",
            borderRadius: "100px",
            background: allAgreed ? "white" : "rgba(255,255,255,0.3)",
            color: allAgreed ? "#FF1F7D" : "rgba(255,255,255,0.5)",
            fontWeight: 800, fontSize: "15px", letterSpacing: "0.06em",
            cursor: allAgreed ? "pointer" : "default",
            border: "none", transition: "all 0.2s",
          }}>
          LET&apos;S START →
        </button>

        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
          already a member?{" "}
          <a href="/member/login" style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>sign in</a>
        </p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function OnboardFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2
  const [firstName, setFirstName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");

  // Step 3 – avatar
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Step 4 – selfie
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  // Step 5 – location
  const [borough, setBorough] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  // Step 6 – vibe
  const [goals, setGoals] = useState<Set<number>>(new Set());
  const [era, setEra] = useState<number | null>(null);
  const [interests, setInterests] = useState<Set<number>>(new Set());
  const [lifestyle, setLifestyle] = useState<Set<number>>(new Set());
  const [schedule, setSchedule] = useState<Set<number>>(new Set());

  // Step 7 – clubs
  const [selectedClubs, setSelectedClubs] = useState<Set<string>>(new Set());

  // Step 8 – invites
  const [inviteEmails, setInviteEmails] = useState(["", "", ""]);

  // ── helpers ──────────────────────────────────────────────────────
  function advance() { setStep((s) => s + 1); setError(null); }
  function goBack()  { setStep((s) => s - 1); setError(null); }

  async function getUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // ── STEP 1 – create account ───────────────────────────────────────
  async function handleCreateAccount() {
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords don't match.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) throw err;
      if (!data.user) throw new Error("Sign-up failed — please try again.");
      if (!data.session) {
        // Email confirmation required
        setEmailVerificationSent(true);
        return;
      }
      advance();
    } catch (e: unknown) {
      setError((e as Error).message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 2 – save profile basics ─────────────────────────────────
  async function handleSaveProfile() {
    if (!firstName.trim()) return setError("Enter your first name.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const { error: err } = await supabase
        .from("profiles")
        .update({ first_name: firstName.trim(), bio: bio.trim() || null, age: age ? parseInt(age) : null })
        .eq("id", user.id);
      if (err) throw err;
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 3 – upload avatar ────────────────────────────────────────
  async function handleUploadAvatar() {
    setLoading(true);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() ?? "jpg";
        const { data: upload, error: upErr } = await supabase.storage
          .from("avatars")
          .upload(`${user.id}/avatar.${ext}`, avatarFile, { upsert: true });
        if (!upErr && upload) {
          const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(upload.path);
          await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", user.id);
        }
      }
      advance();
    } catch {
      // Storage may not be configured yet — skip gracefully
      advance();
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 4 – selfie verification ──────────────────────────────────
  async function handleSelfieVerification() {
    setLoading(true);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      if (selfieFile) {
        const ext = selfieFile.name.split(".").pop() ?? "jpg";
        const { data: upload, error: upErr } = await supabase.storage
          .from("verification")
          .upload(`${user.id}/selfie.${ext}`, selfieFile, { upsert: true });
        if (!upErr && upload) {
          const { data: urlData } = supabase.storage.from("verification").getPublicUrl(upload.path);
          await supabase.from("profiles").update({
            verification_photo_url: urlData.publicUrl,
            verification_status: "pending",
          }).eq("id", user.id);
        } else {
          // Storage not ready — mark pending anyway
          await supabase.from("profiles").update({ verification_status: "pending" }).eq("id", user.id);
        }
      }
      advance();
    } catch {
      advance();
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 5 – save location ────────────────────────────────────────
  async function handleSaveLocation() {
    if (!neighborhood.trim()) return setError("Tell us your neighborhood.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const { error: err } = await supabase
        .from("profiles")
        .update({ city: "New York", borough: borough || null, neighborhood: neighborhood.trim() })
        .eq("id", user.id);
      if (err) throw err;
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 6 – save vibe ────────────────────────────────────────────
  async function handleSaveVibe() {
    if (goals.size === 0) return setError("Pick at least one goal.");
    if (interests.size === 0) return setError("Pick at least one interest.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const { error: err } = await supabase.from("profiles").update({
        goals:      Array.from(goals).map((i) => GOALS[i]),
        era:        era !== null ? ERAS[era] : null,
        interests:  Array.from(interests).map((i) => INTERESTS[i]),
        lifestyle:  Array.from(lifestyle).map((i) => LIFESTYLE[i]),
        schedule:   Array.from(schedule).map((i) => SCHEDULE[i]),
      }).eq("id", user.id);
      if (err) throw err;
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 7 – join clubs ───────────────────────────────────────────
  async function handleJoinClubs() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      if (selectedClubs.size > 0) {
        const rows = Array.from(selectedClubs).map((club_id) => ({ user_id: user.id, club_id }));
        const { error: err } = await supabase.from("user_clubs").upsert(rows, { onConflict: "user_id,club_id" });
        if (err) throw err;
      }
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 8 – invites + complete ───────────────────────────────────
  async function handleComplete() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const valid = inviteEmails.filter((e) => e.includes("@"));
      if (valid.length > 0) {
        await supabase.from("invites").insert(valid.map((e) => ({ inviter_id: user.id, email: e })));
      }
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
      router.push("/member/home");
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────

  // Step 0: full-screen splash before any form steps
  if (step === 0 && !emailVerificationSent) {
    return <WelcomeSplash onStart={advance} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="max-w-md mx-auto w-full px-5 pt-12 pb-20">
        {step > 0 && !emailVerificationSent && (
          <button
            onClick={goBack}
            className="mb-5 text-sm font-medium text-gray-400 flex items-center gap-1 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
        )}

        <Progress step={step} />

        {/* ── EMAIL VERIFICATION PENDING ──────────────────────────────── */}
        {emailVerificationSent && (
          <div className="flex flex-col items-center text-center pt-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--light-pink)" }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="8" width="32" height="24" rx="4" stroke="var(--bb-pink)" strokeWidth="2" />
                <path d="M4 12L20 24L36 12" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--bb-black)" }}>Check your email</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              We sent a confirmation link to <strong style={{ color: "var(--bb-black)" }}>{email}</strong>.
              Click it to verify your account, then come back to continue.
            </p>
            <div className="bg-white rounded-3xl p-4 mb-6 w-full text-left">
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>Tip: check your spam folder</p>
              <p className="text-xs text-gray-400">After verifying, click below to continue your sign-up.</p>
            </div>
            <PinkBtn
              onClick={async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.email_confirmed_at) {
                  setEmailVerificationSent(false);
                  advance();
                } else {
                  setError("Email not yet confirmed. Check your inbox.");
                }
              }}
            >
              I&apos;ve confirmed my email →
            </PinkBtn>
            {error && <ErrorBanner msg={error} />}
            <button onClick={() => setEmailVerificationSent(false)} className="mt-3 text-sm text-gray-400">
              Use a different email
            </button>
          </div>
        )}

        {/* ── STEP 1: Create Account ───────────────────────────────────── */}
        {step === 1 && !emailVerificationSent && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 1 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Create your account.</h2>
            <p className="text-gray-400 text-sm mb-7">You&apos;re almost in.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-4 mb-8">
              <Field label="Email">
                <TextInput value={email} onChange={setEmail} placeholder="your@email.com" type="email" />
              </Field>
              <Field label="Password" hint="Minimum 8 characters">
                <TextInput value={password} onChange={setPassword} placeholder="••••••••" type="password" />
              </Field>
              <Field label="Confirm Password">
                <TextInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Same password again" type="password" />
              </Field>
            </div>

            <PinkBtn onClick={handleCreateAccount} loading={loading} disabled={!email || !password || !confirmPassword}>
              Create account →
            </PinkBtn>
            <p className="text-center text-xs text-gray-400 mt-4">
              Already a member?{" "}
              <Link href="/member/login" className="font-semibold" style={{ color: "var(--bb-pink)" }}>
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Basic Profile ────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 2 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Tell us about you.</h2>
            <p className="text-gray-400 text-sm mb-7">This is how women will know you inside BloomBay.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-4 mb-8">
              <Field label="Your first name">
                <TextInput value={firstName} onChange={setFirstName} placeholder="Maya" />
              </Field>
              <Field label="Age" hint="Must be 18+">
                <TextInput value={age} onChange={setAge} placeholder="28" type="number" />
              </Field>
              <Field label="About you" hint="Optional — 200 characters max">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I&#39;m a creative director who loves brunch and architecture. Always down for an impromptu gallery walk."
                  rows={3}
                  maxLength={200}
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent transition-colors resize-none"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                <p className="text-xs text-gray-400 text-right">{bio.length}/200</p>
              </Field>
            </div>

            <PinkBtn onClick={handleSaveProfile} loading={loading} disabled={!firstName}>
              Continue →
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 3: Upload Photo ──────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 3 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Add your photo.</h2>
            <p className="text-gray-400 text-sm mb-7">Women connect more when they can see each other.</p>

            <div className="flex flex-col items-center mb-7">
              <div
                className="relative w-36 h-36 rounded-full overflow-hidden cursor-pointer mb-4"
                style={{ border: `4px solid var(--bb-pink)` }}
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Your photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ background: "var(--light-pink)" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <p className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>TAP TO ADD</p>
                  </div>
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setAvatarFile(f);
                  setAvatarPreview(URL.createObjectURL(f));
                }}
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all active:scale-95"
                style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
              >
                {avatarPreview ? "Change photo" : "Choose a photo"}
              </button>
            </div>

            <div className="bg-white rounded-3xl p-4 mb-8">
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>Clear face, no filters needed.</p>
              <p className="text-xs text-gray-400">Just you, naturally. This helps women feel safe connecting with you.</p>
            </div>

            <PinkBtn onClick={handleUploadAvatar} loading={loading}>
              {avatarPreview ? "Looks good, continue →" : "Skip for now →"}
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 4: Selfie Verification ───────────────────────────────── */}
        {step === 4 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 4 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Verify it&apos;s you.</h2>
            <p className="text-gray-400 text-sm mb-5">BloomBay is women only. We check every single member.</p>

            <div className="rounded-3xl p-4 mb-5" style={{ background: "var(--light-pink)" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>Live selfie verification</p>
              <p className="text-xs leading-relaxed" style={{ color: "#9e6070" }}>
                Take a selfie holding a piece of paper with today&apos;s date written on it, or your phone screen showing the date.
                We&apos;ll review it within 24 hours. You can still explore BloomBay while we verify.
              </p>
            </div>

            <div
              className="relative w-full rounded-3xl overflow-hidden cursor-pointer mb-5"
              style={{ height: "220px", background: selfiePreview ? undefined : "#F5EDF0", border: "2px dashed var(--bb-pink)" }}
              onClick={() => selfieInputRef.current?.click()}
            >
              {selfiePreview ? (
                <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="1.3">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <p className="text-sm font-bold" style={{ color: "var(--bb-pink)" }}>Take your selfie</p>
                  <p className="text-xs text-gray-400 text-center px-8">Tap to open camera. Front-facing camera will open on mobile.</p>
                </div>
              )}
            </div>
            <input
              ref={selfieInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setSelfieFile(f);
                setSelfiePreview(URL.createObjectURL(f));
              }}
            />

            <PinkBtn onClick={handleSelfieVerification} loading={loading}>
              {selfieFile ? "Submit for review →" : "Skip for now →"}
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 5: City & Neighborhood ──────────────────────────────── */}
        {step === 5 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 5 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Where in NYC?</h2>
            <p className="text-gray-400 text-sm mb-7">Yande uses this to show you things nearby and find women close to you.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-5 mb-8">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">BOROUGH</label>
                <div className="flex flex-wrap gap-2">
                  {BOROUGHS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBorough(b)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: borough === b ? "var(--bb-pink)" : "white",
                        color: borough === b ? "white" : "var(--bb-black)",
                        border: `2px solid ${borough === b ? "var(--bb-pink)" : "#E0E0E0"}`,
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Your neighborhood">
                <TextInput
                  value={neighborhood}
                  onChange={setNeighborhood}
                  placeholder="Williamsburg, Crown Heights, Harlem…"
                />
              </Field>
            </div>

            <PinkBtn onClick={handleSaveLocation} loading={loading} disabled={!neighborhood}>
              Continue →
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 6: Vibe & Interests ──────────────────────────────────── */}
        {step === 6 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 6 OF 8</p>
            {error && <ErrorBanner msg={error} />}

            <SectionTitle
              title="What brings you here?"
              sub="Choose everything that feels right — this is how Yande finds your people."
            />
            <ScatteredBlobs items={GOALS} selected={goals} toggle={(i) => setGoals(toggleNum(goals, i))} />

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle title="Your era right now?" sub="Pick one. Be honest — Yande uses this." />
            <div className="grid grid-cols-2 gap-2.5 mb-2">
              {ERAS.map((label, i) => {
                const on = era === i;
                return (
                  <button
                    key={i}
                    onClick={() => setEra(i)}
                    className="rounded-2xl px-3 py-3.5 text-sm font-semibold text-left transition-all active:scale-[0.98]"
                    style={{
                      background: on ? "var(--light-pink)" : "white",
                      border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
                      color: "var(--bb-black)",
                    }}
                  >
                    {on && <span className="font-bold mr-1.5" style={{ color: "var(--bb-pink)" }}>✓</span>}
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle title="What are you into?" sub="Pick everything that feels like you." />
            <ScatteredBlobs items={INTERESTS} selected={interests} toggle={(i) => setInterests(toggleNum(interests, i))} />

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle
              title="A few private preferences."
              sub="Nobody else sees this. Yande uses it to match you with the right spaces and women."
            />
            <div className="flex flex-col gap-2.5 mb-2">
              {LIFESTYLE.map((label, i) => (
                <ToggleRow
                  key={i}
                  label={label}
                  on={lifestyle.has(i)}
                  toggle={() => setLifestyle(toggleNum(lifestyle, i))}
                />
              ))}
            </div>

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle title="When are you generally free?" sub="Yande matches you to things that fit your life." />
            <div className="flex flex-col gap-2.5 mb-8">
              {SCHEDULE.map((label, i) => (
                <ToggleRow
                  key={i}
                  label={label}
                  on={schedule.has(i)}
                  toggle={() => setSchedule(toggleNum(schedule, i))}
                />
              ))}
            </div>

            <PinkBtn
              onClick={handleSaveVibe}
              loading={loading}
              disabled={goals.size === 0 || interests.size === 0}
            >
              Continue →
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 7: Choose Clubs ──────────────────────────────────────── */}
        {step === 7 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 7 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Join some clubs.</h2>
            <p className="text-gray-400 text-sm mb-7">Find your people. You can always join more from the Clubs page.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-3 mb-8">
              {CLUBS.map((club) => {
                const on = selectedClubs.has(club.id);
                return (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClubs(toggleStr(selectedClubs, club.id))}
                    className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.99]"
                    style={{
                      background: on ? "var(--light-pink)" : "white",
                      border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: on ? "var(--bb-pink)" : "var(--light-pink)" }}
                    >
                      <span className="text-xs font-bold" style={{ color: on ? "white" : "var(--bb-pink)" }}>
                        {club.name[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{club.desc}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--bb-pink)" }}>
                        {club.count.toLocaleString()} women
                      </p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center"
                      style={{
                        borderColor: on ? "var(--bb-pink)" : "#E0E0E0",
                        background: on ? "var(--bb-pink)" : "transparent",
                      }}
                    >
                      {on && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5l2.5 2.5L8.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <PinkBtn onClick={handleJoinClubs} loading={loading}>
              {selectedClubs.size > 0
                ? `Join ${selectedClubs.size} club${selectedClubs.size > 1 ? "s" : ""} →`
                : "Skip for now →"}
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 8: Invite Friends ────────────────────────────────────── */}
        {step === 8 && (
          <div>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--light-pink)" }}>
                <BBLogo size={38} />
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--bb-black)" }}>
                Invite your girls.{" "}
                <span
                  className="italic"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
                >
                  Optional.
                </span>
              </h2>
              <p className="text-sm text-gray-400">Know women who should be inside BloomBay? Add their emails.</p>
            </div>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-3 mb-4">
              {inviteEmails.map((em, i) => (
                <input
                  key={i}
                  type="email"
                  value={em}
                  onChange={(e) => {
                    const next = [...inviteEmails];
                    next[i] = e.target.value;
                    setInviteEmails(next);
                  }}
                  placeholder={`Friend ${i + 1}'s email`}
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent transition-colors"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              ))}
            </div>

            <button
              onClick={() => setInviteEmails([...inviteEmails, ""])}
              className="text-sm font-semibold flex items-center gap-1.5 mb-8"
              style={{ color: "var(--bb-pink)" }}
            >
              + Add another
            </button>

            <div className="rounded-3xl p-4 mb-6" style={{ background: "white", border: "1px solid var(--light-pink)" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>You&apos;re almost inside.</p>
              <p className="text-xs text-gray-400">
                After this, you&apos;ll land in your BloomBay home.
                Your selfie verification will be reviewed within 24 hours.
              </p>
            </div>

            <PinkBtn onClick={handleComplete} loading={loading}>
              Enter BloomBay
            </PinkBtn>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full text-center text-sm text-gray-400 mt-3 py-2"
            >
              Skip invites &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
