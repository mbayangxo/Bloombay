"use client";

import { useCallback, useEffect, useState } from "react";
import { EventCoverUpload } from "./event-cover-upload";
import {
  convertPlanToOfficialEvent,
  ensureClubPlannerRoom,
  getPlannerRoomMeta,
  listEventPlans,
  listPlansByMonth,
  saveEventPlan,
  savePlannerRoomMeta,
  type EventPlanDraft,
} from "@/lib/club-planner-room";
import { monthKey, VISIBILITY_LABELS, type EventVisibility } from "@/lib/bloombay-events-store";
import { addPlannerTask } from "@/lib/club-operations-store";
import type { EventsPortalBase } from "./club-command-center";

export function ClubPlannerPanel({
  clubId,
  staffBase,
}: {
  clubId: string;
  staffBase: EventsPortalBase;
}) {
  const room = ensureClubPlannerRoom(clubId);
  const [meta, setMeta] = useState(() => getPlannerRoomMeta(clubId, room.id));
  const [plans, setPlans] = useState<EventPlanDraft[]>([]);
  const [month, setMonth] = useState(monthKey());
  const [form, setForm] = useState({
    title: "",
    notes: "",
    concept: "",
    season: "",
    category: "",
    coverUrl: "",
    visibility: "club" as EventVisibility,
    plannedStartAt: "",
    ticket: "0",
    deposit: "0",
  });

  const refresh = useCallback(() => {
    setPlans(listEventPlans(clubId, room.id));
    setMeta(getPlannerRoomMeta(clubId, room.id));
  }, [clubId, room.id]);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-planner-updated", refresh);
    window.addEventListener("bb-events-updated", refresh);
    return () => {
      window.removeEventListener("bb-planner-updated", refresh);
      window.removeEventListener("bb-events-updated", refresh);
    };
  }, [refresh]);

  const monthPlans = listPlansByMonth(clubId, month);

  return (
    <div className="bb-club-planner">
      <p className="fp-portal-muted">
        Private workspace — plans stay draft until you publish. Upload covers created elsewhere (not a design editor).
      </p>

      <label>
        Team planning notes
        <textarea
          rows={3}
          className="co-input"
          value={meta.privateNotes}
          onChange={(e) => setMeta({ ...meta, privateNotes: e.target.value })}
          onBlur={() => savePlannerRoomMeta(clubId, room.id, meta.privateNotes)}
          placeholder="Brainstorming, concepts, collaboration…"
        />
      </label>

      <label style={{ marginTop: "0.75rem" }}>
        View by month
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </label>

      <form
        className="bb-events-form fp-surface-white"
        style={{ marginTop: "1rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) return;
          saveEventPlan({
            clubId,
            roomId: room.id,
            title: form.title.trim(),
            notes: form.notes,
            concept: form.concept,
            month,
            season: form.season,
            category: form.category,
            coverUrl: form.coverUrl,
            visibility: form.visibility,
            plannedStartAt: form.plannedStartAt ? new Date(form.plannedStartAt).toISOString() : undefined,
            ticket: parseInt(form.ticket, 10) || 0,
            deposit: parseInt(form.deposit, 10) || 0,
            status: "idea",
          });
          addPlannerTask(room.id, { title: `Plan: ${form.title}`, status: "todo" });
          setForm({
            title: "",
            notes: "",
            concept: "",
            season: "",
            category: "",
            coverUrl: "",
            visibility: "club",
            plannedStartAt: "",
            ticket: "0",
            deposit: "0",
          });
          refresh();
        }}
      >
        <h3>New event plan (private)</h3>
        <EventCoverUpload coverUrl={form.coverUrl} onCoverChange={(url) => setForm((f) => ({ ...f, coverUrl: url }))} />
        <label>
          Event title
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        </label>
        <label>
          Concept / notes
          <textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </label>
        <div className="bb-events-form__row">
          <label>
            Season
            <input value={form.season} onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))} placeholder="Fall 2026" />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Social" />
          </label>
        </div>
        <label>
          Planned date
          <input type="datetime-local" value={form.plannedStartAt} onChange={(e) => setForm((f) => ({ ...f, plannedStartAt: e.target.value }))} />
        </label>
        <label>
          Visibility when published
          <select value={form.visibility} onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value as EventVisibility }))}>
            {Object.entries(VISIBILITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div className="bb-events-form__row">
          <label>
            Ticket $
            <input type="number" value={form.ticket} onChange={(e) => setForm((f) => ({ ...f, ticket: e.target.value }))} />
          </label>
          <label>
            Deposit $
            <input type="number" value={form.deposit} onChange={(e) => setForm((f) => ({ ...f, deposit: e.target.value }))} />
          </label>
        </div>
        <button type="submit" className="fp-portal-btn fp-portal-btn--pink">
          Save plan (stays private)
        </button>
      </form>

      <section style={{ marginTop: "1.5rem" }}>
        <h3 className="fp-card__title">{month} plans</h3>
        <ul className="bb-club-ideas__list">
          {monthPlans.length === 0 ? (
            <li className="fp-portal-empty">No plans for this month yet.</li>
          ) : (
            monthPlans.map((p) => (
              <li key={p.id} className="fp-surface-white bb-club-ideas__item">
                {p.coverUrl ? (
                  <div className="bb-events-detail__cover" style={{ backgroundImage: `url(${p.coverUrl})`, height: 80, marginBottom: 8 }} />
                ) : null}
                <strong>{p.title}</strong>
                <span className={`bb-events-cal__status bb-events-cal__status--${p.status === "published" ? "live" : "draft"}`}>
                  {p.status}
                </span>
                <p className="fp-portal-muted">{VISIBILITY_LABELS[p.visibility]}</p>
                {p.notes ? <p>{p.notes}</p> : null}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="fp-portal-btn"
                    onClick={() => {
                      convertPlanToOfficialEvent(p.id, { publish: false });
                      refresh();
                    }}
                  >
                    Create draft event
                  </button>
                  <button
                    type="button"
                    className="fp-portal-btn fp-portal-btn--pink"
                    onClick={() => {
                      convertPlanToOfficialEvent(p.id, { publish: true });
                      refresh();
                    }}
                  >
                    Publish event →
                  </button>
                  {staffBase === "/club-owner" ? (
                    <a href="/club-owner/events-studio" className="fp-link-pill">
                      Open calendar →
                    </a>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section style={{ marginTop: "1rem" }}>
        <h3 className="fp-card__title">All plans in room</h3>
        <ul className="bb-club-ideas__list">
          {plans.map((p) => (
            <li key={p.id} className="fp-portal-muted" style={{ fontSize: "0.85rem" }}>
              {p.title} · {p.month ?? "—"} · {p.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
