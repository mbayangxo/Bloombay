"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  decideApplication,
  getApplicationById,
  listApplications,
  type ClubApplication,
} from "@/lib/club-host-store";
import { addClubMember, logAudit } from "@/lib/club-owner-store";
import { ApplicationDetail } from "./application-detail";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function previewWhy(text: string, max = 72) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function ApplicationsPanel({ clubId }: { clubId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apps, setApps] = useState<ClubApplication[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const selectedId = searchParams.get("id");
  const selected = selectedId ? getApplicationById(selectedId) : undefined;

  const refresh = useCallback(() => {
    setApps(filter === "pending" ? listApplications(clubId, "pending") : listApplications(clubId));
  }, [clubId, filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function openApplication(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", id);
    router.push(`/club-owner/applications?${params.toString()}`, { scroll: false });
  }

  function closeDetail() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const q = params.toString();
    router.push(q ? `/club-owner/applications?${q}` : "/club-owner/applications", { scroll: false });
  }

  function decide(id: string, decision: "approved" | "denied") {
    const app = getApplicationById(id);
    decideApplication(id, decision);
    if (decision === "approved" && app) {
      addClubMember(clubId, {
        name: app.applicantName,
        city: app.city,
        instagram: app.instagram,
      });
      logAudit(clubId, "Accepted application", app.applicantName);
    } else if (app) {
      logAudit(clubId, "Denied application", app.applicantName);
    }
    refresh();
    closeDetail();
  }

  const pendingCount = listApplications(clubId, "pending").length;

  return (
    <div>
      <p className="co-hint co-applications-hint">
        Tap an applicant to see their photo and full application. We use a <strong>vertical list</strong> so you can
        scan one person at a time — best on phone and desktop.
      </p>

      <div className="co-tabs">
        <button
          type="button"
          className={filter === "pending" ? "co-tabs__active" : ""}
          onClick={() => {
            setFilter("pending");
            closeDetail();
          }}
        >
          Pending ({pendingCount})
        </button>
        <button
          type="button"
          className={filter === "all" ? "co-tabs__active" : ""}
          onClick={() => {
            setFilter("all");
            closeDetail();
          }}
        >
          All
        </button>
      </div>

      {apps.length === 0 ? (
        <p className="co-hint" style={{ marginTop: "1rem" }}>
          No {filter === "pending" ? "pending " : ""}applications right now.
        </p>
      ) : (
        <div className={`co-applications-layout${selected ? " co-applications-layout--open" : ""}`}>
          <ul className="co-application-list" role="list">
            {apps.map((app) => {
              const gradient = app.photoGradient ?? "linear-gradient(135deg,#ffe4ec,#ffb7ce)";
              const isSelected = selectedId === app.id;
              return (
                <li key={app.id}>
                  <button
                    type="button"
                    className={`co-application-row${isSelected ? " co-application-row--selected" : ""}`}
                    onClick={() => openApplication(app.id)}
                  >
                    <span
                      className="co-application-row__photo"
                      style={
                        app.photoUrl
                          ? {
                              backgroundImage: `url(${app.photoUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : { background: gradient }
                      }
                    >
                      {!app.photoUrl ? initials(app.applicantName) : null}
                    </span>
                    <span className="co-application-row__body">
                      <span className="co-application-row__top">
                        <strong>{app.applicantName}</strong>
                        <span className={`co-badge co-badge--${app.status}`}>{app.status}</span>
                      </span>
                      <span className="co-application-row__meta">
                        {app.city}
                        {app.instagram ? ` · ${app.instagram}` : ""}
                      </span>
                      <span className="co-application-row__preview">{previewWhy(app.why)}</span>
                      <span className="co-application-row__when">{formatWhen(app.submittedAt)}</span>
                    </span>
                    <span className="co-application-row__chevron" aria-hidden>
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {selected ? (
            <ApplicationDetail app={selected} onDecide={decide} onClose={closeDetail} />
          ) : (
            <div className="co-application-placeholder" aria-hidden>
              <p>Select an application to review photo, story, and approve or deny.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
