"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";


export default function MemberLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--pale-pink-bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <BBLogo size={52} />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--bb-black)" }}
          >
            Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
          </h1>
          <p
            className="text-base font-semibold mt-1"
            style={{ color: "var(--bb-black)" }}
          >
            Welcome home.
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            Your city is waiting.
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
            style={{ background: "#FFE0EE", color: "#FF1F7D" }}
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "var(--bb-pink)" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm outline-none border-2 border-transparent transition-colors"
              style={{
                color: "var(--bb-black)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--bb-pink)")
              }
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "var(--bb-pink)" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm outline-none border-2 border-transparent transition-colors"
              style={{
                color: "var(--bb-black)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--bb-pink)")
              }
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 rounded-full text-white font-bold text-base mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ background: "var(--bb-pink)" }}
          >
            {pending ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          Not a member yet?{" "}
          <Link href="/onboard" className="font-semibold underline" style={{ color: "var(--bb-pink)" }}>
            Join BloomBay
          </Link>
        </p>

        {/* Social proof */}
        <div
          className="mt-8 rounded-3xl p-4"
          style={{ background: "var(--light-pink)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            {[
              { i: "A", c: "#FF1F7D" },
              { i: "S", c: "#FF69B4" },
              { i: "P", c: "#FF1F7D" },
              { i: "K", c: "#FF69B4" },
              { i: "C", c: "#111111" },
            ].map((a) => (
              <div
                key={a.i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: a.c }}
              >
                {a.i}
              </div>
            ))}
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--bb-black)" }}
          >
            100 Founding Mothers · NYC
          </p>
          <p
            className="text-xs italic mt-0.5"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--bb-pink)",
            }}
          >
            &ldquo;First birthday I actually celebrated.&rdquo; — Aaliyah
          </p>
        </div>
      </div>
    </div>
  );
}
