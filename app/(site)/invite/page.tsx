"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BBPetalMark } from "@/app/components/bloom-suite/brand-mark";
import { ScatteredPetals } from "@/app/components/bloom-suite/decor";
import "@/app/styles/marketing-bundle.css";

export default function BloomBayInviteLandingPage() {
  return (
    <div className="bloom-root bloom-scene bloom-scene--pink" style={{ minHeight: "100dvh" }}>
      <ScatteredPetals />
      <motion.div
        className="bb-confirmed__inner"
        style={{ maxWidth: 520, margin: "0 auto", padding: "48px 24px" }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bb-notebook">
          <div className="bb-notebook__stamp" aria-hidden>
            <div className="bb-notebook__stamp-ring">
              <BBPetalMark size={32} />
            </div>
          </div>
          <p className="bb-notebook__brand font-display">BLOOMBAY</p>
          <p className="bb-notebook__headline font-script">You&apos;re invited in.</p>
          <p className="bb-notebook__line">
            We verified your waitlist spot. Sign in, add your photo, and finish onboarding — then
            your city opens up.
          </p>
          <p className="bb-notebook__sig font-script">See you inside ♥</p>
        </div>

        <div className="bb-confirmed__actions" style={{ marginTop: 28 }}>
          <Link
            href="/member/join"
            style={{
              display: "block",
              textAlign: "center",
              background: "#ff0055",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "12px",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create your account →
          </Link>
          <Link
            href="/member/login"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 12,
              padding: "14px 24px",
              borderRadius: "12px",
              border: "1px solid rgba(10,10,10,0.15)",
              color: "#0a0a0a",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            I already have an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
