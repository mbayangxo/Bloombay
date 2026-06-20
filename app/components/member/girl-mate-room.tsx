"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { addGirlMateRoomPost, listGirlMateRoomPosts, type GirlMateRoomPost } from "@/lib/girl-mate-store";

export function GirlMateRoom() {
  const [posts, setPosts] = useState<GirlMateRoomPost[]>([]);
  const [open, setOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("New York");
  const [budget, setBudget] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [body, setBody] = useState("");

  const refresh = useCallback(() => setPosts(listGirlMateRoomPosts()), []);

  useEffect(() => {
    refresh();
    const stored = sessionStorage.getItem("gf_name");
    if (stored) setAuthorName(stored.split(" ")[0] ?? stored);
    window.addEventListener("bb-girl-mate-updated", refresh);
    if (typeof window !== "undefined" && window.location.hash === "#girl-mate-room") {
      document.getElementById("girl-mate-room")?.scrollIntoView({ behavior: "smooth" });
    }
    return () => window.removeEventListener("bb-girl-mate-updated", refresh);
  }, [refresh]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !neighborhood.trim()) return;
    addGirlMateRoomPost({
      authorName: authorName.trim() || "You",
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      budget: budget.trim() || "Flexible",
      moveIn: moveIn.trim() || "Flexible",
      body: body.trim(),
    });
    setBody("");
    setOpen(false);
    refresh();
  }

  return (
    <section id="girl-mate-room" className="mp-girl-mate-room">
      <div className="mp-girl-mate-room__head">
        <h2 className="mp-section__title">Girlmates</h2>
        <p className="mp-page-head__sub" style={{ margin: 0 }}>
          Roommate posts also surface here — ask and answer in Intros · Girlmates.
        </p>
        <Link href="/member/intros/girl-mates" className="mp-link" style={{ fontSize: "0.85rem" }}>
          Open Girlmates in Intros →
        </Link>
      </div>

      {posts.map((post) => (
        <article key={post.id} className="mp-bulletin-card mp-bulletin-card--barbie" style={{ marginBottom: "0.75rem" }}>
          <span className="mp-bulletin-card__tag" style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--mp-hot)" }}>
            Girl mate · {post.neighborhood}
          </span>
          <h3>{post.authorName}</h3>
          <p className="mp-list-row__meta">
            {post.city} · {post.budget} · Move-in {post.moveIn}
          </p>
          <p>{post.body}</p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/member/intros/girl-mates" className="mp-btn mp-btn--hot mp-btn--sm">
              Send girl mate request
            </Link>
            <span className="mp-list-row__meta">{post.replies} replies</span>
          </div>
        </article>
      ))}

      {open ? (
        <form className="mp-girl-mate-form" onSubmit={submit}>
          <label className="mp-field">
            <span>Neighborhood</span>
            <input className="mp-input" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
          </label>
          <label className="mp-field">
            <span>City</span>
            <input className="mp-input" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="mp-field">
            <span>Budget</span>
            <input className="mp-input" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $1,400–1,600" />
          </label>
          <label className="mp-field">
            <span>Move-in</span>
            <input className="mp-input" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} placeholder="e.g. July 1" />
          </label>
          <label className="mp-field">
            <span>Your post</span>
            <textarea
              className="mp-input"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe what you're looking for…"
              required
            />
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" className="mp-btn mp-btn--outline" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="mp-btn mp-btn--hot">
              Post to Girl mate room
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="mp-btn mp-btn--hot mp-btn--block" onClick={() => setOpen(true)}>
          Post looking for a girl mate
        </button>
      )}
    </section>
  );
}
