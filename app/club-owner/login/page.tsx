"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";


export default function ClubOwnerLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#FF1F7D" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + label */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <BBLogo size={52} light />
          </div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-white opacity-80">
            Club Owner Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white text-center">
            Your Clubhouse
          </h1>
          <p className="text-sm mt-1 text-white opacity-75">
            Manage your community.
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-white opacity-80">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@yourclub.com"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.9)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.3)")
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-white opacity-80">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none border-2 transition-colors"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.9)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.3)")
              }
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 rounded-full font-bold text-base mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ background: "white", color: "#FF1F7D" }}
          >
            {pending ? "Logging in…" : "Log In"}
          </button>
        </form>

        {/* Other portals */}
        <p className="text-center mt-5 text-sm text-white opacity-70">
          <Link href="/portals" className="underline hover:opacity-100 transition-opacity">
            Other portals
          </Link>
        </p>
      </div>
    </div>
  );
}
