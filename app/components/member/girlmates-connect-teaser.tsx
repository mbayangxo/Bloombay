"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  GIRLMATE_KIND_LABELS,
  listGirlMateBoardPosts,
  postMetaLine,
  timeAgo,
  type GirlMateBoardPost,
} from "@/lib/girl-mate-store";

const KIND_EMOJI: Record<GirlMateBoardPost["kind"], string> = {
  roommate: "🔑",
  question: "💬",
  sublease: "🏠",
  favor: "🤝",
};

export function GirlmatesConnectTeaser() {
  const [posts, setPosts] = useState<GirlMateBoardPost[]>([]);

  const refresh = useCallback(() => {
    setPosts(listGirlMateBoardPosts().slice(0, 3));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-girl-mate-updated", refresh);
    return () => window.removeEventListener("bb-girl-mate-updated", refresh);
  }, [refresh]);

  return (
    <section className="bb-connect-girlmates" aria-label="Girlmates">
      <div className="bb-connect-girlmates__head">
        <div>
          <h2 className="bb-connect-girlmates__title">Girlmates</h2>
          <p className="bb-connect-girlmates__sub">
            Ask if anyone&apos;s looking for a roommate, need a broker rec, or have a sublease — women answer here.
          </p>
        </div>
        <Link href="/member/intros/girl-mates" className="bb-connect-girlmates__cta">
          Open →
        </Link>
      </div>
      <ul className="bb-connect-girlmates__preview">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href="/member/intros/girl-mates" className="bb-connect-girlmates__pin">
              <span className="bb-connect-girlmates__pin-kind">
                {KIND_EMOJI[post.kind]} {GIRLMATE_KIND_LABELS[post.kind]}
              </span>
              <span className="bb-connect-girlmates__pin-title">{post.title}</span>
              <span className="bb-connect-girlmates__pin-meta">
                {post.authorName} · {postMetaLine(post)} · {timeAgo(post.createdAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
