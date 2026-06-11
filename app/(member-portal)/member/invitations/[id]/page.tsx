"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PINK = "#FF1F7D";

// ── Shared invitation data ─────────────────────────────────────────────────────

export const INVITATION_DATA: Record<string, {
  id: string;
  tag: string;
  tagColor: string;
  event: string;
  from: string;
  fromFull: string;
  fromInitial: string;
  fromColor: string;
  venue: string;
  time: string;
  seatsRemaining: number;
  price: string;
  type: string;
  note: string;
  guests: { name: string; initial: string; color: string }[];
  sentAt: string;
}> = {
  "1": {
    id: "1",
    tag: "TONIGHT",
    tagColor: "#FF1F7D",
    event: "Girls Dinner · Carbone",
    from: "Aminah",
    fromFull: "Aminah M.",
    fromInitial: "Am",
    fromColor: "#FF69B4",
    venue: "Carbone · 181 Thompson St, SoHo",
    time: "Tonight · 7:30 PM",
    seatsRemaining: 2,
    price: "Individual pay",
    type: "dinner",
    note: "I saved you a seat. I hope you can make it — it's going to be one of those nights.",
    guests: [
      { name: "Aminah", initial: "Am", color: "#FF69B4" },
      { name: "Sofia", initial: "S", color: "#FF1F7D" },
      { name: "Kezia", initial: "K", color: "#C084FC" },
    ],
    sentAt: "2 hours ago",
  },
  "2": {
    id: "2",
    tag: "SUNDAY",
    tagColor: "#83C5A0",
    event: "Pilates + Matcha Morning",
    from: "Sofia",
    fromFull: "Sofia K.",
    fromInitial: "S",
    fromColor: "#FF1F7D",
    venue: "Studio Bloom · Williamsburg",
    time: "Sunday · 9:00 AM",
    seatsRemaining: 3,
    price: "$20",
    type: "wellness",
    note: "Come move with us. You'll start Sunday right — I promise.",
    guests: [
      { name: "Sofia", initial: "S", color: "#FF1F7D" },
      { name: "Maya", initial: "Ma", color: "#FF69B4" },
      { name: "Jade", initial: "J", color: "#FF1F7D" },
    ],
    sentAt: "Yesterday",
  },
  "3": {
    id: "3",
    tag: "SATURDAY",
    tagColor: "#EC4899",
    event: "MoMA + Froyo After",
    from: "Girl Creatives",
    fromFull: "Girl Creatives Club",
    fromInitial: "GC",
    fromColor: "#EC4899",
    venue: "MoMA · 11 W 53rd St, Midtown",
    time: "Saturday · 2:00 PM",
    seatsRemaining: 5,
    price: "$1 deposit hold",
    type: "culture",
    note: "We're going as a group. Art, conversation, froyo after. You'd fit right in.",
    guests: [
      { name: "Yemi", initial: "Y", color: "#EC4899" },
      { name: "Amara", initial: "A", color: "#FF69B4" },
      { name: "Nadia", initial: "N", color: "#FF1F7D" },
    ],
    sentAt: "3 days ago",
  },
};

// ── Wax Seal ───────────────────────────────────────────────────────────────────

function WaxSeal({ size = 72 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "radial-gradient(circle at 38% 32%, #E8006A, #AA0048)",
      boxShadow: "0 4px 18px rgba(170,0,72,0.45), inset 0 1px 2px rgba(255,255,255,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", flexShrink: 0,
    }}>
      {/* inner ring */}
      <div style={{
        position: "absolute", inset: 5, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.22)",
      }} />
      {/* BB monogram */}
      <div style={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
        <span style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
          fontSize: size * 0.3, color: "rgba(255,255,255,0.92)", lineHeight: 1, letterSpacing: -1,
        }}>B</span>
        <span style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
          fontSize: size * 0.3, color: "rgba(255,255,255,0.92)", lineHeight: 1,
          display: "inline-block", transform: "scaleX(-1)", letterSpacing: -1,
        }}>B</span>
      </div>
    </div>
  );
}

// ── Decorative petals ──────────────────────────────────────────────────────────

