"use client";

import { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagicLinkCallback } from "@/app/components/auth/magic-link-callback";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";


function MemberLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? searchParams.get("next") ?? "";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null
  );
  const [magicError, setMagicError] = useState("");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--pale-pink-bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="relative mb-5 flex items-center justify-center"
            style={{ width: 132, height: 132 }}
          >
            {/* soft pink halo */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,31,125,0.22) 0%, transparent 70%)" }}
            />
            {/* logo disc */}
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 104,
                height: 104,
                background: "#fff",
                boxShadow: "0 12px 40px rgba(255,31,125,0.20), inset 0 0 0 1px rgba(255,31,125,0.08)",
              }}
            >
              <BBLogo size={64} />
            </div>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--bb-black)" }}
          >
            Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
          </h1>
          <p
            className="text-xl mt-2"
            style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "var(--bb-pink)" }}
          >
            Welcome home.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Your city is waiting.
          </p>
        </div>

        <MagicLinkCallback portal="member" onError={setMagicError} />

        {/* Error */}
        {(state?.error || magicError) && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
            style={{ background: "#FFE0EE", color: "#FF1F7D" }}
          >
            {state?.error ?? magicError}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4">
          {redirectTo.startsWith("/") ? (
            <input type="hidden" name="redirect" value={redirectTo} />
          ) : null}
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
          <Link
            href={
              redirectTo.startsWith("/")
                ? `/onboard?redirect=${encodeURIComponent(redirectTo)}`
                : "/onboard"
            }
            className="font-semibold underline"
            style={{ color: "var(--bb-pink)" }}
          >
            Join BloomBay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--pale-pink-bg)" }}>
          Loading…
        </div>
      }
    >
      <MemberLoginForm />
    </Suspense>
  );
}
