"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addApplicationQuestion,
  listOwnApplicationQuestions,
  removeApplicationQuestion,
  type ClubApplicationQuestion,
} from "@/lib/actions/clubs";

export function ApplicationQuestionsEditor({ clubId }: { clubId: string }) {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<ClubApplicationQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [required, setRequired] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setQuestions(await listOwnApplicationQuestions(clubId));
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  async function add() {
    if (!newQuestion.trim()) return;
    setBusy(true);
    try {
      await addApplicationQuestion(clubId, newQuestion, required);
      setNewQuestion("");
      setRequired(false);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      await removeApplicationQuestion(id);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="co-hint" style={{ marginBottom: "1rem" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", font: "inherit", textDecoration: "underline" }}
      >
        {open ? "Hide application questions ▲" : "Add your own application questions ▼"}
      </button>

      {open && (
        <div style={{ marginTop: 10 }}>
          <p style={{ marginBottom: 8 }}>
            Every applicant answers your club&apos;s fixed fields (name, city, why they want in). Add extra
            questions of your own — applicants will see these too.
          </p>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginBottom: 12 }}>
              {questions.map((q) => (
                <li key={q.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0" }}>
                  <span>
                    {q.question}
                    {q.required ? " *" : ""}
                  </span>
                  <button type="button" className="co-btn co-btn--ghost" disabled={busy} onClick={() => remove(q.id)}>
                    Remove
                  </button>
                </li>
              ))}
              {questions.length === 0 && <li>No custom questions yet.</li>}
            </ul>
          )}

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              className="co-input"
              placeholder="e.g. What's your favorite way to spend a Sunday?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
              Required
            </label>
            <button type="button" className="co-btn co-btn--primary" disabled={busy || !newQuestion.trim()} onClick={add}>
              Add question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