function Petals() {
  const petals = [
    { top: "6%", left: "8%", rotate: -25, scale: 0.7, opacity: 0.18 },
    { top: "12%", right: "6%", rotate: 40, scale: 0.55, opacity: 0.14 },
    { top: "38%", left: "3%", rotate: 15, scale: 0.45, opacity: 0.1 },
    { bottom: "28%", right: "5%", rotate: -55, scale: 0.6, opacity: 0.13 },
    { bottom: "14%", left: "10%", rotate: 70, scale: 0.5, opacity: 0.11 },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {petals.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          top: p.top, bottom: p.bottom, left: p.left, right: p.right,
          transform: `rotate(${p.rotate}deg) scale(${p.scale})`,
          opacity: p.opacity,
        }}>
          <svg width="48" height="64" viewBox="0 0 48 64" fill="none">
            <ellipse cx="24" cy="32" rx="18" ry="30" fill={PINK} />
            <ellipse cx="24" cy="32" rx="10" ry="22" fill="rgba(255,255,255,0.3)" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ── Invitation Detail Page ─────────────────────────────────────────────────────

export default function InvitationDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "1";
  const invite = INVITATION_DATA[id] ?? INVITATION_DATA["1"];

  const [opened, setOpened] = useState(false);
  const [rsvp, setRsvp] = useState<"accepted" | "declined" | null>(null);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #FFF5F8 0%, #FFE8F4 45%, #FFF0F8 100%)",
      position: "relative",
    }}>
      <Petals />

      {/* Top bar */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "56px 20px 12px",
      }}>
        <Link href="/member/messages?filter=invitations" style={{
          width: 38, height: 38, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,31,125,0.08)",
          border: "1px solid rgba(255,31,125,0.16)",
          textDecoration: "none",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.4" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <p style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "rgba(255,31,125,0.5)",
        }}>
          ✦ BLOOMBAY INVITATION
        </p>

        <div style={{ width: 38 }} />
      </div>

      {/* Card area */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "8px 20px 100px",
      }}>
        <div style={{ width: "100%", maxWidth: 360, position: "relative" }}>

          {/* Stacked paper behind card */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: 24,
            background: "#FFF0F8",
            transform: "rotate(1.5deg)",
            opacity: 0.6,
            boxShadow: "0 8px 32px rgba(255,31,125,0.08)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: 24,
            background: "#FFF5FC",
            transform: "rotate(-0.75deg)",
            opacity: 0.45,
            boxShadow: "0 8px 32px rgba(255,31,125,0.06)",
          }} />

          {/* Main card */}
          <div style={{
            position: "relative",
            borderRadius: 24,
            background: "#FFFFFF",
            boxShadow: "0 12px 48px rgba(255,31,125,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}>

            {/* Card header — logo + wax seal */}
            <div style={{
              padding: "28px 28px 22px",
              textAlign: "center",
              borderBottom: "1px solid rgba(255,31,125,0.08)",
            }}>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.35em",
                textTransform: "uppercase", color: "rgba(255,31,125,0.38)",
                marginBottom: 10,
              }}>BLOOMBAY</p>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <WaxSeal size={76} />
              </div>

              <p style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: 15,
                color: "rgba(0,0,0,0.35)",
                letterSpacing: "0.04em",
              }}>Where you bloom.</p>
            </div>

            {/* Pink ribbon stripe */}
            <div style={{
              height: 38,
              background: `linear-gradient(90deg, ${PINK}CC, ${PINK}, ${PINK}CC)`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>✦</span>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.32em",
                color: "rgba(255,255,255,0.9)", textTransform: "uppercase",
              }}>
                {opened ? invite.tag : "YOU HAVE AN INVITATION"}
              </p>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>✦</span>
            </div>

            {!opened ? (
              /* ── PHASE 1: Envelope closed ─────────────────────────────── */
              <div style={{ padding: "28px 28px 32px", textAlign: "center" }}>
                {/* Sender avatar */}
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${invite.fromColor}, ${invite.fromColor}BB)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "white",
                  margin: "0 auto 14px",
                  boxShadow: `0 4px 16px ${invite.fromColor}44`,
                }}>
                  {invite.fromInitial}
                </div>

                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.36)", marginBottom: 4 }}>
                  An invitation from
                </p>
                <p style={{
                  fontSize: 18, fontWeight: 700,
                  fontFamily: "var(--font-playfair)", fontStyle: "italic",
                  color: "rgba(0,0,0,0.82)", marginBottom: 20,
                }}>
                  {invite.fromFull}
                </p>

                {/* Sealed note preview */}
                <div style={{
                  background: "rgba(255,31,125,0.04)",
                  border: "1px solid rgba(255,31,125,0.1)",
                  borderRadius: 16, padding: "16px 18px", marginBottom: 24,
                }}>
                  <p style={{
                    fontFamily: "var(--font-instrument)", fontStyle: "italic",
                    fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.65,
                  }}>
                    &ldquo;{invite.note.substring(0, 60)}…&rdquo;
                  </p>
                </div>

                <p style={{
                  fontSize: 9, color: "rgba(0,0,0,0.28)", letterSpacing: "0.18em",
                  textTransform: "uppercase", marginBottom: 20,
                }}>
                  sealed with care ♡
                </p>

                <button
                  onClick={() => setOpened(true)}
                  style={{
                    width: "100%", padding: "15px 0", borderRadius: 50,
                    background: PINK, color: "white",
                    fontSize: 13, fontWeight: 700, letterSpacing: "0.06em",
                    border: "none", cursor: "pointer",
                    boxShadow: `0 6px 20px ${PINK}44`,
                  }}
                >
                  OPEN INVITATION →
                </button>

                <p style={{
                  fontSize: 9, color: "rgba(0,0,0,0.22)", marginTop: 12,
                  fontFamily: "var(--font-instrument)", fontStyle: "italic",
                }}>
                  Sent {invite.sentAt}
                </p>
              </div>
            ) : (
              /* ── PHASE 2: Invitation revealed ─────────────────────────── */
              <div>
                <div style={{ padding: "24px 28px 0" }}>
                  {/* Tag + event name */}
                  <div style={{ marginBottom: 16 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      background: `${invite.tagColor}18`,
                      color: invite.tagColor,
                      border: `1px solid ${invite.tagColor}40`,
                      borderRadius: 50, padding: "4px 10px",
                    }}>
                      {invite.tag}
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
                    fontSize: "clamp(22px,6vw,28px)", color: "rgba(0,0,0,0.85)",
                    lineHeight: 1.15, marginBottom: 6,
                  }}>
                    {invite.event}
                  </h2>
                  <p style={{
                    fontSize: 11, color: "rgba(0,0,0,0.4)",
                    fontFamily: "var(--font-instrument)", fontStyle: "italic", marginBottom: 20,
                  }}>
                    {invite.venue}
                  </p>

                  {/* Details grid */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20,
                  }}>
                    {[
                      { label: "TIME", value: invite.time },
                      { label: "PRICE", value: invite.price },
                      { label: "SEATS LEFT", value: `${invite.seatsRemaining} remaining`, accent: true },
                      { label: "TYPE", value: invite.type },
                    ].map(({ label, value, accent }) => (
                      <div key={label} style={{
                        background: "rgba(255,31,125,0.04)",
                        border: "1px solid rgba(255,31,125,0.08)",
                        borderRadius: 12, padding: "10px 14px",
                      }}>
                        <p style={{
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.22em",
                          textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: 4,
                        }}>{label}</p>
                        <p style={{
                          fontSize: 13, fontWeight: 700,
                          color: accent ? PINK : "rgba(0,0,0,0.78)",
                          textTransform: label === "TYPE" ? "capitalize" : "none",
                        }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Who's going */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                      textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: 10,
                    }}>WHO&apos;S GOING</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {invite.guests.map(g => (
                        <div key={g.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: `linear-gradient(135deg, ${g.color}, ${g.color}BB)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, color: "white",
                            boxShadow: `0 2px 8px ${g.color}44`,
                          }}>{g.initial}</div>
                          <p style={{ fontSize: 8, color: "rgba(0,0,0,0.38)" }}>{g.name}</p>
                        </div>
                      ))}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%",
                          background: `${PINK}0D`,
                          border: `1.5px dashed ${PINK}55`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ color: PINK, fontSize: 18, lineHeight: 1 }}>+</span>
                        </div>
                        <p style={{ fontSize: 8, color: "rgba(0,0,0,0.28)" }}>You?</p>
                      </div>
                    </div>
                  </div>

                  {/* Sender note */}
                  <div style={{
                    background: `${invite.fromColor}08`,
                    border: `1px solid ${invite.fromColor}20`,
                    borderRadius: 16, padding: "14px 16px", marginBottom: 22,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${invite.fromColor}, ${invite.fromColor}BB)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0,
                      }}>{invite.fromInitial}</div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.78)" }}>{invite.fromFull}</p>
                        <p style={{ fontSize: 9, color: "rgba(0,0,0,0.3)" }}>{invite.sentAt}</p>
                      </div>
                    </div>
                    <p style={{
                      fontFamily: "var(--font-instrument)", fontStyle: "italic",
                      fontSize: 12, color: "rgba(0,0,0,0.55)", lineHeight: 1.65,
                    }}>
                      &ldquo;{invite.note}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Perforated divider */}
                <div style={{ margin: "0 28px 22px", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, borderTop: "1.5px dashed rgba(255,31,125,0.15)" }} />
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(160deg, #FFF5F8, #FFE8F4)",
                    border: "1px solid rgba(255,31,125,0.15)",
                  }} />
                  <div style={{ flex: 1, borderTop: "1.5px dashed rgba(255,31,125,0.15)" }} />
                </div>

                {/* RSVP */}
                <div style={{ padding: "0 28px 28px" }}>
                  {rsvp === null ? (
                    <>
                      <p style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                        textTransform: "uppercase", color: "rgba(0,0,0,0.3)",
                        textAlign: "center", marginBottom: 12,
                      }}>YOUR RSVP</p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => setRsvp("accepted")}
                          style={{
                            flex: 1, padding: "14px 0", borderRadius: 50,
                            background: PINK, color: "white",
                            fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                            boxShadow: `0 4px 16px ${PINK}44`,
                          }}
                        >
                          I&apos;m in ✓
                        </button>
                        <button
                          onClick={() => setRsvp("declined")}
                          style={{
                            flex: 1, padding: "14px 0", borderRadius: 50,
                            background: "transparent", color: "rgba(0,0,0,0.42)",
                            fontSize: 13, fontWeight: 600,
                            border: "1.5px solid rgba(0,0,0,0.12)", cursor: "pointer",
                          }}
                        >
                          Can&apos;t make it
                        </button>
                      </div>
                    </>
                  ) : rsvp === "accepted" ? (
                    <div style={{ textAlign: "center", padding: "8px 0" }}>
                      <p style={{ fontSize: 28, marginBottom: 8 }}>🌸</p>
                      <p style={{
                        fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
                        fontSize: 20, color: "rgba(0,0,0,0.82)", marginBottom: 6,
                      }}>You&apos;re going.</p>
                      <p style={{
                        fontSize: 11, color: "rgba(0,0,0,0.38)",
                        fontFamily: "var(--font-instrument)", fontStyle: "italic", marginBottom: 14,
                      }}>
                        Saved to your calendar · {invite.time}
                      </p>
                      <Link href="/member/calendar" style={{
                        display: "inline-block", padding: "10px 22px", borderRadius: 50,
                        background: `${PINK}12`, color: PINK,
                        border: `1px solid ${PINK}30`,
                        fontSize: 11, fontWeight: 700, textDecoration: "none",
                      }}>
                        View in Calendar →
                      </Link>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "12px 0" }}>
                      <p style={{
                        fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
                        fontSize: 17, color: "rgba(0,0,0,0.5)", marginBottom: 6,
                      }}>Another time.</p>
                      <p style={{
                        fontSize: 11, color: "rgba(0,0,0,0.3)",
                        fontFamily: "var(--font-instrument)", fontStyle: "italic",
                      }}>
                        You can always reach out when you&apos;re ready.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{
                  borderTop: "1px solid rgba(255,31,125,0.08)",
                  padding: "12px 28px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <p style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(0,0,0,0.18)", textTransform: "uppercase" }}>
                    BLOOMBAY INVITATION
                  </p>
                  <span style={{ color: `${PINK}40`, fontSize: 14 }}>✦</span>
                </div>
              </div>
            )}
          </div>

          {/* View full event */}
          {opened && (
            <Link href={`/member/happenings/${invite.id}`} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              marginTop: 14, padding: "13px 0", borderRadius: 16,
              background: "rgba(255,31,125,0.06)",
              color: "rgba(255,31,125,0.6)",
              border: "1px solid rgba(255,31,125,0.12)",
              fontSize: 11, fontWeight: 600, textDecoration: "none",
            }}>
              View full event details →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
