"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelEvent,
  deleteEvent,
  EVENT_KIND_META,
  formatEventDate,
  getEvent,
  listClubsForPortal,
  listEventsByKind,
  publishEvent,
  saveEvent,
  setEventStatus,
  VISIBILITY_LABELS,
  type BloomBayEvent,
  type EventKind,
  type EventVisibility,
} from "@/lib/bloombay-events-store";
import { ensureEventQrCode, getEventAttendanceStats } from "@/lib/event-rsvp-store";
import { sendBlueDayAnnouncement } from "@/lib/blueday-founder-store";
import type { EventsPortalBase } from "./club-command-center";
import { EventCoverUpload } from "./event-cover-upload";
import { EventsCalendar } from "./events-calendar";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  startAt: "",
  venue: "",
  neighborhood: "",
  coverUrl: "",
  visibility: "all" as EventVisibility,
  clubId: "",
  capacity: "24",
  ticket: "0",
  deposit: "0",
  groupLabel: "",
};

export function EventsStudio({
  kind,
  staffBase = "/founder",
  clubId: scopedClubId,
  backHref,
}: {
  kind: EventKind;
  staffBase?: EventsPortalBase;
  /** When set, only club-scoped events for this club */
  clubId?: string;
  backHref: string;
}) {
  const meta = EVENT_KIND_META[kind];
  const clubs = listClubsForPortal();
  const [events, setEvents] = useState<BloomBayEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const refresh = useCallback(() => {
    let list = listEventsByKind(kind);
    if (scopedClubId) {
      list = list.filter((e) => e.clubId === scopedClubId || e.visibility === "club");
    }
    setEvents(list);
  }, [kind, scopedClubId]);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("bb-events-updated", onUpdate);
    return () => window.removeEventListener("bb-events-updated", onUpdate);
  }, [refresh]);

  const selected = selectedId ? getEvent(selectedId) : null;
  const liveCount = useMemo(() => events.filter((e) => e.status === "live").length, [events]);

  function loadForm(ev?: BloomBayEvent) {
    if (!ev) {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(19, 0, 0, 0);
      setForm({
        ...EMPTY_FORM,
        startAt: d.toISOString().slice(0, 16),
        clubId: scopedClubId ?? "",
        visibility: scopedClubId ? "club" : "all",
      });
      return;
    }
    setForm({
      title: ev.title,
      subtitle: ev.subtitle,
      startAt: ev.startAt.slice(0, 16),
      venue: ev.venue,
      neighborhood: ev.neighborhood,
      coverUrl: ev.coverUrl,
      visibility: ev.visibility,
      clubId: ev.clubId ?? "",
      capacity: String(ev.capacity),
      ticket: String(ev.ticket),
      deposit: String(ev.deposit),
      groupLabel: ev.groupLabel ?? "",
    });
  }

  function startCreate() {
    setSelectedId(null);
    setEditing(true);
    loadForm();
  }

  function startEdit(id: string) {
    const ev = getEvent(id);
    if (!ev) return;
    setSelectedId(id);
    setEditing(true);
    loadForm(ev);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const startAt = new Date(form.startAt).toISOString();
    const clubId =
      form.visibility === "club" || form.visibility === "group"
        ? form.clubId || scopedClubId || null
        : kind === "blueday"
          ? null
          : scopedClubId ?? null;
    saveEvent({
      id: selectedId ?? undefined,
      kind,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      startAt,
      venue: form.venue.trim(),
      neighborhood: form.neighborhood.trim(),
      coverUrl: form.coverUrl,
      visibility: kind === "blueday" ? "all" : form.visibility,
      clubId: kind === "blueday" || form.visibility === "all" ? null : clubId,
      groupLabel: form.visibility === "group" ? form.groupLabel : undefined,
      status: selected?.status ?? "draft",
      capacity: parseInt(form.capacity, 10) || 24,
      rsvpCount: selected?.rsvpCount ?? 0,
      ratingAvg: selected?.ratingAvg ?? 4.5,
      ratingCount: selected?.ratingCount ?? 0,
      chemistry: selected?.chemistry ?? 92,
      ticket: parseInt(form.ticket, 10) || 0,
      deposit: parseInt(form.deposit, 10) || 0,
    });
    setEditing(false);
    refresh();
  }

  function pushLive(id: string, notify = false) {
    const ev = getEvent(id);
    if (!ev) return;
    publishEvent(id, notify);
    if (notify && ev.kind === "blueday") {
      sendBlueDayAnnouncement({
        title: `Blue Day: ${ev.title}`,
        body: ev.subtitle || "A new Blue Day event is live — RSVP in Happenings.",
        eventId: id,
        channels: { push: true, email: true, sms: false },
      });
    }
    refresh();
  }

  function unpublish(id: string) {
    setEventStatus(id, "draft");
    refresh();
  }

  return (
    <div className="fp-portal-page bb-events-studio">
      <header className="fp-submissions-queue__hero">
        <Link href={backHref} className="fp-submissions-queue__back">
          ← Back
        </Link>
        <p className="fp-portal-hero__kicker">{meta.kicker}</p>
        <h2 className="fp-portal-hero__title">{meta.title}</h2>
        <p className="fp-portal-hero__sub">{meta.blurb}</p>
        <p className="fp-submissions-queue__count-line">
          <strong>{liveCount}</strong> live on Happenings · <strong>{events.length}</strong> total
        </p>
      </header>

      <div className="bb-events-studio__toolbar">
        <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={startCreate}>
          + New event
        </button>
        {selected && !editing ? (
          <>
            <button type="button" className="fp-portal-btn" onClick={() => startEdit(selected.id)}>
              Edit
            </button>
            {selected.status === "draft" ? (
              <>
                <button
                  type="button"
                  className="fp-portal-btn fp-portal-btn--pink"
                  onClick={() => pushLive(selected.id, false)}
                >
                  Publish (no blast)
                </button>
                <button
                  type="button"
                  className="fp-portal-btn fp-portal-btn--pink"
                  onClick={() => pushLive(selected.id, true)}
                >
                  Publish + announce
                </button>
              </>
            ) : selected.status === "live" ? (
              <>
                <button type="button" className="fp-portal-btn" onClick={() => unpublish(selected.id)}>
                  Back to draft
                </button>
                <button
                  type="button"
                  className="fp-portal-btn"
                  onClick={() => {
                    if (confirm("Cancel this event? Attendees will need a separate notice.")) {
                      cancelEvent(selected.id);
                      refresh();
                    }
                  }}
                >
                  Cancel event
                </button>
              </>
            ) : null}
            <button
              type="button"
              className="fp-portal-btn"
              onClick={() => {
                if (confirm("Delete this event?")) {
                  deleteEvent(selected.id);
                  setSelectedId(null);
                  refresh();
                }
              }}
            >
              Delete
            </button>
            <Link
              href={`/member/happenings/gatherings/${selected.id}`}
              className="fp-link-pill"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview member view →
            </Link>
          </>
        ) : null}
      </div>

      <div className="bb-events-studio__layout">
        <EventsCalendar events={events} selectedId={selectedId} onSelect={setSelectedId} />

        <div className="bb-events-studio__side">
          {editing ? (
            <form className="bb-events-form fp-surface-white" onSubmit={handleSave}>
              <h3>{selectedId ? "Edit event" : "Create event"}</h3>
              <EventCoverUpload
                coverUrl={form.coverUrl}
                onCoverChange={(url) => setForm((f) => ({ ...f, coverUrl: url }))}
              />
              <label>
                Title *
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </label>
              <label>
                Subtitle
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                />
              </label>
              <label>
                Start *
                <input
                  required
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                />
              </label>
              <div className="bb-events-form__row">
                <label>
                  Venue
                  <input
                    value={form.venue}
                    onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                  />
                </label>
                <label>
                  Neighborhood
                  <input
                    value={form.neighborhood}
                    onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))}
                  />
                </label>
              </div>
              <label>
                Who can see this?
                <select
                  value={kind === "blueday" ? "all" : form.visibility}
                  disabled={kind === "blueday"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      visibility: e.target.value as EventVisibility,
                    }))
                  }
                >
                  {Object.entries(VISIBILITY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              {form.visibility === "group" ? (
                <label>
                  Group name
                  <input
                    value={form.groupLabel}
                    onChange={(e) => setForm((f) => ({ ...f, groupLabel: e.target.value }))}
                    placeholder="e.g. Founders circle"
                  />
                </label>
              ) : null}
              {form.visibility === "club" || form.visibility === "group" ? (
                <label>
                  Club
                  <select
                    required
                    value={form.clubId || scopedClubId || ""}
                    disabled={!!scopedClubId}
                    onChange={(e) => setForm((f) => ({ ...f, clubId: e.target.value }))}
                  >
                    <option value="">Select club</option>
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <div className="bb-events-form__row">
                <label>
                  Capacity
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                  />
                </label>
                <label>
                  Ticket $
                  <input
                    type="number"
                    value={form.ticket}
                    onChange={(e) => setForm((f) => ({ ...f, ticket: e.target.value }))}
                  />
                </label>
                <label>
                  Deposit $
                  <input
                    type="number"
                    value={form.deposit}
                    onChange={(e) => setForm((f) => ({ ...f, deposit: e.target.value }))}
                  />
                </label>
              </div>
              <div className="bb-events-form__actions">
                <button type="submit" className="fp-portal-btn fp-portal-btn--pink">
                  Save draft
                </button>
                <button
                  type="button"
                  className="fp-portal-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : selected ? (
            <article className="bb-events-detail fp-surface-barbie">
              {selected.coverUrl ? (
                <div
                  className="bb-events-detail__cover"
                  style={{ backgroundImage: `url(${selected.coverUrl})` }}
                />
              ) : null}
              <h3>{selected.title}</h3>
              <p>{selected.subtitle}</p>
              <p className="fp-portal-muted">{formatEventDate(selected.startAt)}</p>
              <p className="fp-portal-muted">
                {selected.venue} · {selected.neighborhood}
              </p>
              <p>
                <span className={`bb-events-cal__status bb-events-cal__status--${selected.status}`}>
                  {selected.status}
                </span>{" "}
                · {VISIBILITY_LABELS[selected.visibility]}
                {selected.groupLabel ? ` · ${selected.groupLabel}` : ""}
              </p>
              <p className="fp-portal-muted">
                ★ {selected.ratingAvg} ({selected.ratingCount} ratings) · {selected.rsvpCount} RSVPs ·{" "}
                {getEventAttendanceStats(selected.id).checkIns} check-ins
              </p>
              <p className="fp-portal-muted">
                QR: <code>{ensureEventQrCode(selected.id)}</code>
              </p>
              {selected.ticket === 0 && selected.deposit === 0 ? (
                <p className="fp-portal-muted">Free for members</p>
              ) : (
                <p className="fp-portal-muted">
                  Ticket ${selected.ticket} · Deposit ${selected.deposit}
                </p>
              )}
            </article>
          ) : (
            <p className="fp-app-hint">Select a date on the calendar or create a new event.</p>
          )}
        </div>
      </div>
    </div>
  );
}
