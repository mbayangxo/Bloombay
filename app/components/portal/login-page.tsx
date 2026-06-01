"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BBLogo } from "./bb-logo";
import { useState } from "react";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    router.push("/home");
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--pale-pink-bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <BBLogo size={52} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--bb-black)" }}>
            Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm outline-none border-2 border-transparent transition-colors"
              style={{
                color: "var(--bb-black)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm outline-none border-2 border-transparent transition-colors"
              style={{
                color: "var(--bb-black)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full text-white font-bold text-base mt-2 hover:brightness-110 active:scale-[0.98] transition-all"
            style={{ background: "var(--bb-pink)" }}
          >
            Log in
          </button>
        </form>

        <p className="text-center mt-4">
          <button className="text-sm text-gray-400 underline hover:text-gray-600">
            Forgot password?
          </button>
        </p>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Link
          href="/onboard"
          className="block text-center w-full py-4 rounded-full border-2 font-bold text-base hover:bg-pink-50 transition-all"
          style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
        >
          New? Join BloomBay 🌸
        </Link>

        {/* Social proof */}
        <div className="mt-8 rounded-3xl p-4" style={{ background: "var(--light-pink)" }}>
          <div className="flex items-center gap-2 mb-2">
            {[
              { i: "A", c: "#FF1F7D" }, { i: "S", c: "#FF69B4" },
              { i: "P", c: "#FF1F7D" }, { i: "K", c: "#FF69B4" },
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
          <p className="text-sm font-semibold" style={{ color: "var(--bb-black)" }}>
            247 women already inside.
          </p>
          <p
            className="text-xs italic mt-0.5"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)" }}
          >
            &ldquo;First birthday I actually celebrated.&rdquo; — Aaliyah
          </p>
        </div>
      </div>
    </div>
  );
}
