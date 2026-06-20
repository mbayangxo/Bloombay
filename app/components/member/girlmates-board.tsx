"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import {
  addGirlMateBoardPost,
  GIRLMATE_KIND_LABELS,
  listGirlMateBoardPosts,
  postMetaLine,
  refreshGirlMateBoardFromServer,
  timeAgo,
  type GirlMateBoardPost,
  type GirlMatePostKind,
} from "@/lib/girl-mate-store";

const FILTERS: { id: "all" | GirlMatePostKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "roommate", label: "Roommates" },
  { id: "question", label: "Questions" },
  { id: "sublease", label: "Subleases" },
  { id: "favor", label: "Favors" },
];

const KIND_EMOJI: Record<GirlMatePostKind, string> = {
  roommate: "🔑",
  question: "💬",
  sublease: "🏠",
  favor: "🤝",
};

export function GirlmatesBoard({ showCompose = true }: { showCompose?: boolean }) {
  const [posts, setPosts] = useState<GirlMateBoardPost[]>([]);
  const [filter, setFilter] = useState<"all" | GirlMatePostKind>("all");
  const [composeOpen, setComposeOpen] = useState(false);
  const [kind, setKind] = useState<GirlMatePostKind>("question");
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("New York");
  const [budget, setBudget] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [body, setBody] = useState("");

  const refresh = useCallback(() => setPosts(listGirlMateBoardPosts()), []);

  useEffect(() => {
    refresh();
    void refreshGirlMateBoardFromServer().then(setPosts);
    const stored = sessionStorage.getItem("gf_name");
    if (stored) setAuthorName(stored.split(" ")[0] ?? stored);
    window.addEventListener("bb-girl-mate-updated", refresh);
    return () => window.removeEventListener("bb-girl-mate-updated", refresh);
  }, [refresh]);

  const visible = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.kind === filter);
  }, [posts, filter]);

  function resetCompose() {
    setTitle("");
    setNeighborhood("");
    setBudget("");
    setMoveIn("");
    setBody("");
    setComposeOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    if (kind !== "question" && !neighborhood.trim()) return;
    if (!title.trim() && kind === "question") return;

    addGirlMateBoardPost({
      kind,
      authorName: authorName.trim() || "You",
      title:
        title.trim() ||
        (kind === "roommate"
          ? `Looking in ${neighborhood}`
          : kind === "sublease"
            ? "Sublease"
            : neighborhood || "Ask the city"),
      neighborhood: neighborhood.trim() || (kind === "question" ? "Citywide" : ""),
      city: city.trim(),
      budget: budget.trim(),
      moveIn: moveIn.trim(),
      body: body.trim(),
    });
    resetCompose();
    refresh();
  }

  return (
    <div className="bb-girlmates">
      {showCompose ? (
        <div className="bb-girlmates__compose-bar">
          <button
            type="button"
            className="bb-btn bb-btn--hot bb-btn--block"
            onClick={() => setComposeOpen((o) => !o)}
          >
            {composeOpen ? "Close" : "Ask or post to Girlmates"}
          </button>
        </div>
      ) : null}

      {composeOpen && showCompose ? (
        <form className="bb-girlmates__form" onSubmit={submit}>
          <p className="bb-girlmates__form-lead">
            Roommate search, neighborhood questions, subleases — women answer women here.
          </p>
          <div className="bb-girlmates__kind-tabs" role="tablist" aria-label="Post type">
            {(Object.keys(GIRLMATE_KIND_LABELS) as GirlMatePostKind[]).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={kind === k}
                className={`bb-girlmates__kind-tab${kind === k ? " bb-girlmates__kind-tab--on" : ""}`}
                onClick={() => setKind(k)}
              >
                {KIND_EMOJI[k]} {GIRLMATE_KIND_LABELS[k]}
              </button>
            ))}
          </div>
          <label className="bb-girlmates__field">
            <span>{kind === "question" ? "Your question" : "Headline"}</span>
            <input
              className="mp-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                kind === "question"
                  ? "e.g. Anyone looking for a roommate in Fort Greene?"
                  : "Short title for your post"
              }
              required={kind === "question"}
            />
          </label>
          <label className="bb-girlmates__field">
            <span>Neighborhood {kind === "question" ? "(optional)" : ""}</span>
            <input
              className="mp-input"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Williamsburg, Hoboken…"
              required={kind !== "question"}
            />
          </label>
          <label className="bb-girlmates__field">
            <span>City</span>
            <input className="mp-input" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          {(kind === "roommate" || kind === "sublease") && (
            <>
              <label className="bb-girlmates__field">
                <span>Budget</span>
                <input
                  className="mp-input"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="$1,400–1,600"
                />
              </label>
              <label className="bb-girlmates__field">
                <span>Move-in</span>
                <input
                  className="mp-input"
                  value={moveIn}
                  onChange={(e) => setMoveIn(e.target.value)}
                  placeholder="July 1, ASAP…"
                />
              </label>
            </>
          )}
          <label className="bb-girlmates__field">
            <span>Details</span>
            <textarea
              className="mp-input"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Say what you need — be specific so the right women can reply."
              required
            />
          </label>
          <div className="bb-girlmates__form-actions">
            <button type="button" className="mp-btn mp-btn--outline" onClick={resetCompose}>
              Cancel
            </button>
            <button type="submit" className="mp-btn mp-btn--hot">
              Post to Girlmates
            </button>
          </div>
        </form>
      ) : null}

      <div className="bb-girlmates__filters" role="tablist" aria-label="Filter posts">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`bb-girlmates__filter${filter === f.id ? " bb-girlmates__filter--on" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="bb-girlmates__feed" aria-label="Girlmates posts">
        {visible.length === 0 ? (
          <li className="bb-girlmates__empty-cell">
            <BbEmptyState
              {...bloomEmptyProps("girlmates", {
                label: "Post to Girlmates",
                href: "/member/intros/girl-mates",
              })}
            />
          </li>
        ) : (
          visible.map((post, i) => (
            <li key={post.id}>
              <article
                className={`bb-girlmates-card bb-girlmates-card--${post.kind}`}
                style={{ transform: `rotate(${i % 2 === 0 ? -0.6 : 0.5}deg)` }}
              >
                <div className="bb-girlmates-card__top">
                  <span className={`bb-girlmates-card__kind bb-girlmates-card__kind--${post.kind}`}>
                    {KIND_EMOJI[post.kind]} {GIRLMATE_KIND_LABELS[post.kind]}
                  </span>
                  <span className="bb-girlmates-card__time">{timeAgo(post.createdAt)}</span>
                </div>
                <h3 className="bb-girlmates-card__title">{post.title}</h3>
                <p className="bb-girlmates-card__meta">{postMetaLine(post)}</p>
                <p className="bb-girlmates-card__body">{post.body}</p>
                <footer className="bb-girlmates-card__foot">
                  <span className="bb-girlmates-card__author">{post.authorName}</span>
                  <span className="bb-girlmates-card__replies">{post.replies} replies</span>
                  <Link
                    href={`/member/mailbox?from=${encodeURIComponent(post.authorName)}`}
                    className="bb-girlmates-card__reply"
                  >
                    Reply →
                  </Link>
                </footer>
              </article>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
