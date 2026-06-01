"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BBLogo } from "./bb-logo";

const GOALS = [
  { emoji: "🌸", label: "Find my people in NYC" },
  { emoji: "🤝", label: "Build real friendships" },
  { emoji: "🔥", label: "Find my girl group" },
  { emoji: "☀️", label: "Get out of my routine" },
  { emoji: "🌿", label: "Sober social life" },
  { emoji: "🚀", label: "Network with ambitious women" },
];

const ERAS = [
  { emoji: "🏗️", label: "Building something" },
  { emoji: "😺", label: "Healing era" },
  { emoji: "🌙", label: "Soft life era" },
  { emoji: "📚", label: "Learning & growing" },
  { emoji: "✨", label: "New chapter" },
  { emoji: "🎯", label: "Focused & driven" },
];

const INTERESTS = [
  { emoji: "🍽️", label: "Brunch and dinners" },
  { emoji: "🎨", label: "Museums and culture" },
  { emoji: "💪", label: "Gym and fitness" },
  { emoji: "🤲", label: "Faith community" },
  { emoji: "🎵", label: "Afrobeats and events" },
  { emoji: "👗", label: "Fashion and style" },
  { emoji: "💻", label: "Building and tech" },
  { emoji: "☕", label: "City walks and cafés" },
  { emoji: "📖", label: "Quran and Islamic life" },
  { emoji: "🌿", label: "Sober social life" },
];

const LIFESTYLE = [
  { emoji: "🌿", label: "I don't drink" },
  { emoji: "🤲", label: "Halal food matters to me" },
  { emoji: "✨", label: "Faith is central to my social life" },
  { emoji: "🚭", label: "No smoking please" },
  { emoji: "👶", label: "I have kids" },
  { emoji: "💚", label: "Drug-free spaces only" },
];

const SCHEDULE = [
  "Weekday mornings",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend afternoons",
  "Weekend evenings",
  "Spontaneous — just send me things",
];

const CLUB_RECS = [
  {
    id: 1, name: "African Girls Club NYC", members: 127, color: "#FF1F7D",
    tagline: "Jollof nights, Afrobeats events, real sisterhood",
    tags: ["Cultural", "Food", "Community"],
    nextEvent: "Jollof + Movie Night Friday",
    nextDetail: "Fri 8PM · Crown Heights · $15",
  },
  {
    id: 2, name: "Soft Life Club NYC", members: 312, color: "#FF69B4",
    tagline: "Brunches, slow Sundays, luxury feels on a budget",
    tags: ["Lifestyle", "Food", "Wellness"],
    nextEvent: "Sunday Brunch at Lilia",
    nextDetail: "Sun 11AM · Williamsburg · $45",
  },
  {
    id: 3, name: "Girl Tech Collective", members: 89, color: "#FF69B4",
    tagline: "Founders, builders, and ambitious women in NYC tech",
    tags: ["Career", "Tech", "Networking"],
    nextEvent: "Pitch Night + Dinner",
    nextDetail: "Wed 7PM · SoHo · Free",
  },
];

type MultiSet = Set<number>;

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all"
          style={{
            width: i === current ? "24px" : "6px",
            background: i <= current ? "var(--bb-pink)" : "var(--light-pink)",
          }}
        />
      ))}
    </div>
  );
}

function PinkButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-full text-white font-bold text-base transition-all"
      style={{
        background: disabled ? "var(--mid-pink)" : "var(--bb-pink)",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SelectGrid({
  items,
  selected,
  toggle,
}: {
  items: { emoji: string; label: string }[];
  selected: MultiSet;
  toggle: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {items.map((item, i) => {
        const on = selected.has(i);
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="rounded-2xl p-4 flex items-center gap-3 text-left transition-all"
            style={{
              background: on ? "var(--light-pink)" : "white",
              border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
              color: "var(--bb-black)",
            }}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-sm font-medium leading-snug">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function OnboardFlow() {
  const router = useRouter();
  const [genderConfirmed, setGenderConfirmed] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [age, setAge] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [goals, setGoals] = useState<MultiSet>(new Set());
  const [era, setEra] = useState<number | null>(null);
  const [interests, setInterests] = useState<MultiSet>(new Set());
  const [lifestyle, setLifestyle] = useState<MultiSet>(new Set());
  const [schedule, setSchedule] = useState<MultiSet>(new Set());
  const [joinedClubId, setJoinedClubId] = useState<number | null>(null);
  const [rssvpd, setRsvpd] = useState(false);

  const TOTAL_STEPS = 11;

  function toggleSet(set: MultiSet, setFn: (s: MultiSet) => void, i: number) {
    const next = new Set(set);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setFn(next);
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else setPending(true);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  // ── Gender gate ─────────────────────────────────────────────────────────────
  if (genderConfirmed === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ background: "var(--pale-pink-bg)" }}>
        <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
          <BBLogo size={52} />
          <div>
            <h2 className="text-3xl font-black mb-2" style={{ color: "var(--bb-black)" }}>
              BloomBay is a{" "}
              <span style={{ color: "var(--bb-pink)", fontStyle: "italic", fontFamily: "var(--font-playfair)" }}>
                women-only
              </span>{" "}
              space.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your safety and the safety of every woman here is our top priority. This platform is exclusively for women.
            </p>
          </div>
          <div
            className="w-full rounded-3xl p-5 flex flex-col gap-2"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(255,31,125,0.08)" }}
          >
            <p className="text-sm font-semibold text-gray-500 mb-2">Are you a woman?</p>
            <button
              onClick={() => setGenderConfirmed(true)}
              className="w-full py-4 rounded-full text-white font-bold text-base"
              style={{ background: "var(--bb-pink)" }}
            >
              Yes, I am a woman ♥
            </button>
            <button
              onClick={() => setGenderConfirmed(false)}
              className="w-full py-3 rounded-full text-sm font-semibold"
              style={{ background: "#F5F5F5", color: "#888" }}
            >
              I am not a woman
            </button>
          </div>
          <p className="text-xs text-gray-400">
            BloomBay is a private, invitation-only community for women.
          </p>
        </div>
      </div>
    );
  }

  if (genderConfirmed === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ background: "var(--pale-pink-bg)" }}>
        <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
          <BBLogo size={52} />
          <div>
            <h2 className="text-2xl font-black mb-3" style={{ color: "var(--bb-black)" }}>
              We&apos;re sorry
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              BloomBay is an exclusively women-only platform. For the safety of our members, we cannot grant access to men.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We take the safety of every woman in this community very seriously.
            </p>
          </div>
          <button
            onClick={() => setGenderConfirmed(null)}
            className="text-sm font-bold underline"
            style={{ color: "var(--bb-pink)" }}
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (pending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12" style={{ background: "var(--pale-pink-bg)" }}>
        <div className="w-full max-w-md flex flex-col items-center text-center gap-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "#111111" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-2" style={{ color: "var(--bb-black)" }}>
              Application submitted.
            </h2>
            <p
              className="text-xl italic mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              Yande will review you personally.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              We read every application. This isn&apos;t automated — a real person looks at who you are before welcoming you in.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            {[
              { icon: "📸", title: "Your photo is being reviewed", sub: "Clear and real — that's what we need." },
              { icon: "📝", title: "Your answers are being read", sub: "Yande reads your bio personally." },
              { icon: "⏰", title: "Usually within 24 hours", sub: "We'll email + text you when you're approved." },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-2xl text-left"
                style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--bb-black)" }}>{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="w-full rounded-2xl p-4"
            style={{ background: "var(--light-pink)" }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-pink)" }}>
              While you wait…
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tell a friend. BloomBay grows through women who already know someone inside.{" "}
              <button
                className="font-bold underline"
                style={{ color: "var(--bb-pink)" }}
                onClick={() => navigator.clipboard?.writeText("https://bloombay.app/waitlist")}
              >
                Copy your invite link
              </button>
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Questions?{" "}
            <a href="mailto:hello@bloombay.app" className="font-bold underline" style={{ color: "var(--bb-pink)" }}>
              hello@bloombay.app
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--pale-pink-bg)" }}
    >
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 pt-14 pb-10">
        {/* Back button */}
        {step > 0 && (
          <button
            onClick={back}
            className="self-start mb-4 text-sm text-gray-400 font-medium"
          >
            ← Back
          </button>
        )}

        <ProgressDots total={TOTAL_STEPS} current={step} />

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex flex-col flex-1">
            {/* Hero mark */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="mb-5">
                <BBLogo size={52} />
              </div>
              <h1
                className="text-4xl font-bold mb-3 leading-tight"
                style={{ color: "var(--bb-black)" }}
              >
                It&apos;s a girls world.{" "}
                <span
                  className="italic"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
                >
                  We&apos;re living in it.
                </span>
              </h1>
              <p className="text-gray-500 text-base leading-relaxed">
                BloomBay is where NYC women build real friendships — through motion, timing, and intent.
              </p>
            </div>

            {/* Member social proof */}
            <div
              className="rounded-3xl p-4 mb-4"
              style={{ background: "var(--light-pink)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                {[
                  { i: "A", c: "#FF1F7D" }, { i: "S", c: "#FF69B4" },
                  { i: "P", c: "#FF1F7D" }, { i: "K", c: "#FF69B4" },
                  { i: "M", c: "#111111" },
                ].map((a) => (
                  <div
                    key={a.i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: a.c }}
                  >
                    {a.i}
                  </div>
                ))}
                <p className="text-xs font-bold ml-1" style={{ color: "var(--bb-pink)" }}>
                  +242 inside
                </p>
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--bb-black)" }}>
                247 verified women are already inside.{" "}
                <span className="font-normal text-gray-500">
                  Founding wave — 253 spots left.
                </span>
              </p>
            </div>

            {/* Feature trio */}
            <div className="flex flex-col gap-2.5 mb-6">
              {[
                { emoji: "🔒", title: "Women only", sub: "Live selfie verification — every single member" },
                { emoji: "🤝", title: "Real friendships", sub: "Girl Match finds your people by energy + values" },
                { emoji: "✨", title: "Your city is alive", sub: "Girl Happenings, drops, and clubs — always something" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3"
                  style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
                >
                  <span className="text-xl flex-shrink-0">{f.emoji}</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{f.title}</p>
                    <p className="text-xs text-gray-400">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next}>Let&apos;s go 🌸</PinkButton>
              <p className="text-center text-xs text-gray-400 mt-3">Free to join · Women only · NYC</p>
            </div>
          </div>
        )}

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 1 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              Let&apos;s start with
            </h2>
            <p
              className="text-3xl font-bold italic mb-8"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              the basics.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  YOUR FIRST NAME
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maya"
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  YOUR NEIGHBORHOOD
                </label>
                <input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Williamsburg, Brooklyn"
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  YOUR AGE
                </label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="28"
                  type="number"
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              </div>
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={!name}>
                Continue →
              </PinkButton>
            </div>
          </div>
        )}

        {/* Step 2: Your Photo */}
        {step === 2 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 2 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              Add your photo.
            </h2>
            <p
              className="text-xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              We verify every member personally.
            </p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your photo is reviewed by Yande before you&apos;re approved. This keeps BloomBay safe and real for every woman here.
            </p>

            <div className="flex flex-col items-center gap-5 mb-8">
              {/* Photo circle */}
              <label className="cursor-pointer flex flex-col items-center gap-3">
                <div
                  className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden relative"
                  style={{
                    border: `3px dashed ${photoPreview ? "var(--bb-pink)" : "#DDD"}`,
                    background: photoPreview ? "transparent" : "white",
                  }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1.5">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span className="text-xs text-gray-300 font-medium">Tap to upload</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPhotoPreview(URL.createObjectURL(file));
                  }}
                />
                {photoPreview ? (
                  <span className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>Tap to change photo</span>
                ) : (
                  <span className="text-sm font-semibold text-gray-400">Take a selfie or upload a clear photo of your face</span>
                )}
              </label>

              {/* Requirements */}
              <div className="w-full rounded-2xl p-4" style={{ background: "var(--light-pink)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--bb-pink)" }}>PHOTO REQUIREMENTS</p>
                {[
                  "Clear, well-lit photo of your face",
                  "Just you — no group photos",
                  "No filters or heavy edits",
                  "Recent photo (not from years ago)",
                ].map((req) => (
                  <div key={req} className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--bb-pink)" }} />
                    <p className="text-xs text-gray-500">{req}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={!photoPreview}>
                {photoPreview ? "Looking good — continue →" : "Upload your photo first"}
              </PinkButton>
              <p className="text-center text-xs text-gray-400 mt-2">
                Your photo is only visible to Yande during review. Never public without your consent.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: About You */}
        {step === 3 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 3 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              Tell us about
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              yourself.
            </p>
            <p className="text-sm text-gray-400 mb-6">This helps Yande understand who you are before welcoming you in.</p>

            <div className="flex flex-col gap-5 mb-6">
              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  IN 1–2 SENTENCES, WHO ARE YOU?
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I'm a graphic designer in Brooklyn. I moved here two years ago and I'm still building my people."
                  rows={3}
                  maxLength={200}
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent resize-none leading-relaxed"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/200</p>
              </div>

              {/* Vibe */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                  HOW WOULD YOUR FRIENDS DESCRIBE YOU?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { emoji: "🌸", label: "The warm one — everyone feels safe around me" },
                    { emoji: "⚡", label: "The energetic one — always down for something" },
                    { emoji: "🧠", label: "The thoughtful one — deep conversations always" },
                    { emoji: "😂", label: "The funny one — no dull moments with me" },
                    { emoji: "🏗️", label: "The driven one — always building something" },
                    { emoji: "🌿", label: "The calm one — peaceful vibes only" },
                  ].map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setVibe(i)}
                      className="rounded-2xl p-3 text-left transition-all"
                      style={{
                        background: vibe === i ? "var(--light-pink)" : "white",
                        border: `2px solid ${vibe === i ? "var(--bb-pink)" : "#F0F0F0"}`,
                      }}
                    >
                      <span className="text-lg block mb-1">{v.emoji}</span>
                      <p className="text-xs font-medium leading-snug" style={{ color: "var(--bb-black)" }}>{v.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={!bio || vibe === null}>
                Continue →
              </PinkButton>
            </div>
          </div>
        )}

        {/* Step 4: What brings you here */}
        {step === 4 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 4 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              What brings
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              you here?
            </p>
            <p className="text-sm text-gray-400 mb-6">Choose everything that feels right</p>

            <SelectGrid
              items={GOALS}
              selected={goals}
              toggle={(i) => toggleSet(goals, setGoals, i)}
            />

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={goals.size === 0}>
                Continue →
              </PinkButton>
            </div>
          </div>
        )}

        {/* Step 5: Vibe */}
        {step === 5 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 5 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              What&apos;s your vibe
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              right now?
            </p>
            <p className="text-sm text-gray-400 mb-6">Be honest — Yande uses this</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {ERAS.map((item, i) => {
                const on = era === i;
                return (
                  <button
                    key={i}
                    onClick={() => setEra(i)}
                    className="rounded-2xl p-5 flex flex-col items-start gap-3 text-left transition-all"
                    style={{
                      background: on ? "var(--light-pink)" : "white",
                      border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
                    }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className="text-sm font-semibold leading-snug"
                      style={{ color: "var(--bb-black)" }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={era === null}>
                Continue →
              </PinkButton>
            </div>
          </div>
        )}

        {/* Step 6: Interests */}
        {step === 6 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 6 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              What are you
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              looking for?
            </p>
            <p className="text-sm text-gray-400 mb-6">Pick everything that feels like you</p>

            <SelectGrid
              items={INTERESTS}
              selected={interests}
              toggle={(i) => toggleSet(interests, setInterests, i)}
            />

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={interests.size === 0}>
                Keep going →
              </PinkButton>
            </div>
          </div>
        )}

        {/* Step 7: Lifestyle */}
        {step === 7 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 7 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              A few things about
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              your life.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Private. Yande uses this to match you. Nobody else sees it.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {LIFESTYLE.map((item, i) => {
                const on = lifestyle.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleSet(lifestyle, setLifestyle, i)}
                    className="w-full rounded-2xl px-4 py-4 flex items-center justify-between text-left transition-all"
                    style={{
                      background: on ? "var(--light-pink)" : "white",
                      border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
                      color: "var(--bb-black)",
                    }}
                  >
                    <span className="text-sm font-medium">
                      {item.emoji} {item.label}
                    </span>
                    {on && <span style={{ color: "var(--bb-pink)" }} className="font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next}>Almost there →</PinkButton>
            </div>
          </div>
        )}

        {/* Step 8: Schedule */}
        {step === 8 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 8 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              When are you
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              generally free?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Yande uses this. You can update it any time.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {SCHEDULE.map((item, i) => {
                const on = schedule.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleSet(schedule, setSchedule, i)}
                    className="w-full rounded-2xl px-4 py-4 flex items-center justify-between text-left transition-all"
                    style={{
                      background: on ? "var(--light-pink)" : "white",
                      border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
                      color: "var(--bb-black)",
                    }}
                  >
                    <span className="text-sm font-medium">{item}</span>
                    {on && <span style={{ color: "var(--bb-pink)" }} className="font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={schedule.size === 0}>
                Almost there →
              </PinkButton>
            </div>
          </div>
        )}

        {/* Step 9: Club Recommendations */}
        {step === 9 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 9 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              Clubs picked
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              for you.
            </p>
            <p className="text-sm text-gray-400 mb-5">
              Based on your interests and vibe{name ? `, ${name.split(" ")[0]}` : ""}. Join one to get started.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {CLUB_RECS.map((club) => {
                const joined = joinedClubId === club.id;
                return (
                  <button
                    key={club.id}
                    onClick={() => setJoinedClubId(club.id)}
                    className="rounded-2xl p-4 text-left transition-all"
                    style={{
                      background: joined ? "var(--light-pink)" : "white",
                      border: `2px solid ${joined ? club.color : "#F0F0F0"}`,
                      boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm leading-snug" style={{ color: "var(--bb-black)" }}>
                          {club.name}
                        </p>
                        <p className="text-xs text-gray-400">{club.members} women</p>
                      </div>
                      {joined && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: club.color }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 italic mb-2">{club.tagline}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {club.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: joined ? `${club.color}22` : "#F5F5F5", color: joined ? club.color : "#999" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={joinedClubId === null}>
                Join and continue →
              </PinkButton>
              <p className="text-center text-xs text-gray-400 mt-2">You can join more clubs anytime</p>
            </div>
          </div>
        )}

        {/* Step 10: First Event */}
        {step === 10 && (
          <div className="flex flex-col flex-1">
            <div
              className="rounded-3xl p-5 mb-5 relative overflow-hidden"
              style={{ background: "#111111" }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                style={{ background: "var(--bb-pink)", transform: "translate(30%, -30%)" }}
              />
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--mid-pink)" }}>
                YOU&apos;RE IN ✦
              </p>
              <p className="text-white text-2xl font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                {CLUB_RECS.find((c) => c.id === joinedClubId)?.name}
              </p>
              <p className="text-white/50 text-sm">
                {CLUB_RECS.find((c) => c.id === joinedClubId)?.members} women are already inside.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              Your first moment
            </h2>
            <p
              className="text-2xl font-bold italic mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              is already here.
            </p>

            {(() => {
              const club = CLUB_RECS.find((c) => c.id === joinedClubId);
              return club ? (
                <div
                  className="rounded-3xl p-5 mb-6"
                  style={{ background: "white", border: `2px solid var(--light-pink)`, boxShadow: "0 2px 16px rgba(255,31,125,0.10)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: club.color }} />
                    <p className="text-xs font-bold tracking-widest uppercase" style={{ color: club.color }}>
                      NEXT UP IN YOUR CLUB
                    </p>
                  </div>
                  <p className="text-xl font-bold leading-snug mb-1" style={{ color: "var(--bb-black)" }}>
                    {club.nextEvent}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">{club.nextDetail}</p>
                  <button
                    onClick={() => setRsvpd(true)}
                    className="w-full py-3.5 rounded-full font-bold text-sm transition-all"
                    style={
                      rssvpd
                        ? { background: "#111111", color: "white" }
                        : { background: club.color, color: "white" }
                    }
                  >
                    {rssvpd ? "You're going ✓" : "RSVP — I'm going →"}
                  </button>
                </div>
              ) : null;
            })()}

            <div className="mt-auto">
              <PinkButton onClick={next}>
                Submit application →
              </PinkButton>
              <p className="text-center text-xs text-gray-400 mt-2">
                Every application is reviewed personally before access is granted.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Pending Review Screen ────────────────────────────────────────────────────
// rendered when pending === true (inside the main OnboardFlow return, guarded
// at the top before the step-based render path)
