import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: gathering, error } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, area, venue, description")
    .eq("id", id)
    .single();

  if (error || !gathering) {
    return new Response("Event not found", { status: 404 });
  }

  const startsAt = new Date(gathering.starts_at as string);
  // Format: YYYYMMDDTHHmmssZ
  function formatIcsDate(d: Date) {
    return d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }

  const dtStart = formatIcsDate(startsAt);
  // Default 2 hours duration
  const dtEnd = formatIcsDate(new Date(startsAt.getTime() + 2 * 60 * 60 * 1000));

  const location = (gathering.venue as string | null) ?? (gathering.area as string | null) ?? "";
  const description = (gathering.description as string | null) ?? "";
  const title = gathering.title as string;
  const uid = `${gathering.id}@bloombay`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bloombay//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SUMMARY:${title}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    description ? `DESCRIPTION:${description.replace(/\n/g, "\\n")}` : "",
    location ? `LOCATION:${location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const filename = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.ics`;

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
