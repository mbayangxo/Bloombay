"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  assignTeamMember,
  listFounderTeam,
  listTeamPayouts,
  recordTeamPayout,
  removeTeamMember,
  updateTeamMember,
  type FounderTeamMember,
  type PaymentMethod,
  type TeamPayout,
  type TeamRole,
} from "@/lib/founder-team-store";
import { McLink } from "../mc-link";

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "venmo", label: "Venmo" },
  { id: "zelle", label: "Zelle" },
  { id: "paypal", label: "PayPal" },
  { id: "direct_deposit", label: "Direct deposit" },
  { id: "unspecified", label: "Ask them" },
];

const PAY_AMOUNTS = [75, 150, 300] as const;

export function FounderTeamCenter() {
  return (
    <>
      <p className="fp-invites__team-banner">
        Send portal access links (Club Mama, Operations, Partner, etc.) from{" "}
        <McLink href="/founder/invites">Portal invites →</McLink>
      </p>
      <FounderTeamCenterInner />
    </>
  );
}

function FounderTeamCenterInner() {
  const [team, setTeam] = useState<FounderTeamMember[]>([]);
  const [payouts, setPayouts] = useState<TeamPayout[]>([]);
  const [filter, setFilter] = useState<"all" | TeamRole>("all");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("girl_curator");
  const [city, setCity] = useState("NYC");
  const [clubLabel, setClubLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("venmo");
  const [paymentHandle, setPaymentHandle] = useState("");
  const [payMsg, setPayMsg] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setTeam(listFounderTeam(filter === "all" ? undefined : filter));
    setPayouts(listTeamPayouts());
  }, [filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !clubLabel.trim()) return;
    assignTeamMember({
      name: name.trim(),
      email: email.trim() || "pending@bloombay.app",
      role,
      city,
      clubLabel: clubLabel.trim(),
      paymentMethod,
      paymentHandle: paymentHandle.trim(),
    });
    setName("");
    setEmail("");
    setClubLabel("");
    setPaymentHandle("");
    setPayMsg(`${name.trim()} assigned — set payout method before paying.`);
    refresh();
  }

  function pay(member: FounderTeamMember, amount: number) {
    if (member.paymentMethod === "unspecified" || !member.paymentHandle?.trim()) {
      setPayMsg(`Set a payout method and handle for ${member.name}, then try again.`);
      return;
    }
    recordTeamPayout(member.id, amount, `Demo payout · ${member.role}`);
    setPayMsg(
      `Paid $${amount} to ${member.name} via ${member.paymentMethod} (${member.paymentHandle}). Curators see this in their Pay tab.`
    );
    refresh();
  }

  function saveHandle(memberId: string, handle: string) {
    updateTeamMember(memberId, { paymentHandle: handle.trim() });
    refresh();
  }

  function saveMethod(memberId: string, method: PaymentMethod) {
    updateTeamMember(memberId, { paymentMethod: method });
    refresh();
  }

  return (
    <div className="fp-portal-page">
      <header className="fp-portal-hero fp-portal-hero--compact">
        <h2 className="fp-portal-hero__title">Team · Assign & pay</h2>
        <p className="fp-sub" style={{ margin: "0.5rem 0 0" }}>
          Assign moderators and girl curators. Demo payouts save locally — curators on{" "}
          <code>curator@bloombay.app</code> see history under{" "}
          <Link href="/curator/pay" style={{ color: "var(--bb-hot-deep)", fontWeight: 600 }}>
            Curator → Pay
          </Link>
          .
        </p>
      </header>

      <div className="fp-inbox-filter-row">
        {(["all", "moderator", "girl_curator"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`fp-inbox-cat${filter === f ? " fp-inbox-cat--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "girl_curator" ? "Girl curators" : "Moderators"}
          </button>
        ))}
      </div>

      {payMsg ? <p className="fp-card fp-card--highlight">{payMsg}</p> : null}

      <ul className="fp-team-list">
        {team.map((m) => (
          <li key={m.id} className="fp-card fp-team-card">
            <div className="fp-team-card__head">
              <strong>
                {m.name} · {m.role === "girl_curator" ? "Girl curator" : "Moderator"}
              </strong>
              <button
                type="button"
                className="fp-btn-ghost"
                onClick={() => {
                  removeTeamMember(m.id);
                  refresh();
                }}
              >
                Remove
              </button>
            </div>
            <p className="fp-sub">
              {m.clubLabel} · {m.city} · {m.email}
            </p>
            <p className="fp-sub">
              Pay via <strong>{m.paymentMethod}</strong>
              {m.paymentHandle ? ` · ${m.paymentHandle}` : " · handle not set"}
            </p>
            {m.lastPaidAt ? (
              <p className="fp-sub">Last paid {new Date(m.lastPaidAt).toLocaleDateString()}</p>
            ) : null}
            {m.role === "girl_curator" ? (
              <p className="fp-sub">
                <Link href="/curator/pay" className="fp-link-pill">
                  Curator pay portal →
                </Link>
              </p>
            ) : null}
            <div className="fp-team-card__actions">
              <select
                className="fp-select"
                value={m.paymentMethod}
                onChange={(e) => saveMethod(m.id, e.target.value as PaymentMethod)}
              >
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <input
                className="fp-select"
                placeholder="Payment handle"
                value={m.paymentHandle}
                onChange={(e) => saveHandle(m.id, e.target.value)}
              />
              {PAY_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="fp-btn-primary"
                  onClick={() => pay(m, amt)}
                >
                  Pay ${amt}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {team.length === 0 ? (
        <p className="fp-card fp-sub">No team members in this filter. Assign someone below.</p>
      ) : null}

      <form onSubmit={handleAssign} className="fp-card" style={{ marginTop: "1.25rem" }}>
        <h3 className="fp-card__title">Assign someone</h3>
        <div className="fp-form-grid">
          <input
            className="fp-select"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="fp-select"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select className="fp-select" value={role} onChange={(e) => setRole(e.target.value as TeamRole)}>
            <option value="girl_curator">Girl curator (events)</option>
            <option value="moderator">Moderator</option>
          </select>
          <input className="fp-select" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <input
            className="fp-select"
            placeholder="Club / events they curate"
            value={clubLabel}
            onChange={(e) => setClubLabel(e.target.value)}
            required
          />
          <select
            className="fp-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            {PAYMENT_METHODS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            className="fp-select"
            placeholder="Venmo / Zelle / etc."
            value={paymentHandle}
            onChange={(e) => setPaymentHandle(e.target.value)}
          />
        </div>
        <button type="submit" className="fp-btn-primary" style={{ marginTop: "0.75rem" }}>
          Assign to BloomBay
        </button>
      </form>

      <section className="fp-card" style={{ marginTop: "1rem" }}>
        <h3 className="fp-card__title">Recent payouts (demo)</h3>
        {payouts.length === 0 ? (
          <p className="fp-sub">No payouts yet — use Pay $75 / $150 / $300 on a team member.</p>
        ) : (
          <ul className="fp-mini-tags">
            {payouts.slice(0, 8).map((p) => {
              const who = listFounderTeam().find((m) => m.id === p.memberId);
              return (
                <li key={p.id}>
                  ${p.amount} → {who?.name ?? "Member"} · {p.method} ·{" "}
                  {new Date(p.paidAt).toLocaleString()}
                </li>
              );
            })}
          </ul>
        )}
        <p className="fp-sub" style={{ marginTop: "0.75rem" }}>
          <McLink href="/admin/people">Women & hosts →</McLink>
          {" · "}
          <McLink href="/admin/applications">Applications →</McLink>
        </p>
      </section>
    </div>
  );
}
