"use client";

import { useEffect, useState } from "react";
import { CuratorShell } from "@/app/components/curator/curator-shell";
import {
  findTeamMemberByEmail,
  listPayoutsForMember,
  type FounderTeamMember,
  type TeamPayout,
} from "@/lib/founder-team-store";
import { CURATOR_PROFILE } from "@/lib/curator-portal-data";
import Link from "next/link";

export default function CuratorPayPage() {
  const [member, setMember] = useState<FounderTeamMember | undefined>();
  const [payouts, setPayouts] = useState<TeamPayout[]>([]);

  useEffect(() => {
    function load() {
      const m = findTeamMemberByEmail(CURATOR_PROFILE.email);
      setMember(m);
      setPayouts(m ? listPayoutsForMember(m.id) : []);
    }
    load();
    window.addEventListener("bb-team-payouts", load);
    return () => window.removeEventListener("bb-team-payouts", load);
  }, []);

  return (
    <CuratorShell
      title="Pay"
      subtitle="Founders pay you from Mission Control — demo payouts appear here when your email is on the team roster."
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>{payouts.length}</strong>
          <span>Demo payouts</span>
        </div>
        <div className="cu-stat">
          <strong>
            ${payouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </strong>
          <span>Total received</span>
        </div>
      </div>

      {member ? (
        <article className="cu-card">
          <h2>Payout method on file</h2>
          <p className="cu-note">
            <strong>{member.paymentMethod}</strong>
            {member.paymentHandle ? ` · ${member.paymentHandle}` : " · ask founder to add handle"}
          </p>
          {member.lastPaidAt ? (
            <p className="cu-note">Last paid {new Date(member.lastPaidAt).toLocaleDateString()}</p>
          ) : (
            <p className="cu-note">No payouts yet — founder pays from Team · Curators & pay.</p>
          )}
        </article>
      ) : (
        <article className="cu-card">
          <h2>Not on roster yet</h2>
          <p className="cu-note">
            Sign in as <strong>{CURATOR_PROFILE.email}</strong> and ask a founder to assign you in{" "}
            <Link href="/founder/team" style={{ color: "var(--cu-hot)", fontWeight: 600 }}>
              Founder → Curators & pay
            </Link>
            .
          </p>
        </article>
      )}

      <article className="cu-card">
        <h2>Payout history</h2>
        {payouts.length === 0 ? (
          <p className="cu-note">No demo payouts yet. Founders tap Pay $75 / $150 / $300 on your row.</p>
        ) : (
          <ul className="cu-list">
            {payouts.map((p) => (
              <li key={p.id} className="cu-list__row">
                <div>
                  <strong>${p.amount}</strong>
                  <p className="cu-note">{p.note}</p>
                </div>
                <span className="cu-badge cu-badge--welcomed">
                  {new Date(p.paidAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </CuratorShell>
  );
}
