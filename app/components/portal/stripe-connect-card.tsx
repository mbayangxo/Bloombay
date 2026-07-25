"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Stripe Connect Express — tell Stripe where payouts go (bank onboarding).
 */
export function StripeConnectCard({
  returnPath = "/member/host?tab=payments",
}: {
  returnPath?: string;
}) {
  const [status, setStatus] = useState<{
    connected: boolean;
    payoutsReady: boolean;
    loading: boolean;
    error?: string;
  }>({ connected: false, payoutsReady: false, loading: true });
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setStatus((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch("/api/payments/stripe/connect");
      const data = await res.json();
      setStatus({
        connected: !!data.connected,
        payoutsReady: !!data.payoutsReady,
        loading: false,
        error: data.error,
      });
    } catch {
      setStatus({ connected: false, payoutsReady: false, loading: false, error: "Could not load Stripe status" });
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function startConnect(dashboard = false) {
    setBusy(true);
    try {
      const res = await fetch("/api/payments/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnPath, dashboard }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus((s) => ({ ...s, error: data.error ?? "Connect failed" }));
        setBusy(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      setStatus((s) => ({ ...s, error: "Network error" }));
    }
    setBusy(false);
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: "#FF1F7D",
          marginBottom: 6,
        }}
      >
        PAYOUTS
      </p>
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: 18,
          fontWeight: 700,
          color: "#1C1B1C",
          marginBottom: 8,
        }}
      >
        Where should your money go?
      </p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#666", lineHeight: 1.5, marginBottom: 14 }}>
        Connect Stripe so ticket money lands in <strong>your</strong> bank — not stuck in BloomBay.
        Paid events can’t sell tickets until payouts are ready.
      </p>

      {status.loading ? (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#999" }}>Checking Stripe…</p>
      ) : status.payoutsReady ? (
        <>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "#059669", marginBottom: 10 }}>
            Payouts ready ✓
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => startConnect(true)}
            style={{
              border: "none",
              background: "#1C1B1C",
              color: "#fff",
              borderRadius: 999,
              padding: "10px 16px",
              fontFamily: "var(--font-jost)",
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Open Stripe dashboard
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => startConnect(false)}
          style={{
            border: "none",
            background: "#FF1F7D",
            color: "#fff",
            borderRadius: 999,
            padding: "12px 18px",
            fontFamily: "var(--font-jost)",
            fontSize: 12,
            fontWeight: 800,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? "Opening Stripe…" : status.connected ? "Finish bank setup →" : "Connect bank with Stripe →"}
        </button>
      )}

      {status.error && (
        <p style={{ marginTop: 10, fontFamily: "var(--font-jost)", fontSize: 12, color: "#B71C1C" }}>
          {status.error}
        </p>
      )}
    </div>
  );
}

/** One-tap activate host desk (before first event). */
export function BecomeHostActions() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/member/login?redirect=/member/host/become";
      return;
    }
    const { error: err } = await supabase.from("profiles").update({ is_host: true }).eq("id", user.id);
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    window.location.href = "/member/host";
  }

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#FF1F7D" }}>
        HOST DESK
      </p>
      <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 28, fontWeight: 900, color: "#1C1B1C" }}>
        Become a host.
      </h1>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#666", lineHeight: 1.55, margin: "12px 0 20px" }}>
        The host portal is for women who host Happenings. Activate your desk, then connect Stripe before selling paid tickets so money goes to your bank.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={activate}
        style={{
          width: "100%",
          border: "none",
          background: "#FF1F7D",
          color: "#fff",
          borderRadius: 14,
          padding: "14px 0",
          fontFamily: "var(--font-jost)",
          fontSize: 13,
          fontWeight: 800,
          cursor: busy ? "default" : "pointer",
        }}
      >
        {busy ? "Activating…" : "Activate host desk →"}
      </button>
      {error && <p style={{ marginTop: 10, color: "#B71C1C", fontSize: 12 }}>{error}</p>}
    </div>
  );
}
