"use client";

import { createClient } from "@/lib/supabase/browser";

export async function signInWithGoogle(nextPath = "/member/onboarding") {
  const supabase = createClient();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      queryParams: { prompt: "consent" },
    },
  });
  if (error) throw error;
  if (data.url) window.location.href = data.url;
}

export async function signInWithPhoneOtp(phone: string) {
  const supabase = createClient();
  const normalized = phone.trim().startsWith("+") ? phone.trim() : `+1${phone.replace(/\D/g, "")}`;
  const { error } = await supabase.auth.signInWithOtp({
    phone: normalized,
    options: {
      channel: "sms",
    },
  });
  if (error) {
    if (error.message.includes("phone") || error.message.includes("SMS")) {
      throw new Error(
        "SMS sign-in needs Supabase phone auth enabled. Use email or Google for now, or ask the team to enable Twilio in Supabase."
      );
    }
    throw error;
  }
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = createClient();
  const normalized = phone.trim().startsWith("+") ? phone.trim() : `+1${phone.replace(/\D/g, "")}`;
  const { error } = await supabase.auth.verifyOtp({
    phone: normalized,
    token: token.trim(),
    type: "sms",
  });
  if (error) throw error;
}
