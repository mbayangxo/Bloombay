"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BloomBayLogin } from "@/app/components/auth/bloombay-login";
import Link from "next/link";
import { COMPANY_LOGIN } from "@/lib/auth/roles";
import "@/app/styles/bb-login.css";

function MemberLoginInner() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? undefined;
  return (
    <>
      <BloomBayLogin variant="member" nextPath={next} joinHref="/member/join" />
      <p
        style={{
          textAlign: "center",
          margin: "-2rem 1rem 2rem",
          fontSize: "0.8rem",
          color: "rgba(26,5,20,0.65)",
        }}
      >
        BloomBay staff (founder, Club Mama, partner, ops)?{" "}
        <Link href={COMPANY_LOGIN} style={{ color: "#ff0055", fontWeight: 700 }}>
          Company sign-in →
        </Link>
      </p>
    </>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh" }} />}>
      <MemberLoginInner />
    </Suspense>
  );
}
