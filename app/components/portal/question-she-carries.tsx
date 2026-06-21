"use client";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";

interface QuestionData {
  question: { id: string; prompt: string } | null;
  my_answer: string | null;
  week_of: string;
}

export function QuestionSheCaries({ editable = false }: { editable?: boolean }) {
  const [data, setData] = useState<QuestionData | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/member/yande-question?kind=open_question")
      .then(r => r.ok ? r.json() : null)
      .then((d: QuestionData | null) => {
        if (!d?.question) return;
        setData(d);
        if (d.my_answer) setDraft(d.my_answer);
      })
      .catch(() => null);
  }, []);

  async function save() {
    if (!data?.question || !draft.trim() || saving) return;
    setSaving(true);
    await fetch("/api/member/yande-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: data.question.id, answer: draft }),
    }).catch(() => null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data?.question) return null;

  const hasAnswer = data.my_answer || (editable && draft.trim());

  return (
    <div style={{ background: "white", borderRadius: 16, padding: "16px 18px", border: "1px solid rgba(255,31,125,0.1)", boxShadow: "0 2px 10px rgba(255,31,125,0.05)" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 10 }}>
        ✦ WHAT SHE&apos;S CARRYING THIS WEEK
      </p>
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "#888", marginBottom: hasAnswer ? 10 : 0, lineHeight: 1.45 }}>
        {data.question.prompt}
      </p>

      {editable ? (
        <>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Write something true…"
            maxLength={280}
            rows={3}
            style={{
              width: "100%", background: "#FFF8F0", border: "1.5px solid rgba(255,31,125,0.15)",
              borderRadius: 10, padding: "10px 12px", fontFamily: "var(--font-jost)", fontSize: 13,
              color: "#333", outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.55,
              marginBottom: 10,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#ccc" }}>{draft.length}/280</span>
            <button
              onClick={save}
              disabled={saving || !draft.trim()}
              style={{
                fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: saved ? "#22c55e" : PINK,
                background: "none", border: "none", cursor: saving ? "default" : "pointer",
              }}
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save answer →"}
            </button>
          </div>
        </>
      ) : data.my_answer ? (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#333", lineHeight: 1.6, fontWeight: 500 }}>
          &ldquo;{data.my_answer}&rdquo;
        </p>
      ) : null}
    </div>
  );
}
