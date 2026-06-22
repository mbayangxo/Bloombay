"use client";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";

interface Question {
  id: string;
  kind: string;
  prompt: string;
  option_a: string | null;
  option_b: string | null;
}

interface QuestionData {
  question: Question | null;
  my_answer: "a" | "b" | null;
  counts: { a: number; b: number } | null;
  week_of: string;
}

export function ThisOrThatCard() {
  const [data, setData] = useState<QuestionData | null>(null);
  const [voting, setVoting] = useState(false);
  const [localAnswer, setLocalAnswer] = useState<"a" | "b" | null>(null);
  const [localCounts, setLocalCounts] = useState<{ a: number; b: number } | null>(null);

  useEffect(() => {
    fetch("/api/member/yande-question?kind=this_or_that")
      .then(r => r.ok ? r.json() : null)
      .then((d: QuestionData | null) => {
        if (!d?.question) return;
        setData(d);
        setLocalAnswer(d.my_answer);
        setLocalCounts(d.counts);
      })
      .catch(() => null);
  }, []);

  async function vote(choice: "a" | "b") {
    if (!data?.question || voting || localAnswer) return;
    setVoting(true);
    setLocalAnswer(choice);
    // Optimistic update
    setLocalCounts(prev => prev ? { ...prev, [choice]: (prev[choice] ?? 0) + 1 } : { a: choice === "a" ? 1 : 0, b: choice === "b" ? 1 : 0 });
    await fetch("/api/member/yande-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: data.question.id, answer: choice }),
    }).catch(() => null);
    setVoting(false);
  }

  if (!data?.question) return null;
  const { question } = data;
  const answered = localAnswer !== null;
  const total = (localCounts?.a ?? 0) + (localCounts?.b ?? 0);
  const pctA = total > 0 ? Math.round(((localCounts?.a ?? 0) / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div style={{ margin: "0 0 4px" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 10 }}>
        ✦ THIS OR THAT
      </p>
      <div style={{ background: "white", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,31,125,0.1)", boxShadow: "0 2px 12px rgba(255,31,125,0.06)" }}>
        <div style={{ padding: "18px 18px 14px" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: "#111", margin: "0 0 16px", lineHeight: 1.3 }}>
            {question.prompt}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {(["a", "b"] as const).map(choice => {
              const label = choice === "a" ? question.option_a : question.option_b;
              const pct = choice === "a" ? pctA : pctB;
              const isChosen = localAnswer === choice;
              return (
                <button
                  key={choice}
                  onClick={() => vote(choice)}
                  disabled={answered || voting}
                  style={{
                    flex: 1,
                    position: "relative",
                    padding: "14px 12px",
                    borderRadius: 14,
                    border: isChosen ? `2px solid ${PINK}` : "2px solid rgba(255,31,125,0.15)",
                    background: isChosen ? `rgba(255,31,125,0.06)` : "white",
                    cursor: answered ? "default" : "pointer",
                    overflow: "hidden",
                    transition: "all 0.2s",
                    textAlign: "left" as const,
                  }}
                >
                  {/* Progress bar background */}
                  {answered && (
                    <div style={{ position: "absolute", inset: 0, background: `rgba(255,31,125,${isChosen ? "0.08" : "0.03"})`, width: `${pct}%`, transition: "width 0.6s ease" }} />
                  )}
                  <span style={{ position: "relative", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: isChosen ? PINK : "#555" }}>
                    {label}
                  </span>
                  {answered && (
                    <span style={{ position: "relative", display: "block", fontFamily: "var(--font-jost)", fontSize: 10, color: isChosen ? PINK : "#aaa", marginTop: 4, fontWeight: 600 }}>
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {!answered && (
          <div style={{ padding: "0 18px 14px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb", margin: 0 }}>
              Yande wants to know your vibe.
            </p>
          </div>
        )}
        {answered && (
          <div style={{ padding: "0 18px 14px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb", margin: 0 }}>
              {total} {total === 1 ? "woman" : "women"} answered this week.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
