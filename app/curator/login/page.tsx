"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BBLogo } from "@/app/components/portal/bb-logo";
import { login, type LoginState } from "@/lib/auth/actions";

export default function CuratorLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#FFF5F8" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <BBLogo size={52} />
          </div>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>CURATOR PORTAL</p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--bb-black)" }}>
            Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
          </h1>
          <p className="text-base font-semibold mt-1 italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>
            She creates culture.
          </p>
          <p className="text-sm text-gray-400 mt-0.5 text-center">
            You build the world women want to live in.
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm outline-none border-2 border-transparent transition-colors"
              style={{ color: "var(--bb-black)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm outline-none border-2 border-transparent transition-colors"
              style={{ color: "var(--bb-black)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 rounded-full text-white font-bold text-base mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ background: "var(--bb-pink)" }}
          >
            {pending ? "Entering…" : "Enter Curator Portal"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          Wrong portal?{" "}
          <Link href="/portals" className="font-semibold underline" style={{ color: "var(--bb-pink)" }}>
            Back to portals
          </Link>
        </p>

        <div className="mt-8 rounded-3xl p-4" style={{ background: "var(--light-pink)" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>Curator · BloomBay</p>
          <p className="text-xs italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)" }}>
            &ldquo;You don&apos;t just attend. You create.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
