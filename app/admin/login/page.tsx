"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";


export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#111111" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + label */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <BBLogo size={52} light />
          </div>
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "#FF1F7D" }}
          >
            Admin Portal
          </span>
          <h1
            className="text-2xl font-bold tracking-tight text-white text-center"
          >
            Operations
          </h1>
          <p className="text-sm mt-1" style={{ color: "#9e7a8a" }}>
            Keep BloomBay running.
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
            style={{ background: "#2d0a1f", color: "#FF1F7D" }}
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#9e7a8a" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="founder@bloombay.com"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{
                background: "#2a0d1e",
                color: "white",
                borderColor: "#3d1630",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
              onBlur={(e) => (e.target.style.borderColor = "#3d1630")}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#9e7a8a" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{
                background: "#2a0d1e",
                color: "white",
                borderColor: "#3d1630",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
              onBlur={(e) => (e.target.style.borderColor = "#3d1630")}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 rounded-full font-bold text-base mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ background: "#FF1F7D", color: "white" }}
          >
            {pending ? "Authenticating…" : "Log In"}
          </button>
        </form>

        {/* Other portals */}
        <p className="text-center mt-5 text-xs" style={{ color: "#5a3047" }}>
          <Link
            href="/portals"
            className="underline hover:text-white transition-colors"
          >
            Other portals
          </Link>
        </p>

        {/* Secure access note */}
        <div
          className="mt-10 flex items-center justify-center gap-2"
          style={{ color: "#5a3047" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-xs tracking-wide">Secure access only</span>
        </div>
      </div>
    </div>
  );
}
