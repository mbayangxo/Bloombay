"use client";

import { createClient } from "@/lib/supabase/browser";

export type MemberSignUpInput = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  city: string;
  neighborhood: string;
};

/** Member email signup — metadata flows to auth.users → handle_new_user → profiles. */
export async function signUpMember(input: MemberSignUpInput) {
  const supabase = createClient();
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();
  const city = input.city.trim();
  const neighborhood = input.neighborhood.trim();
  const email = input.email.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: fullName,
        phone,
        city,
        neighborhood,
        role: "member",
      },
    },
  });

  if (error) throw error;

  if (data.session) {
    void fetch("/api/member/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        fullName,
        phone,
        city,
        neighborhood,
      }),
    }).catch(() => {
      /* welcome pack is best-effort — signup still succeeds */
    });

    const res = await fetch("/api/member/profile/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        fullName,
        phone,
        city,
        neighborhood,
      }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) {
      throw new Error(json.error ?? "Profile could not be saved");
    }
  }

  return data;
}
