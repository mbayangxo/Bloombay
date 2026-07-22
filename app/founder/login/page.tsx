"use client";

import { useActionState } from "react";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";

export default function FounderLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, #FF69B4 0%, #FF1F7D 48%, #C4005A 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 28% 18%, rgba(255,255,255,0.2) 0%, transparent 52%)" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ top: -70, right: -70, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ bottom: -90, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(0,0,0,0.1)" }}
      />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div
            className="mb-4 flex items-center justify-center rounded-2xl"
            style={{ width: 76, height: 76, background: "rgba(0,0,0,0.28)", boxShadow: "0 10px 32px rgba(0,0,0,0.25)" }}
          >
            <BBLogo size={40} light />
          </div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.7)" }}>
            Founder Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white text-center">
            Your world.
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            Build what you imagined.
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style={{ background: "rgba(0,0,0,0.25)", color: "white" }}>
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(0,0,0,0.55)" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@bloombay.app"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{ background: "rgba(255,255,255,0.94)", color: "#111", borderColor: "transparent" }}
              onFocus={(e) => (e.target.style.borderColor = "#111")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(0,0,0,0.55)" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{ background: "rgba(255,255,255,0.94)", color: "#111", borderColor: "transparent" }}
              onFocus={(e) => (e.target.style.borderColor = "#111")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 rounded-full font-bold text-base mt-2 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ background: "#111111", color: "white", boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}
          >
            {pending ? "Entering…" : "Enter BloomBay"}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2" style={{ color: "rgba(0,0,0,0.55)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-xs tracking-wide">Private access only</span>
        </div>
      </div>
    </div>
  );
}
