"use client";

import { useEffect, useRef, useState } from "react";
import {
  hasAuthCallback,
  processMagicLinkCallback,
} from "@/lib/auth/magic-link-callback";
import type { PortalId } from "@/lib/auth/roles";

export function MagicLinkCallback({
  portal,
  onError,
}: {
  portal: PortalId;
  onError?: (message: string) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (!hasAuthCallback(window.location.search, window.location.hash)) return;

    started.current = true;
    setProcessing(true);

    void processMagicLinkCallback(portal).then((result) => {
      if (result.status === "error") {
        setProcessing(false);
        onError?.(result.message);
      } else if (result.status === "none") {
        setProcessing(false);
      }
    });
  }, [portal, onError]);

  if (!processing) return null;

  return (
    <div
      className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium text-center"
      role="status"
      aria-live="polite"
    >
      Completing sign-in…
    </div>
  );
}
