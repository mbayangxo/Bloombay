"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { persistOnboardingLocation } from "@/lib/yande-member-state";
import { localeFromCountry, onboardingCopy, type OnboardingLocale } from "@/lib/onboarding-i18n";
import { saveMemberVerification } from "@/lib/member-verification-store";
import { saveYandeMemberProfile } from "@/lib/yande-member-profile";
import { setNewInTown } from "@/lib/new-in-town";

type Step = "name" | "photo" | "location" | "newToCity" | "age" | "interests" | "about" | "gender";
const STEPS: Step[] = ["name", "photo", "location", "newToCity", "age", "interests", "about", "gender"];

const AGE_RANGES = ["22–25", "26–30", "31–35", "36–40", "40+"];
const INTERESTS = [
  { label: "Fitness", emoji: "🏋🏽‍♀️" },
  { label: "Books", emoji: "📚" },
  { label: "Travel", emoji: "✈️" },
  { label: "Food", emoji: "🍽️" },
  { label: "Nightlife", emoji: "🌙" },
  { label: "Wellness", emoji: "🌿" },
  { label: "Entrepreneurship", emoji: "💡" },
  { label: "Arts", emoji: "🎨" },
  { label: "Culture", emoji: "🎭" },
];

const variants = {
  enter: { opacity: 0, y: 32 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export default function MemberOnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [about, setAbout] = useState("");
  const [genderConfirmed, setGenderConfirmed] = useState(false);
  const [newToCity, setNewToCityAnswer] = useState<boolean | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [locale, setLocale] = useState<OnboardingLocale>("en");
  const fileRef = useRef<HTMLInputElement>(null);

  const copy = onboardingCopy(locale);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  function canContinue() {
    if (step === "name") return name.trim().length > 0;
    if (step === "photo") return true;
    if (step === "location") return city.trim().length > 0 && country.trim().length > 0;
    if (step === "newToCity") return newToCity !== null;
    if (step === "age") return age.length > 0;
    if (step === "interests") return interests.length > 0;
    if (step === "about") return about.trim().length >= 20;
    if (step === "gender") return genderConfirmed;
    return false;
  }

  function advance() {
    if (!canContinue()) return;
    if (step === "location" && country.trim()) {
      setLocale(localeFromCountry(country));
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("gf_country", country.trim());
      }
    }
    if (step === "newToCity" && newToCity === true) {
      setNewInTown(true, city.trim() || "New York");
    }
    if (isLast) {
      sessionStorage.setItem("gf_name", name);
      persistOnboardingLocation(city, neighborhood);
      const email = sessionStorage.getItem("gf_email") ?? "member@bloombay.local";
      saveYandeMemberProfile({
        email,
        firstName: name,
        city,
        country,
        neighborhood,
        ageRange: age,
        interests,
        about,
        locale,
      });
      saveMemberVerification({
        email,
        firstName: name,
        city,
        country,
        neighborhood,
        ageRange: age,
        interests,
        about,
        photoUrl: photoDataUrl ?? photo ?? "",
        locale,
        genderConfirmed: true,
      });
      // Always go to home — verification is reviewed async by the founder portal.
      // Members get full access immediately; the founder portal flags anything suspicious.
      window.location.href = "/member/home";
      return;
    }
    setDirection(1);
    setStepIndex((i) => i + 1);
  }

  function back() {
    if (stepIndex === 0) return;
    setDirection(-1);
    setStepIndex((i) => i - 1);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  function toggleInterest(label: string) {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  }

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div style={styles.page}>
      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <motion.div
          style={styles.progressFill}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {stepIndex > 0 && (
        <button style={styles.backBtn} onClick={back}>← Back</button>
      )}

      <div style={styles.content}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={styles.stepWrap}
          >
            {step === "name" && <NameStep name={name} setName={setName} onEnter={advance} />}
            {step === "photo" && <PhotoStep photo={photo} fileRef={fileRef} onUpload={handlePhoto} />}
            {step === "location" && (
              <LocationStep
                neighborhood={neighborhood} setNeighborhood={setNeighborhood}
                city={city} setCity={setCity}
                country={country} setCountry={setCountry}
                onEnter={advance}
              />
            )}
            {step === "newToCity" && (
              <NewToCityStep
                city={city}
                answer={newToCity}
                setAnswer={setNewToCityAnswer}
              />
            )}
            {step === "age" && <AgeStep age={age} setAge={setAge} />}
            {step === "interests" && <InterestsStep interests={interests} toggle={toggleInterest} />}
            {step === "about" && (
              <AboutStep about={about} setAbout={setAbout} label={copy.about} />
            )}
            {step === "gender" && (
              <GenderStep
                confirmed={genderConfirmed}
                setConfirmed={setGenderConfirmed}
                label={copy.gender}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          style={canContinue() ? styles.continueBtn : styles.continueBtnDisabled}
          onClick={advance}
          whileHover={canContinue() ? { y: -2 } : {}}
          whileTap={canContinue() ? { scale: 0.98 } : {}}
          transition={{ duration: 0.15 }}
        >
          {isLast ? copy.finish : copy.continue}
        </motion.button>
      </div>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────

function NameStep({ name, setName, onEnter }: { name: string; setName: (v: string) => void; onEnter: () => void }) {
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>Step 1 of 5</p>
      <h2 style={styles.question}>What's your name?</h2>
      <p style={styles.hint}>Just your first name is fine.</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder="Your name" style={styles.textInput} autoFocus />
    </div>
  );
}

function PhotoStep({ photo, fileRef, onUpload }: { photo: string | null; fileRef: React.RefObject<HTMLInputElement | null>; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>Step 2 of 5</p>
      <h2 style={styles.question}>Add a photo</h2>
      <p style={styles.hint}>Let your community put a face to the name.</p>
      <input type="file" accept="image/*" ref={fileRef} onChange={onUpload} style={{ display: "none" }} />
      <button style={photo ? styles.photoPreview : styles.photoUpload} onClick={() => fileRef.current?.click()}>
        {photo ? (
          <img src={photo} alt="Your photo" style={styles.photoImg} />
        ) : (
          <div style={styles.photoPlaceholder}>
            <span style={styles.photoIcon}>+</span>
            <span style={styles.photoUploadText}>Upload photo</span>
          </div>
        )}
      </button>
      {photo && <button style={styles.changePhoto} onClick={() => fileRef.current?.click()}>Change photo</button>}
    </div>
  );
}

function LocationStep({ neighborhood, setNeighborhood, city, setCity, country, setCountry, onEnter }: {
  neighborhood: string; setNeighborhood: (v: string) => void;
  city: string; setCity: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  onEnter: () => void;
}) {
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>Step 3 of 5</p>
      <h2 style={styles.question}>Where are you based?</h2>
      <p style={styles.hint}>We'll connect you with women in your world.</p>
      <div style={styles.locationFields}>
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Neighborhood <span style={styles.optional}>(optional)</span></label>
          <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="e.g. Harlem, Le Marais, Shoreditch" style={styles.textInput} autoFocus />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>City <span style={styles.required}>*</span></label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. New York, Lagos, London" style={styles.textInput} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Country <span style={styles.required}>*</span></label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
            placeholder="e.g. United States, Nigeria, France" style={styles.textInput} />
        </div>
      </div>
    </div>
  );
}

function NewToCityStep({
  city,
  answer,
  setAnswer,
}: {
  city: string;
  answer: boolean | null;
  setAnswer: (v: boolean) => void;
}) {
  const place = city.trim() || "your city";
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>New in town · not a menu item</p>
      <h2 style={styles.question}>Are you new to {place}?</h2>
      <p style={styles.hint}>
        Say yes and BloomBay opens your first 30 days — welcome seat, starter club, events, and girl-tested places.
        We optimize for your first real meetup in 14 days, not profile completion.
      </p>
      <div style={styles.pillGrid}>
        <button
          type="button"
          style={answer === true ? styles.pillActive : styles.pill}
          onClick={() => setAnswer(true)}
        >
          Yes — I&apos;m new here
        </button>
        <button
          type="button"
          style={answer === false ? styles.pillActive : styles.pill}
          onClick={() => setAnswer(false)}
        >
          No — I know my way around
        </button>
      </div>
    </div>
  );
}

function AgeStep({ age, setAge }: { age: string; setAge: (v: string) => void }) {
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>Step 5 of 8</p>
      <h2 style={styles.question}>How old are you?</h2>
      <p style={styles.hint}>Helps us match you with the right community.</p>
      <div style={styles.pillGrid}>
        {AGE_RANGES.map((range) => (
          <button key={range} style={age === range ? styles.pillActive : styles.pill} onClick={() => setAge(range)}>
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}

function AboutStep({
  about,
  setAbout,
  label,
}: {
  about: string;
  setAbout: (v: string) => void;
  label: string;
}) {
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>Step 6 of 7</p>
      <h2 style={styles.question}>{label}</h2>
      <p style={styles.hint}>At least 20 characters — helps Yande personalize your experience.</p>
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        placeholder="What brings you to BloomBay?"
        style={{ ...styles.textInput, minHeight: 120, resize: "vertical" as const }}
      />
    </div>
  );
}

function GenderStep({
  confirmed,
  setConfirmed,
  label,
}: {
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
  label: string;
}) {
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>Step 7 of 7</p>
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          style={{ marginTop: 4, accentColor: "#ff0055" }}
        />
        <span style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{label}</span>
      </label>
    </div>
  );
}

function InterestsStep({ interests, toggle }: { interests: string[]; toggle: (label: string) => void }) {
  return (
    <div style={styles.step}>
      <p style={styles.stepLabel}>Step 5 of 7</p>
      <h2 style={styles.question}>What lights you up?</h2>
      <p style={styles.hint}>Pick everything that feels like you.</p>
      <div style={styles.interestGrid}>
        {INTERESTS.map(({ label, emoji }) => (
          <button key={label} style={interests.includes(label) ? styles.interestActive : styles.interest} onClick={() => toggle(label)}>
            <span style={styles.interestEmoji}>{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#000000",
    display: "flex", flexDirection: "column", alignItems: "center",
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    position: "relative", paddingBottom: "48px",
  },
  progressTrack: {
    position: "fixed", top: 0, left: 0, right: 0,
    height: "3px", background: "rgba(255,214,228,0.15)", zIndex: 10,
  },
  progressFill: { height: "100%", background: "#ff0055", borderRadius: "0 2px 2px 0" },
  backBtn: {
    position: "fixed", top: "20px", left: "24px",
    background: "none", border: "none", color: "rgba(255,255,255,0.35)",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "14px", cursor: "pointer", padding: "8px 4px", zIndex: 10,
  },
  content: {
    width: "100%", maxWidth: "520px",
    padding: "96px 32px 0",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  stepWrap: {
    width: "100%", minHeight: "360px",
    display: "flex", flexDirection: "column",
  },
  step: { display: "flex", flexDirection: "column" },
  stepLabel: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "12px", fontWeight: 500,
    color: "rgba(255,214,228,0.4)",
    letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 20px",
  },
  question: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "clamp(28px, 5vw, 38px)", fontWeight: 600,
    color: "#ffffff", margin: "0 0 12px",
    letterSpacing: "-0.02em", lineHeight: 1.2,
  },
  hint: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "16px", fontWeight: 300,
    color: "rgba(255,214,228,0.5)", margin: "0 0 40px", lineHeight: 1.5,
  },
  textInput: {
    background: "transparent", border: "none",
    borderBottom: "2px solid rgba(255,214,228,0.25)",
    padding: "10px 0", fontSize: "22px",
    fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 300, color: "#ffffff", outline: "none",
    width: "100%", caretColor: "#ff0055",
  },
  locationFields: { display: "flex", flexDirection: "column", gap: "28px", width: "100%" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldLabel: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "12px", fontWeight: 500,
    color: "rgba(255,214,228,0.4)",
    letterSpacing: "0.07em", textTransform: "uppercase",
  },
  optional: { color: "rgba(255,214,228,0.2)", fontWeight: 300 },
  required: { color: "#ff0055" },
  pillGrid: { display: "flex", flexWrap: "wrap" as const, gap: "12px" },
  pill: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,214,228,0.2)",
    borderRadius: "100px", padding: "12px 28px",
    fontSize: "16px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 400, color: "rgba(255,255,255,0.75)",
    cursor: "pointer", transition: "all 0.2s",
  },
  pillActive: {
    background: "#ff0055", border: "1px solid #ff0055",
    borderRadius: "100px", padding: "12px 28px",
    fontSize: "16px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 600, color: "#ffffff",
    cursor: "pointer", transition: "all 0.2s",
  },
  interestGrid: { display: "flex", flexWrap: "wrap" as const, gap: "10px" },
  interest: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,214,228,0.15)",
    borderRadius: "14px", padding: "12px 20px",
    fontSize: "15px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 400, color: "rgba(255,255,255,0.7)",
    cursor: "pointer", transition: "all 0.2s",
  },
  interestActive: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#ffd6e4",
    border: "1px solid #ff0055",
    borderRadius: "14px", padding: "12px 20px",
    fontSize: "15px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 600, color: "#0a0a0a",
    cursor: "pointer", transition: "all 0.2s",
  },
  interestEmoji: { fontSize: "18px" },
  photoUpload: {
    width: "160px", height: "160px", borderRadius: "50%",
    border: "2px dashed rgba(255,214,228,0.3)",
    background: "rgba(255,255,255,0.04)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    alignSelf: "flex-start" as const,
  },
  photoPreview: {
    width: "160px", height: "160px", borderRadius: "50%",
    border: "2px solid #ff0055",
    background: "transparent", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", padding: "0", alignSelf: "flex-start" as const,
  },
  photoImg: { width: "100%", height: "100%", objectFit: "cover" as const },
  photoPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  photoIcon: { fontSize: "28px", color: "rgba(255,214,228,0.4)", lineHeight: 1 },
  photoUploadText: {
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "13px", color: "rgba(255,214,228,0.4)",
  },
  changePhoto: {
    marginTop: "16px", background: "none", border: "none",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "13px", color: "rgba(255,214,228,0.4)",
    cursor: "pointer", padding: "0", textDecoration: "underline",
  },
  continueBtn: {
    marginTop: "48px", background: "#ff0055", border: "none",
    borderRadius: "12px", padding: "16px",
    fontSize: "16px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 600, color: "#ffffff", cursor: "pointer",
    letterSpacing: "0.03em", width: "100%",
  },
  continueBtnDisabled: {
    marginTop: "48px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,214,228,0.1)",
    borderRadius: "12px", padding: "16px",
    fontSize: "16px", fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 600, color: "rgba(255,255,255,0.2)",
    cursor: "not-allowed", letterSpacing: "0.03em", width: "100%",
  },
  skipBtn: {
    marginTop: "16px", background: "none", border: "none",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "14px", color: "rgba(255,214,228,0.35)",
    cursor: "pointer", padding: "8px",
  },
};
