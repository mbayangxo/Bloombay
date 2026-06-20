/** Time-of-day helpers — greetings and night theme (client-safe). */

export type DayPhase = "morning" | "afternoon" | "evening" | "night";

export function getDayPhase(date = new Date()): DayPhase {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

export function getTimeOfDayGreeting(date = new Date()): string {
  switch (getDayPhase(date)) {
    case "morning":
      return "Good morning";
    case "afternoon":
      return "Good afternoon";
    case "evening":
      return "Good evening";
    case "night":
      return "Good night";
  }
}

/** Dim member portal after 8pm until 6am. */
export function isNightTheme(date = new Date()): boolean {
  const h = date.getHours();
  return h >= 20 || h < 6;
}
