"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberShell } from "../../components/member-shell";
import { truthCreateGathering } from "@/lib/truth/client";
import { isTruthfulMode, allowDemoFallback } from "@/lib/truth/config";

export default function CreateGatheringPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [capacity, setCapacity] = useState(8);
  const [startsAt, setStartsAt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startsAt) {
      alert("Title and date/time are required.");
      return;
    }
    setLoading(true);
    const result = await truthCreateGathering({
      title: title.trim(),
      startsAt: new Date(startsAt).toISOString(),
      area: neighborhood.trim() || undefined,
      neighborhood: neighborhood.trim() || undefined,
      capacity,
    });
    setLoading(false);
    if (!result.ok) {
      if (isTruthfulMode() && !allowDemoFallback()) {
        alert(result.error ?? "Could not publish — sign in and run migration 006.");
        return;
      }
      alert("Saved locally in demo mode — sign in for a live seat.");
      router.push("/member/happenings/seats");
      return;
    }
    router.push("/member/happenings/seats");
  }

  return (
    <MemberShell backHref="/member/happenings" backLabel="Happenings" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Create a gathering</h1>
        <p className="mp-hero__sub">Open a seat in the city — saved to BloomBay for other women to join.</p>
      </div>

      <form
        className="mp-section"
        style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "2rem" }}
        onSubmit={handleSubmit}
      >
        <label>
          <span className="mp-section__title" style={{ display: "block", marginBottom: "0.35rem" }}>
            Title
          </span>
          <input
            className="mp-input"
            placeholder="Rooftop dinner, brunch, walk…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          <span className="mp-section__title" style={{ display: "block", marginBottom: "0.35rem" }}>
            When
          </span>
          <input
            className="mp-input"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </label>
        <label>
          <span className="mp-section__title" style={{ display: "block", marginBottom: "0.35rem" }}>
            Neighborhood
          </span>
          <input
            className="mp-input"
            placeholder="Williamsburg, SoHo…"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </label>
        <label>
          <span className="mp-section__title" style={{ display: "block", marginBottom: "0.35rem" }}>
            Capacity
          </span>
          <input
            className="mp-input"
            type="number"
            min={2}
            max={50}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </label>
        <button type="submit" className="mp-btn mp-btn--hot mp-btn--block" disabled={loading}>
          {loading ? "Publishing…" : "Publish gathering"}
        </button>
      </form>
    </MemberShell>
  );
}
