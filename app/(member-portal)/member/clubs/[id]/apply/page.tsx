"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const PINK = "#FF1F7D";
const CREAM = "#FAF6F0";

// Mock club data — real data layer comes later via Supabase
const MOCK_CLUB = {
  name: "Museum Girls",
  membershipType: "Application Only" as "Free" | "Application Only",
  isPaid: false,
  price: null as number | null,
  rules: [
    "Respect every woman's story — no unsolicited advice",
    "What's shared in the club stays in the club",
    "Show up with intention. Quality over quantity.",
  ],
};

type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  location: string;
  occupation: string;
  referral: string;
  whyJoin: string;
  whatBring: string;
  communityMeaning: string;
  agreed: boolean;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1.5px solid #E0D8D0",
  background: "transparent",
  fontFamily: "Jost, sans-serif",
  fontSize: 14,
  padding: "10px 0",
  outline: "none",
  color: "#111",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Jost, sans-serif",
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#888",
  display: "block",
  marginBottom: 6,
  marginTop: 20,
};

export default function ClubApplyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clubId = params.id;

  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    location: "",
    occupation: "",
    referral: "",
    whyJoin: "",
    whatBring: "",
    communityMeaning: "",
    agreed: false,
  });

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed1 =
    form.name.trim() !== "" &&
    form.location.trim() !== "" &&
    form.occupation.trim() !== "" &&
    form.referral !== "";

  const canProceed2 =
    form.whyJoin.trim() !== "" && form.whatBring.trim() !== "";

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* confetti scattered */}
        {["🎉", "✨", "🌸", "✨", "🎉", "🌸"].map((emoji, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: [22, 18, 24, 16, 20, 18][i],
              opacity: 0.7,
              top: [`8%`, `15%`, `72%`, `80%`, `60%`, `30%`][i],
              left: [`12%`, `78%`, `8%`, `82%`, `55%`, `35%`][i],
              transform: `rotate(${[12, -8, 20, -15, 5, -22][i]}deg)`,
            }}
          >
            {emoji}
          </span>
        ))}

        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${PINK}, #FF69B4)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 28,
            boxShadow: `0 8px 32px ${PINK}44`,
          }}
        >
          ♡
        </div>

        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 28,
            fontStyle: "italic",
            fontWeight: 900,
            color: "#111",
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}
        >
          Your application is in!
        </h1>

        <p
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: 14,
            color: "#666",
            maxWidth: 280,
            lineHeight: 1.7,
            margin: "0 0 40px",
          }}
        >
          The Club Mama will review your application and reach out. You&apos;ll
          get a notification when you hear back.
        </p>

        <Link
          href={`/member/clubs/${clubId}`}
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: 13,
            letterSpacing: "0.08em",
            color: PINK,
            textDecoration: "none",
            borderBottom: `1px solid ${PINK}55`,
            paddingBottom: 2,
          }}
        >
          ← Back to clubs
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: CREAM,
        fontFamily: "Jost, sans-serif",
      }}
    >
      {/* ── HERO HEADER ── */}
      <div
        style={{
          width: "100%",
          height: 220,
          background: "linear-gradient(160deg, #1A0A18, #3A1028)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* back arrow */}
        <Link
          href={`/member/clubs/${clubId}`}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            color: "rgba(255,255,255,0.75)",
            textDecoration: "none",
            fontFamily: "Jost, sans-serif",
            fontSize: 20,
            lineHeight: 1,
            zIndex: 2,
          }}
        >
          ←
        </Link>

        {/* BB crest */}
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 20,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: PINK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Jost, sans-serif",
            fontSize: 8,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.05em",
            zIndex: 2,
          }}
        >
          BB
        </div>

        {/* eyebrow */}
        <p
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            margin: "0 0 8px",
          }}
        >
          Applying to join
        </p>

        {/* club name */}
        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: 900,
            color: "#fff",
            margin: 0,
            textAlign: "center",
            padding: "0 32px",
            lineHeight: 1.1,
          }}
        >
          {MOCK_CLUB.name}
        </h1>
      </div>

      {/* ── STICKY PROGRESS BAR ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: CREAM,
          borderBottom: "1px solid #EDE7DF",
          padding: "12px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {([1, 2, 3] as Step[]).map((s, i) => {
            const labels = ["About You", "Your Story", "Confirm"];
            const active = step === s;
            const done = step > s;
            return (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: done
                        ? PINK
                        : active
                          ? PINK
                          : "rgba(0,0,0,0.15)",
                      opacity: done ? 1 : active ? 1 : 0.4,
                      transition: "background 0.3s",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Jost, sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: active ? PINK : "#999",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {labels[i]}
                  </span>
                </div>
                {s < 3 && (
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      background: done ? PINK : "#E0D8D0",
                      marginBottom: 14,
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <div style={{ padding: "24px 20px 100px" }}>
        {/* ── STEP 1: ABOUT YOU ── */}
        {step === 1 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: 700,
                color: "#111",
                margin: "0 0 4px",
              }}
            >
              Tell us about yourself
            </h2>
            <p
              style={{
                fontFamily: "Jost, sans-serif",
                fontSize: 12,
                color: "#999",
                margin: "0 0 8px",
              }}
            >
              A little goes a long way.
            </p>

            <label style={labelStyle}>Your name</label>
            <input
              style={inputStyle}
              placeholder="First and last name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />

            <label style={labelStyle}>Where are you based?</label>
            <input
              style={inputStyle}
              placeholder="City, country"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />

            <label style={labelStyle}>What do you do?</label>
            <input
              style={inputStyle}
              placeholder="Your work, passion, or both"
              value={form.occupation}
              onChange={(e) => update("occupation", e.target.value)}
            />

            <label style={labelStyle}>How did you hear about us?</label>
            <select
              style={{
                ...inputStyle,
                appearance: "none" as const,
                cursor: "pointer",
                color: form.referral ? "#111" : "#aaa",
              }}
              value={form.referral}
              onChange={(e) => update("referral", e.target.value)}
            >
              <option value="" disabled>
                Choose one
              </option>
              <option value="friend">From a friend</option>
              <option value="instagram">Instagram</option>
              <option value="app">BloomBay app</option>
              <option value="event">Event</option>
            </select>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed1}
              style={{
                marginTop: 32,
                width: "100%",
                padding: "14px 0",
                borderRadius: 50,
                background: canProceed1
                  ? `linear-gradient(135deg, ${PINK}, #FF69B4)`
                  : "#E0D8D0",
                border: "none",
                color: canProceed1 ? "#fff" : "#aaa",
                fontFamily: "Jost, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.1em",
                cursor: canProceed1 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* ── STEP 2: YOUR STORY ── */}
        {step === 2 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: 700,
                color: "#111",
                margin: "0 0 4px",
              }}
            >
              Your story
            </h2>
            <p
              style={{
                fontFamily: "Jost, sans-serif",
                fontSize: 12,
                color: "#999",
                margin: "0 0 8px",
              }}
            >
              We read every word.
            </p>

            <label style={labelStyle}>Why do you want to join?</label>
            <textarea
              style={{
                ...inputStyle,
                minHeight: 100,
                resize: "vertical" as const,
                lineHeight: 1.6,
              }}
              placeholder="What draws you to this club..."
              value={form.whyJoin}
              onChange={(e) => update("whyJoin", e.target.value)}
            />

            <label style={labelStyle}>What would you bring to the club?</label>
            <textarea
              style={{
                ...inputStyle,
                minHeight: 100,
                resize: "vertical" as const,
                lineHeight: 1.6,
              }}
              placeholder="Your energy, ideas, perspective..."
              value={form.whatBring}
              onChange={(e) => update("whatBring", e.target.value)}
            />

            <label style={labelStyle}>
              What does community mean to you?
            </label>
            <input
              style={inputStyle}
              placeholder="In a sentence or two"
              value={form.communityMeaning}
              onChange={(e) => update("communityMeaning", e.target.value)}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  borderRadius: 50,
                  background: "transparent",
                  border: "1.5px solid #E0D8D0",
                  color: "#666",
                  fontFamily: "Jost, sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed2}
                style={{
                  flex: 2,
                  padding: "14px 0",
                  borderRadius: 50,
                  background: canProceed2
                    ? `linear-gradient(135deg, ${PINK}, #FF69B4)`
                    : "#E0D8D0",
                  border: "none",
                  color: canProceed2 ? "#fff" : "#aaa",
                  fontFamily: "Jost, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  cursor: canProceed2 ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: CONFIRM ── */}
        {step === 3 && (
          <div>
            {/* Club summary card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 20,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: 20,
                  fontStyle: "italic",
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 4px",
                }}
              >
                {MOCK_CLUB.name}
              </h2>
              <span
                style={{
                  display: "inline-block",
                  background:
                    MOCK_CLUB.membershipType === "Free"
                      ? "#E8F8F0"
                      : "#FFF0E8",
                  color:
                    MOCK_CLUB.membershipType === "Free"
                      ? "#1A9A5A"
                      : "#C44B00",
                  fontFamily: "Jost, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: 20,
                  padding: "3px 10px",
                  marginBottom: 16,
                }}
              >
                {MOCK_CLUB.membershipType}
              </span>

              <div style={{ marginBottom: 20 }}>
                {MOCK_CLUB.rules.map((rule, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: PINK,
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "Jost, sans-serif",
                        fontSize: 13,
                        color: "#444",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {rule}
                    </p>
                  </div>
                ))}
              </div>

              {/* Agree checkbox */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => update("agreed", !form.agreed)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `2px solid ${form.agreed ? PINK : "#C8BEB4"}`,
                    background: form.agreed ? PINK : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {form.agreed && (
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "Jost, sans-serif",
                    fontSize: 12,
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  I&apos;ve read and agree to the club values
                </span>
              </label>
            </div>

            {/* Paid club price card */}
            {MOCK_CLUB.isPaid && MOCK_CLUB.price !== null && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 20,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  marginBottom: 16,
                  borderLeft: `4px solid ${PINK}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "Jost, sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: PINK,
                    margin: "0 0 6px",
                  }}
                >
                  Membership Fee
                </p>
                <p
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#111",
                    margin: "0 0 8px",
                  }}
                >
                  ${MOCK_CLUB.price}
                  <span
                    style={{
                      fontFamily: "Jost, sans-serif",
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    /month
                  </span>
                </p>
                <p
                  style={{
                    fontFamily: "Jost, sans-serif",
                    fontSize: 12,
                    color: "#888",
                    margin: 0,
                  }}
                >
                  You&apos;ll be charged after acceptance.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  borderRadius: 50,
                  background: "transparent",
                  border: "1.5px solid #E0D8D0",
                  color: "#666",
                  fontFamily: "Jost, sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setSubmitted(true)}
                disabled={!form.agreed}
                style={{
                  flex: 2,
                  padding: "14px 0",
                  borderRadius: 50,
                  background: form.agreed
                    ? `linear-gradient(135deg, ${PINK}, #FF69B4)`
                    : "#E0D8D0",
                  border: "none",
                  color: form.agreed ? "#fff" : "#aaa",
                  fontFamily: "Jost, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  cursor: form.agreed ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                Submit Application ♡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
