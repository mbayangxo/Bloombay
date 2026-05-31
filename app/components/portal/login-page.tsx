"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: "var(--bb-pink)" }}
          >
            <span className="text-3xl">🌸</span>
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
      </div>
    </div>
  );
}
