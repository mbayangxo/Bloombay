import { NextResponse } from "next/server";
import { requireFounderOrAdmin } from "@/lib/auth/require-founder-admin";
import { defaultTemplateForKey } from "@/lib/message-templates/defaults";
import { getAdminClient } from "@/lib/supabase-admin";

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    key: row.key as string,
    channel: row.channel as string,
    subject: (row.subject as string | null) ?? null,
    body: row.body as string,
    isActive: row.is_active as boolean,
    updatedAt: row.updated_at as string,
  };
}

export async function GET() {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: 403 });
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("message_templates")
      .select("id, key, channel, subject, body, is_active, updated_at")
      .order("key", { ascending: true });

    if (error) {
      if (error.message.includes("does not exist")) {
        return NextResponse.json({
          templates: [],
          warning: "Run supabase/migrations/012_message_templates.sql",
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates: (data ?? []).map((row) => mapRow(row as Record<string, unknown>)) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load templates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.error }, { status: 403 });
  }

  let body: {
    id?: string;
    key?: string;
    subject?: string | null;
    body?: string;
    isActive?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id && !body.key) {
    return NextResponse.json({ ok: false, error: "id or key required" }, { status: 400 });
  }

  if (body.body !== undefined && !body.body.trim()) {
    return NextResponse.json({ ok: false, error: "Body cannot be empty" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (body.subject !== undefined) patch.subject = body.subject;
  if (body.body !== undefined) patch.body = body.body.trim();
  if (body.isActive !== undefined) patch.is_active = body.isActive;

  try {
    const admin = getAdminClient();
    let query = admin.from("message_templates").update(patch);
    query = body.id ? query.eq("id", body.id) : query.eq("key", body.key!);

    const { data, error } = await query
      .select("id, key, channel, subject, body, is_active, updated_at")
      .maybeSingle();

    if (error) {
      if (error.message.includes("does not exist")) {
        return NextResponse.json(
          { ok: false, error: "Run supabase/migrations/012_message_templates.sql" },
          { status: 503 }
        );
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    if (!data) {
      const fallback = body.key ? defaultTemplateForKey(body.key) : null;
      if (!fallback) {
        return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
      }
      const { data: inserted, error: insertErr } = await admin
        .from("message_templates")
        .insert({
          key: fallback.key,
          channel: fallback.channel,
          subject: body.subject ?? fallback.subject,
          body: body.body?.trim() ?? fallback.body,
          is_active: body.isActive ?? true,
        })
        .select("id, key, channel, subject, body, is_active, updated_at")
        .single();
      if (insertErr) {
        return NextResponse.json({ ok: false, error: insertErr.message }, { status: 400 });
      }
      return NextResponse.json({ ok: true, template: mapRow(inserted as Record<string, unknown>) });
    }

    return NextResponse.json({ ok: true, template: mapRow(data as Record<string, unknown>) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
