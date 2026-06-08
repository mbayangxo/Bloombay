"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { portalLabel, type PortalId } from "@/lib/auth/roles";

export function PortalAccessNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const notice = searchParams.get("notice");
    const tried = searchParams.get("tried") as PortalId | null;
    const legacyError = searchParams.get("error");

    if (notice !== "wrong_portal" && legacyError !== "wrong_portal") {
      setMessage(null);
      return;
    }

    const triedLabel = tried ? portalLabel(tried) : "that portal";
    const onLogin =
      window.location.pathname.includes("/company") ||
      window.location.pathname.includes("/member/login");
    setMessage(
      onLogin
        ? `You're already signed in as another role. Sign out below, then sign in again — BloomBay will open the right portal for your email.`
        : `You're signed in, but this page is for ${triedLabel}. Sign out and use the sign-in page that matches your role.`,
    );

    const url = new URL(window.location.href);
    url.searchParams.delete("notice");
    url.searchParams.delete("tried");
    url.searchParams.delete("error");
    url.searchParams.delete("from");
    router.replace(url.pathname + (url.search || ""), { scroll: false });
  }, [searchParams, router]);

  if (!message) return null;

  return (
    <div
      role="status"
      style={{
        margin: "0 0 1rem",
        padding: "0.85rem 1rem",
        borderRadius: 8,
        border: "1.5px solid rgba(255, 0, 85, 0.35)",
        background: "rgba(255, 228, 236, 0.95)",
        fontSize: "0.88rem",
        lineHeight: 1.45,
        color: "#1a0514",
      }}
    >
      {message}{" "}
      <Link href="/portals" style={{ color: "#ff0055", fontWeight: 700 }}>
        All portals →
      </Link>
    </div>
  );
}
