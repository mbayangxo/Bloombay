"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readYandeMemberState, setMemberVerified } from "@/lib/yande-member-state";

export function SettingsVerificationRow() {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setVerified(readYandeMemberState().verified);
  }, []);

  function markVerified() {
    setMemberVerified(true);
    setVerified(true);
  }

  return (
    <>
      <Link href="/member/onboarding" className="mp-settings-row">
        Edit profile & verification photo
        <span>→</span>
      </Link>
      {!verified ? (
        <button type="button" className="mp-settings-row" style={{ width: "100%", border: "none", cursor: "pointer", textAlign: "left", font: "inherit" }} onClick={markVerified}>
          Complete verification (demo)
          <span style={{ color: "var(--mp-hot)" }}>→</span>
        </button>
      ) : (
        <span className="mp-settings-row" style={{ color: "var(--mp-hot)" }}>
          Verified ✓
        </span>
      )}
    </>
  );
}
