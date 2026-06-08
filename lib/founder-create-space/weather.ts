export type DayWeather = {
  date: string;
  weatherCode: number;
  precipitationMm: number;
  tempMaxF: number;
  summary: string;
  isRainy: boolean;
  isOutdoorRisk: boolean;
};

const RAIN_CODES = new Set([
  51, 52, 53, 54, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
]);

function cToF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

export function isRainyCode(code: number, precipMm: number) {
  return RAIN_CODES.has(code) || precipMm >= 2;
}

export function weatherSummary(code: number, precipMm: number): string {
  if (precipMm >= 8 || code >= 95) return "Storms likely";
  if (isRainyCode(code, precipMm)) return precipMm >= 4 ? "Rainy" : "Light rain";
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Foggy";
  return "Mild";
}

/** Deterministic mock when API unavailable (prototype / offline). */
export function mockWeatherForDate(dateIso: string): DayWeather {
  const seed = dateIso.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rainy = seed % 7 === 0 || seed % 11 === 0;
  const code = rainy ? 61 : seed % 3 === 0 ? 2 : 0;
  const precip = rainy ? 4 + (seed % 6) : 0;
  return {
    date: dateIso,
    weatherCode: code,
    precipitationMm: precip,
    tempMaxF: rainy ? 58 + (seed % 8) : 68 + (seed % 12),
    summary: weatherSummary(code, precip),
    isRainy: isRainyCode(code, precip),
    isOutdoorRisk: isRainyCode(code, precip) || code >= 95,
  };
}

export function weatherPivotAdvice(weather: DayWeather, activityHint?: string): string {
  if (!weather.isOutdoorRisk) {
    return `Great day for IRL plans — ${weather.summary.toLowerCase()}, ~${weather.tempMaxF}°.`;
  }
  const hint = activityHint?.toLowerCase() ?? "";
  if (hint.includes("run") || hint.includes("walk") || hint.includes("outdoor")) {
    return `Rain expected (~${weather.precipitationMm}mm). Pivot to cozy indoor: wine bar, pottery, bowling, or a long brunch with a book nook.`;
  }
  return `${weather.summary} on ${weather.date}. Swap outdoor shots for indoor glow — booths, candles, rainy-window B-roll.`;
}

export type WeatherForecast = Record<string, DayWeather>;

export async function fetchWeatherForecast(dates: string[]): Promise<WeatherForecast> {
  if (!dates.length) return {};

  const sorted = [...dates].sort();
  const start = sorted[0];
  const end = sorted[sorted.length - 1];

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", "40.7128");
    url.searchParams.set("longitude", "-74.006");
    url.searchParams.set("timezone", "America/New_York");
    url.searchParams.set("start_date", start);
    url.searchParams.set("end_date", end);
    url.searchParams.set("daily", "weather_code,precipitation_sum,temperature_2m_max");

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("forecast failed");
    const data = (await res.json()) as {
      daily?: {
        time?: string[];
        weather_code?: number[];
        precipitation_sum?: number[];
        temperature_2m_max?: number[];
      };
    };

    const times = data.daily?.time ?? [];
    const out: WeatherForecast = {};
    for (let i = 0; i < times.length; i++) {
      const date = times[i];
      const code = data.daily?.weather_code?.[i] ?? 0;
      const precip = data.daily?.precipitation_sum?.[i] ?? 0;
      const tempC = data.daily?.temperature_2m_max?.[i] ?? 18;
      out[date] = {
        date,
        weatherCode: code,
        precipitationMm: precip,
        tempMaxF: cToF(tempC),
        summary: weatherSummary(code, precip),
        isRainy: isRainyCode(code, precip),
        isOutdoorRisk: isRainyCode(code, precip) || code >= 95,
      };
    }
    for (const d of dates) {
      if (!out[d]) out[d] = mockWeatherForDate(d);
    }
    return out;
  } catch {
    return Object.fromEntries(dates.map((d) => [d, mockWeatherForDate(d)]));
  }
}
