"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

interface Review {
  author: string;
  text: string;
  rating: number;
}

export default function PartnerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setReviews(data.reviews ?? []);
          setAvgRating(data.venue?.avg_rating ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PartnerShell title="Reviews" sub="Ratings and reviews from BloomBay members who've visited.">
      <div className="pp-stat-grid">
        <div className="pp-stat">
          <strong>{avgRating > 0 ? avgRating.toFixed(1) : "—"}</strong>
          <span>Avg rating</span>
        </div>
        <div className="pp-stat">
          <strong>{reviews.length}</strong>
          <span>Reviews</span>
        </div>
      </div>
      {loading ? (
        <p className="pp-dash__empty">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="pp-dash__empty">No reviews yet. Your first BloomBay visitors will leave reviews here.</p>
      ) : (
        reviews.map((r, i) => (
          <div key={i} className="pp-card">
            <strong>{r.author} · {r.rating}★</strong>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem" }}>{r.text}</p>
          </div>
        ))
      )}
    </PartnerShell>
  );
}
