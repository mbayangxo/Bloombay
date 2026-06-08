"use client";

import { useCallback, useState } from "react";

export type ArtifactMotion =
  | "seat-reserve"
  | "bouquet-grow"
  | "door-open"
  | "ticket-stamp"
  | "postcard-flip"
  | "request-unfold"
  | "marker-drop"
  | "like-stamp";

/** One-shot BloomBay object reaction — not a page transition. */
export function useArtifactMotion() {
  const [motion, setMotion] = useState<ArtifactMotion | "">("");

  const trigger = useCallback((m: ArtifactMotion) => {
    setMotion("");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMotion(m));
    });
  }, []);

  return {
    className: motion ? `bb-artifact--${motion}` : "",
    trigger,
  };
}
