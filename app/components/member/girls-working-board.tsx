"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GIRLS_WORKING_FILTERS } from "@/lib/girls-working/job-types";
import { JOB_TYPE_LABELS } from "@/lib/girls-working/job-types";
import { listGirlsWorkingByType } from "@/lib/girls-working/store";
import type { GirlsWorkingJob, GirlsWorkingJobType } from "@/lib/girls-working/types";

export function GirlsWorkingBoard() {
  const [filter, setFilter] = useState<GirlsWorkingJobType | "all">("all");
  const [jobs, setJobs] = useState<GirlsWorkingJob[]>([]);

  const refresh = useCallback(() => {
    setJobs(listGirlsWorkingByType(filter, true));
  }, [filter]);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-girls-working-updated", refresh);
    return () => window.removeEventListener("bb-girls-working-updated", refresh);
  }, [refresh]);

  const empty = useMemo(() => jobs.length === 0, [jobs]);

  return (
    <div className="bb-girls-working-board">
      <nav className="bb-girls-working-filters" aria-label="Filter by job type">
        {GIRLS_WORKING_FILTERS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`bb-girls-working-filter${filter === chip.id ? " bb-girls-working-filter--active" : ""}`}
            onClick={() => setFilter(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </nav>

      {empty ? (
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--mp-muted)" }}>
          No postings in this category yet — check back soon or try All.
        </p>
      ) : (
        <div className="bb-girls-working-postings" role="list">
          {jobs.map((job, i) => {
            const href = job.applyUrl ?? (job.applyEmail ? `mailto:${job.applyEmail}` : undefined);
            const Tag = href ? "a" : "article";
            return (
              <Tag
                key={job.id}
                href={href}
                target={job.applyUrl ? "_blank" : undefined}
                rel={job.applyUrl ? "noopener noreferrer" : undefined}
                className={`bb-girls-working-posting${job.featured ? " bb-girls-working-posting--featured" : ""}`}
                style={{ "--bb-tilt": `${(i % 3) - 1}deg` } as React.CSSProperties}
                role="listitem"
              >
                <p className="bb-girls-working-posting__type">{JOB_TYPE_LABELS[job.jobType]}</p>
                <h3 className="bb-girls-working-posting__title">{job.title}</h3>
                <p className="bb-girls-working-posting__company">{job.company}</p>
                <p className="bb-girls-working-posting__place">
                  {job.neighborhood} · {job.city}
                </p>
                <p className="bb-girls-working-posting__body">{job.description}</p>
                {(job.payLabel || job.schedule) && (
                  <p className="bb-girls-working-posting__meta">
                    {[job.payLabel, job.schedule].filter(Boolean).join(" · ")}
                  </p>
                )}
                {href ? <span className="bb-girls-working-posting__cta">Apply →</span> : null}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
}
