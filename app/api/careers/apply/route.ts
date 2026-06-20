import { NextResponse } from "next/server";
import {
  CAREER_ROLE_CATEGORIES,
  type CareerApplicationInput,
  type CareerRoleCategory,
} from "@/lib/careers-admin";
import { insertCareerApplication } from "@/lib/supabase-admin";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<CareerApplicationInput>;

  const first_name = String(body.first_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const role_title = String(body.role_title ?? "").trim();
  const role_category = String(body.role_category ?? "other") as CareerRoleCategory;

  if (!first_name || !email || !role_title) {
    return NextResponse.json(
      { error: "Name, email, and role are required." },
      { status: 400 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  if (!CAREER_ROLE_CATEGORIES.includes(role_category)) {
    return NextResponse.json({ error: "Invalid role category." }, { status: 400 });
  }

  const input: CareerApplicationInput = {
    first_name,
    email,
    role_title,
    role_category,
    phone: body.phone ? String(body.phone) : undefined,
    city: body.city ? String(body.city) : undefined,
    resume_url: body.resume_url ? String(body.resume_url) : undefined,
    linkedin_url: body.linkedin_url ? String(body.linkedin_url) : undefined,
    portfolio_url: body.portfolio_url ? String(body.portfolio_url) : undefined,
    cover_letter: body.cover_letter ? String(body.cover_letter) : undefined,
  };

  try {
    const row = await insertCareerApplication(input);
    return NextResponse.json({ ok: true, row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save application.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
