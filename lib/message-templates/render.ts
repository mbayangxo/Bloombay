import type { TemplateVariables } from "@/lib/message-templates/types";

export function renderTemplateString(template: string, vars: TemplateVariables): string {
  return template.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_, rawKey: string) => {
    const key = rawKey.toLowerCase();
    const value = vars[key];
    return value == null ? "" : String(value);
  });
}

export function buildPlaceLabel(neighborhood?: string | null, city?: string | null) {
  if (neighborhood && city) return `${neighborhood}, ${city}`;
  return city || neighborhood || "your city";
}

export function welcomeTemplateVars(input: {
  fullName: string;
  email?: string;
  city?: string;
  neighborhood?: string;
}) {
  const fullName = input.fullName.trim();
  const firstName = fullName.split(/\s+/)[0] || "there";
  const place = buildPlaceLabel(input.neighborhood, input.city);
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", "") ??
    "http://127.0.0.1:3000";

  return {
    first_name: firstName,
    full_name: fullName || "Member",
    email: input.email ?? "",
    city: input.city ?? "",
    neighborhood: input.neighborhood ?? "",
    place,
    place_suffix: place && place !== "your city" ? ` in ${place}` : "",
    app_url: appUrl.replace(/\/$/, ""),
  };
}

export function seatTemplateVars(input: {
  fullName?: string;
  title: string;
  when?: string;
  place?: string;
}) {
  const firstName = input.fullName?.trim().split(/\s+/)[0] || "there";
  const venue = input.place?.trim();
  const when = input.when?.trim();

  return {
    first_name: firstName,
    full_name: input.fullName?.trim() || firstName,
    title: input.title,
    when: when ?? "",
    place: venue ?? "",
    venue_suffix: venue ? ` at ${venue}` : "",
    when_suffix: when ? ` — ${when}` : "",
    place_suffix: venue ? ` · ${venue}` : "",
  };
}

export function emailHtmlFromText(body: string) {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#fff5f7;font-family:Georgia,'Times New Roman',serif;color:#1a0514;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #ffb7ce;padding:28px;line-height:1.6;font-size:16px;">
      ${escaped}
    </div>
  </body>
</html>`;
}
