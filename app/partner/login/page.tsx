"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";


export default function PartnerLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#120009" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + label */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <BBLogo size={52} light pinkColor="#FF1F7D" />
          </div>
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "#FF1F7D" }}
          >
            Partner Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white text-center">
            Your Partnership
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7a4560" }}>
            Let&apos;s create magic.
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
            style={{ background: "#2a0018", color: "#FF1F7D" }}
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#7a4560" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="partner@yourbrand.com"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{
                background: "#1e0012",
                color: "white",
                borderColor: "#3d0a25",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
              onBlur={(e) => (e.target.style.borderColor = "#3d0a25")}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#7a4560" }}
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
                background: "#1e0012",
                color: "white",
                borderColor: "#3d0a25",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
              onBlur={(e) => (e.target.style.borderColor = "#3d0a25")}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 rounded-full font-bold text-base mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ background: "#FF1F7D", color: "white" }}
          >
            {pending ? "Logging in…" : "Log In"}
          </button>
        </form>

        {/* Other portals */}
        <p className="text-center mt-5 text-xs" style={{ color: "#4a1a30" }}>
          <Link
            href="/portals"
            className="underline hover:text-white transition-colors"
          >
            Other portals
          </Link>
        </p>
      </div>
    </div>
  );
}
