"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listMemberVerifications,
  updateMemberVerificationStatus,
  type MemberVerificationProfile,
} from "@/lib/member-verification-store";

export function MemberPhotoVerification() {
  const [rows, setRows] = useState<MemberVerificationProfile[]>([]);
  const [index, setIndex] = useState(0);

  const refresh = useCallback(() => {
    setRows(listMemberVerifications());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pending = useMemo(() => rows.filter((r) => r.status === "pending"), [rows]);
  const row = pending[index];

  function act(id: string, status: "approved" | "rejected") {
    updateMemberVerificationStatus(id, status);
    refresh();
    setIndex((i) => Math.max(0, i - 1));
  }

  if (pending.length === 0) {
    return (
      <section className="fp-submissions-section" style={{ marginTop: 24 }}>
        <h3 className="fp-submissions-section__title">Photo verification (onboarding)</h3>
        <p className="fp-portal-muted">No pending member photos. New sign-ups appear here after onboarding.</p>
      </section>
    );
  }

  return (
    <section className="fp-submissions-section" style={{ marginTop: 24 }}>
      <h3 className="fp-submissions-section__title">Photo verification (onboarding)</h3>
      <p className="fp-portal-muted">
        {index + 1} of {pending.length} — verify photo + about before full member access.
      </p>
      {row && (
        <article className="fp-verify-spotlight" style={{ marginTop: 16 }}>
          <div className="fp-verify-spotlight__photos">
            <div className="fp-verify-spotlight__photo">
              <span>Profile</span>
              {row.photoUrl ? (
                <img src={row.photoUrl} alt="" className="fp-verify-spotlight__img" style={{ objectFit: "cover" }} />
              ) : (
                <div className="fp-verify-spotlight__img">{row.firstName.charAt(0)}</div>
              )}
            </div>
          </div>
          <div className="fp-verify-spotlight__body">
            <h3>{row.firstName}</h3>
            <p>
              {row.city}, {row.country}
            </p>
            <p className="fp-portal-muted">{row.email}</p>
            <p>
              <strong>About:</strong> {row.about || "—"}
            </p>
            <p>
              <strong>Interests:</strong> {row.interests.join(", ") || "—"}
            </p>
            <p>
              <strong>Age:</strong> {row.ageRange}
            </p>
          </div>
          <div className="fp-verify-spotlight__actions">
            <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={() => act(row.id, "approved")}>
              Approve & let in
            </button>
            <button type="button" className="fp-portal-btn" onClick={() => act(row.id, "rejected")}>
              Reject
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
