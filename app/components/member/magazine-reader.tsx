"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addMagazineThought,
  getSpreadsForMagazine,
  listThoughtsForSpread,
} from "@/lib/magazine-room/store";
import type { MagazineEdition, MagazineSpread, MagazineThought } from "@/lib/magazine-room/types";

export function MagazineReader({
  edition,
  onClose,
}: {
  edition: MagazineEdition;
  onClose: () => void;
}) {
  const spreads = getSpreadsForMagazine(edition.id);
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState(false);
  const [thoughtsOpen, setThoughtsOpen] = useState(false);
  const [thoughts, setThoughts] = useState<MagazineThought[]>([]);
  const [draft, setDraft] = useState("");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const spread = spreads[page];

  const refreshThoughts = useCallback(() => {
    if (!spread) return;
    setThoughts(listThoughtsForSpread(spread.id));
  }, [spread]);

  useEffect(() => {
    refreshThoughts();
  }, [refreshThoughts]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function go(delta: number) {
    const next = page + delta;
    if (next < 0 || next >= spreads.length) return;
    setFlip(true);
    setTimeout(() => {
      setPage(next);
      setFlip(false);
      setThoughtsOpen(false);
    }, 220);
  }

  function onTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    if (Math.abs(delta) >= 48) go(delta < 0 ? 1 : -1);
    setTouchStartX(null);
  }

  function submitThought(e: React.FormEvent) {
    e.preventDefault();
    if (!spread || !draft.trim()) return;
    const name = sessionStorage.getItem("gf_name")?.split(" ")[0] ?? "You";
    addMagazineThought({
      magazineId: edition.id,
      spreadId: spread.id,
      authorName: name,
      body: draft,
    });
    setDraft("");
    refreshThoughts();
  }

  if (!spread) {
    return (
      <div className="bb-mag-reader">
        <button type="button" className="bb-mag-reader__close" onClick={onClose}>
          ✕
        </button>
        <p>No pages yet.</p>
      </div>
    );
  }

  return (
    <div className="bb-mag-reader" role="dialog" aria-modal="true" aria-label={edition.title}>
      <header className="bb-mag-reader__top">
        <button type="button" className="bb-mag-reader__close" onClick={onClose}>
          ← Rack
        </button>
        <span className="bb-mag-reader__title">{edition.title}</span>
        <span className="bb-mag-reader__count">
          {page + 1} / {spreads.length}
        </span>
      </header>

      <article
        className={`bb-mag-spread${flip ? " bb-mag-spread--flip" : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {spread.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={spread.imageUrl}
            alt=""
            className={spread.kind === "gif" ? "bb-mag-spread__media bb-mag-spread__media--gif" : "bb-mag-spread__media"}
          />
        ) : (
          <div className="bb-mag-spread__placeholder" style={{ background: edition.coverGradient }} aria-hidden />
        )}
        <div className="bb-mag-spread__copy">
          <span className="bb-mag-spread__kicker">{spread.caption}</span>
          <h1>{spread.headline}</h1>
          {spread.body ? <p>{spread.body}</p> : null}
          {spread.linkHref ? (
            <a href={spread.linkHref} className="bb-mag-spread__link">
              Go deeper →
            </a>
          ) : null}
        </div>
      </article>

      <nav className="bb-mag-reader__nav" aria-label="Flip pages">
        <button type="button" disabled={page === 0} onClick={() => go(-1)}>
          ← Prev
        </button>
        <button type="button" className="bb-mag-reader__thoughts-btn" onClick={() => setThoughtsOpen((v) => !v)}>
          Reader thoughts ({thoughts.length})
        </button>
        <button type="button" disabled={page >= spreads.length - 1} onClick={() => go(1)}>
          Next →
        </button>
      </nav>

      {thoughtsOpen ? (
        <section className="bb-mag-thoughts">
          <h2>On this page</h2>
          <form onSubmit={submitThought} className="bb-mag-thoughts__form">
            <textarea
              className="mp-input"
              rows={2}
              placeholder="What do you think?"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              required
            />
            <button type="submit" className="mp-btn mp-btn--hot mp-btn--sm">
              Leave your thought
            </button>
          </form>
          <ul className="bb-mag-thoughts__list">
            {thoughts.map((t) => (
              <li key={t.id}>
                <strong>{t.authorName}</strong>
                <p>{t.body}</p>
              </li>
            ))}
            {!thoughts.length ? <li className="bb-mag-thoughts__empty">Be the first to respond.</li> : null}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
