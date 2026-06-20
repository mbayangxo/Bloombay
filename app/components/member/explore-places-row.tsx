import Link from "next/link";
import { EXPLORE_PLACES } from "@/lib/explore-places";

export function ExplorePlacesRow() {
  return (
    <div className="bb-explore-places" aria-label="Neighborhoods">
      {EXPLORE_PLACES.map((p) => (
        <Link key={p.id} href={p.href} className="bb-explore-place">
          <span className="bb-explore-place__name">{p.name}</span>
          <span className="bb-explore-place__vibe">{p.vibe}</span>
        </Link>
      ))}
    </div>
  );
}
