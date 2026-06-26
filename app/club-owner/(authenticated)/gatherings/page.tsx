"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { HostPostMortemCard } from "@/app/components/portal/host-post-mortem-card";
import { BloomCardsDeck } from "@/app/components/portal/bloom-cards-deck";

type Gathering = {
  id: string;
  title: string;
  date: string;
  starts_at: string;
  venue: string;
  neighborhood: string;
  capacity: number;
  publish_status: string;
};

type PastGathering = { id: string; title: string; date: string; venue: string };

function toIsoDateTime(input: string): string | null {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export default function ClubOwnerGatheringsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [events, setEvents] = useState<Gathering[]>([]);
  const [pastGatherings, setPastGatherings] = useState<PastGathering[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("NYC");
  const [capacity, setCapacity] = useState("40");

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/club-portal/gatherings");
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Could not load gatherings");
      }
      const json = (await res.json()) as { upcoming?: Gathering[]; past?: PastGathering[] };
      setEvents(json.upcoming ?? []);
      setPastGatherings(json.past ?? []);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    const startsAt = toIsoDateTime(date);
    if (!startsAt) {
      setError("Enter a valid date & time (e.g. 2026-07-15 7:00 PM)");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/club-portal/gatherings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          starts_at: startsAt,
          venue: location.trim(),
          neighborhood: location.trim(),
          capacity: parseInt(capacity, 10) || 40,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setTitle("");
      setDate("");
      await refresh();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function publishGathering(id: string) {
    setActing(id);
    setError(null);
    try {
      const res = await fetch(`/api/club-portal/gatherings/${id}/publish`, { method: "POST" });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        gov_id_verification_status?: string;
      };
      if (!res.ok) {
        if (json.gov_id_verification_status && json.gov_id_verification_status !== "verified") {
          throw new Error("Verify your government ID in settings before publishing.");
        }
        throw new Error(json.error ?? "Publish failed");
      }
      await refresh();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setActing(null);
    }
  }

  async function cancelGathering(id: string) {
    setActing(id);
    setError(null);
    try {
      const res = await fetch(`/api/club-portal/gatherings/${id}`, { method: "PATCH" });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Cancel failed");
      await refresh();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setActing(null);
    }
  }

  return (
    <ClubOwnerShell title="Gatherings" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Gatherings"
        sub="Plan events, set capacity and paid tickets, cancel if needed. QR + scan for check-in."
      />

      {error ? <p className="co-hint" style={{ color: "#c00" }}>{error}</p> : null}

      <section className="co-section co-section--full">
        <h2 className="co-section__title">Scheduled</h2>
        {loading ? (
          <p className="co-hint">Loading…</p>
        ) : events.length === 0 ? (
          <p className="co-hint">No upcoming gatherings yet.</p>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="co-row-card" style={{ flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <div>
                <strong>{ev.title}</strong>
                <p>
                  {ev.date} · {ev.venue || ev.neighborhood} · cap {ev.capacity}
                  {ev.publish_status === "live" ? " · live" : ` · ${ev.publish_status}`}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Link href={`/club-owner/events/${ev.id}`} className="co-link">
                  QR
                </Link>
                {ev.publish_status !== "live" ? (
                  <button
                    type="button"
                    className="co-btn co-btn--primary"
                    style={{ padding: "0.35rem 0.65rem", fontSize: "0.65rem" }}
                    disabled={acting === ev.id}
                    onClick={() => publishGathering(ev.id)}
                  >
                    Publish
                  </button>
                ) : null}
                <button
                  type="button"
                  className="co-btn co-btn--ghost"
                  style={{ padding: "0.35rem 0.65rem", fontSize: "0.65rem" }}
                  disabled={acting === ev.id}
                  onClick={() => cancelGathering(ev.id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {pastGatherings.length > 0 && (
        <section className="co-section co-section--full">
          <h2 className="co-section__title">Past Gatherings</h2>
          {pastGatherings.map((g) => (
            <div key={g.id}>
              <div className="co-row-card" style={{ flexWrap: "wrap", marginBottom: "0.25rem" }}>
                <div>
                  <strong>{g.title}</strong>
                  <p>
                    {g.date}
                    {g.venue ? ` · ${g.venue}` : ""}
                  </p>
                </div>
              </div>
              <HostPostMortemCard gatheringId={g.id} title={g.title} />
            </div>
          ))}
        </section>
      )}

      <form onSubmit={handlePlan} className="co-form">
        <p className="co-form__club">Plan a gathering</p>
        <input className="co-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input
          className="co-input"
          placeholder="Date & time (e.g. 2026-07-15 7:00 PM)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input className="co-input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className="co-input" type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        <button type="submit" className="co-btn co-btn--primary" disabled={saving}>
          {saving ? "Saving…" : "Save gathering"}
        </button>
      </form>

      <section className="co-section co-section--full">
        <BloomCardsDeck context="host" />
      </section>
    </ClubOwnerShell>
  );
}
