import { NextResponse, type NextRequest } from "next/server";
import { fetchWeatherForecast } from "@/lib/founder-create-space/weather";
import { requireFounderQaAccess } from "@/lib/founder-qa-auth";

export async function GET(request: NextRequest) {
  const guard = await requireFounderQaAccess(request);
  if (guard.error) return guard.error;

  const datesParam = request.nextUrl.searchParams.get("dates");
  const dates = datesParam
    ? datesParam.split(",").map((d) => d.trim()).filter(/^\d{4}-\d{2}-\d{2}$/.test)
    : [];

  if (!dates.length) {
    return NextResponse.json({ error: "dates query required (comma-separated YYYY-MM-DD)" }, { status: 400 });
  }

  const forecast = await fetchWeatherForecast(dates);
  return NextResponse.json({ ok: true, forecast });
}
