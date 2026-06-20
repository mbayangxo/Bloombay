"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GIRLS_WORKING_FILTERS } from "@/lib/girls-working/job-types";
import {
  createGirlsWorkingJob,
  deleteGirlsWorkingJob,
  listGirlsWorkingJobs,
  resetGirlsWorkingToSeed,
  saveGirlsWorkingJob,
} from "@/lib/girls-working/store";
import type { GirlsWorkingJob, GirlsWorkingJobType } from "@/lib/girls-working/types";

const EMPTY_DRAFT = {
  title: "",
  company: "",
  neighborhood: "",
  city: "New York",
  jobType: "fashion" as GirlsWorkingJobType,
  description: "",
  payLabel: "",
  schedule: "",
  applyUrl: "",
  applyEmail: "",
  published: true,
  featured: false,
};

export function GirlsWorkingStudio() {
  const [jobs, setJobs] = useState<GirlsWorkingJob[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [isNew, setIsNew] = useState(false);

  const refresh = useCallback(() => {
    const list = listGirlsWorkingJobs(false);
    setJobs(list);
    if (!selectedId && !isNew && list[0]) setSelectedId(list[0].id);
  }, [selectedId, isNew]);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-girls-working-updated", refresh);
    return () => window.removeEventListener("bb-girls-working-updated", refresh);
  }, [refresh]);

  const selected = useMemo(
    () => jobs.find((j) => j.id === selectedId) ?? null,
    [jobs, selectedId]
  );

  useEffect(() => {
    if (isNew) return;
    if (!selected) return;
    setDraft({
      title: selected.title,
      company: selected.company,
      neighborhood: selected.neighborhood,
      city: selected.city,
      jobType: selected.jobType,
      description: selected.description,
      payLabel: selected.payLabel ?? "",
      schedule: selected.schedule ?? "",
      applyUrl: selected.applyUrl ?? "",
      applyEmail: selected.applyEmail ?? "",
      published: selected.published,
      featured: selected.featured ?? false,
    });
  }, [selected, isNew]);

  function startNew() {
    setIsNew(true);
    setSelectedId(null);
    setDraft(EMPTY_DRAFT);
  }

  function save() {
    if (!draft.title.trim() || !draft.company.trim()) return;
    if (isNew) {
      const created = createGirlsWorkingJob({
        ...draft,
        payLabel: draft.payLabel || undefined,
        schedule: draft.schedule || undefined,
        applyUrl: draft.applyUrl || undefined,
        applyEmail: draft.applyEmail || undefined,
      });
      setIsNew(false);
      setSelectedId(created.id);
    } else if (selected) {
      saveGirlsWorkingJob({
        ...selected,
        ...draft,
        payLabel: draft.payLabel || undefined,
        schedule: draft.schedule || undefined,
        applyUrl: draft.applyUrl || undefined,
        applyEmail: draft.applyEmail || undefined,
      });
    }
    refresh();
  }

  function remove() {
    if (!selected || isNew) return;
    if (!confirm(`Remove “${selected.title}” at ${selected.company}?`)) return;
    deleteGirlsWorkingJob(selected.id);
    setSelectedId(null);
    setIsNew(false);
    refresh();
  }

  return (
    <div className="bb-gw-studio">
      <aside>
        <p className="fp-portal-muted" style={{ margin: "0 0 0.5rem", fontSize: "0.78rem" }}>
          NYC jobs women want — published to the Lobby · Girls Working door.
        </p>
        <div className="bb-gw-studio__list">
          {jobs.map((j) => (
            <button
              key={j.id}
              type="button"
              className={`bb-gw-studio__job-btn${selectedId === j.id && !isNew ? " bb-gw-studio__job-btn--active" : ""}`}
              onClick={() => {
                setIsNew(false);
                setSelectedId(j.id);
              }}
            >
              <strong>{j.title}</strong>
              <br />
              <span style={{ opacity: 0.75 }}>
                {j.company} · {j.published ? "Live" : "Draft"}
              </span>
            </button>
          ))}
        </div>
        <div className="bb-gw-studio__actions" style={{ marginTop: "0.75rem" }}>
          <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={startNew}>
            + Add job
          </button>
          <button type="button" className="fp-portal-btn" onClick={() => resetGirlsWorkingToSeed()}>
            Reset seeds
          </button>
        </div>
      </aside>

      <div className="bb-gw-studio__form">
        <h3 style={{ margin: 0 }}>{isNew ? "New posting" : "Edit posting"}</h3>
        <label>
          Title
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Social Media Coordinator"
          />
        </label>
        <label>
          Company
          <input
            value={draft.company}
            onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
          />
        </label>
        <label>
          Job type
          <select
            value={draft.jobType}
            onChange={(e) => setDraft((d) => ({ ...d, jobType: e.target.value as GirlsWorkingJobType }))}
          >
            {GIRLS_WORKING_FILTERS.filter((f) => f.id !== "all").map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Neighborhood
          <input
            value={draft.neighborhood}
            onChange={(e) => setDraft((d) => ({ ...d, neighborhood: e.target.value }))}
          />
        </label>
        <label>
          Description
          <textarea
            rows={4}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
        </label>
        <label>
          Pay
          <input
            value={draft.payLabel}
            onChange={(e) => setDraft((d) => ({ ...d, payLabel: e.target.value }))}
            placeholder="$18/hr · $55K"
          />
        </label>
        <label>
          Schedule
          <input
            value={draft.schedule}
            onChange={(e) => setDraft((d) => ({ ...d, schedule: e.target.value }))}
          />
        </label>
        <label>
          Apply URL
          <input
            value={draft.applyUrl}
            onChange={(e) => setDraft((d) => ({ ...d, applyUrl: e.target.value }))}
          />
        </label>
        <label>
          <span>
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
            />{" "}
            Published (visible in Girls Working)
          </span>
        </label>
        <label>
          <span>
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
            />{" "}
            Girl pick (featured pin)
          </span>
        </label>
        <div className="bb-gw-studio__actions">
          <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={save}>
            Save
          </button>
          {!isNew && selected ? (
            <button type="button" className="fp-portal-btn" onClick={remove}>
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
