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
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [age, setAge] = useState("");
  const [goals, setGoals] = useState<MultiSet>(new Set());
  const [era, setEra] = useState<number | null>(null);
  const [interests, setInterests] = useState<MultiSet>(new Set());
  const [lifestyle, setLifestyle] = useState<MultiSet>(new Set());
  const [schedule, setSchedule] = useState<MultiSet>(new Set());
  const [joinedClubId, setJoinedClubId] = useState<number | null>(null);
  const [rssvpd, setRsvpd] = useState(false);

  const TOTAL_STEPS = 9;

  function toggleSet(set: MultiSet, setFn: (s: MultiSet) => void, i: number) {
    const next = new Set(set);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setFn(next);
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else router.push("/member/home");
  }

  function back() {
    if (step > 0) setStep(step - 1);
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
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  ADD A PHOTO
                </label>
                <button
                  className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center text-2xl hover:border-pink-400 transition-colors"
                  style={{ borderColor: "var(--bb-pink)" }}
                >
                  📷
                </button>
              </div>
            </div>

            <div className="mt-auto">
              <PinkButton onClick={next} disabled={!name}>
                Continue →
              </PinkButton>
            </div>
          </div>
        )}

        {/* Step 2: What brings you here */}
        {step === 2 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 2 OF {TOTAL_STEPS - 1}
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

        {/* Step 3: Vibe */}
        {step === 3 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 3 OF {TOTAL_STEPS - 1}
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

        {/* Step 4: Interests */}
        {step === 4 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 4 OF {TOTAL_STEPS - 1}
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

        {/* Step 5: Lifestyle */}
        {step === 5 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 5 OF {TOTAL_STEPS - 1}
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

        {/* Step 6: Schedule */}
        {step === 6 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 6 OF {TOTAL_STEPS - 1}
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

        {/* Step 7: Club Recommendations */}
        {step === 7 && (
          <div className="flex flex-col flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              STEP 7 OF {TOTAL_STEPS - 1}
            </p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>
              Yande picked
            </h2>
            <p
              className="text-3xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              your clubs.
            </p>
            <p className="text-sm text-gray-400 mb-5">
              Based on your vibe and interests. Join one to start.
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

        {/* Step 8: First Event */}
        {step === 8 && (
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
                Enter BloomBay →
              </PinkButton>
              <p className="text-center text-xs text-gray-400 mt-2">
                Your city is waiting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
