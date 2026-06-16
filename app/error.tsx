"use client";

import { useEffect } from "react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reset();
    const t = setTimeout(() => { window.location.href = "/member/home"; }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <html>
      <body style={{ margin: 0, background: "#FBF6F0" }} />
    </html>
  );
}
