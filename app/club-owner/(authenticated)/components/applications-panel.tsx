"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { logAudit } from "@/lib/club-owner-store";
import type { ClubApplication } from "@/lib/club-host-store";
import { ApplicationDetail } from "./application-detail";

type ApiApplication = {
  id: string;
  status: string;
  message: string;
  applicant_name: string;
  city: string | null;
  instagram: string | null;
  created_at: string;
  profile: { avatar_url: string | null } | null;
};

function mapApplication(a: ApiApplication): ClubApplication {
  const status = a.status === "approved" || a.status === "denied" ? a.status : "pending";
  return {
    id: a.id,
    clubId: "",
    applicantName: a.applicant_name,
    city: a.city ?? "",
    instagram: a.instagram ?? undefined,
    why: a.message,
    status,
    submittedAt: a.created_at,
    photoUrl: a.profile?.avatar_url ?? undefined,
  };
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
  const [allApps, setAllApps] = useState<ClubApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const selectedId = searchParams.get("id");
  const selected = selectedId ? allApps.find((a) => a.id === selectedId) : undefined;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/club-portal/applications?status=all");
      if (res.ok) {
        const data = (await res.json()) as ApiApplication[];
        setAllApps(data.map(mapApplication));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
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

  async function decide(id: string, decision: "approved" | "denied") {
    const app = allApps.find((a) => a.id === id);
    setBusyId(id);
    try {
      const res = await fetch("/api/club-portal/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: id, status: decision }),
      });
      if (res.ok && app) {
        logAudit(clubId, decision === "approved" ? "Accepted application" : "Denied application", app.applicantName);
      }
      await refresh();
      closeDetail();
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = allApps.filter((a) => a.status === "pending").length;
  const apps = filter === "pending" ? allApps.filter((a) => a.status === "pending") : allApps;

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

      {loading ? (
        <p className="co-hint" style={{ marginTop: "1rem" }}>
          Loading applications…
        </p>
      ) : apps.length === 0 ? (
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
            <ApplicationDetail
              app={selected}
              busy={busyId === selected.id}
              onDecide={decide}
              onClose={closeDetail}
            />
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

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
