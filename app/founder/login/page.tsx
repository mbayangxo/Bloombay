"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";

export default function FounderLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0A0005" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <BBLogo size={52} light />
          </div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#FF1F7D" }}>
            Founder Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white text-center">
            Your world.
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6a3a5a" }}>
            Build what you imagined.
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style={{ background: "#1a0010", color: "#FF1F7D" }}>
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6a3a5a" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@bloombay.app"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{ background: "#180010", color: "white", borderColor: "#3d0830" }}
              onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
              onBlur={(e) => (e.target.style.borderColor = "#3d0830")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6a3a5a" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{ background: "#180010", color: "white", borderColor: "#3d0830" }}
              onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
              onBlur={(e) => (e.target.style.borderColor = "#3d0830")}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 rounded-full font-bold text-base mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ background: "#FF1F7D", color: "white" }}
          >
            {pending ? "Entering…" : "Enter BloomBay"}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2" style={{ color: "#3d0830" }}>
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
