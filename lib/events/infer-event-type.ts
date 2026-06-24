import type { EventType } from "@/app/components/portal/event-card-templates";

interface EventLike {
  event_type?: string | null;
  title?: string | null;
}

/** Map DB event_type + title → EventType for template dispatch */
export function inferEventType(ev: EventLike): EventType {
  const t = (ev.event_type ?? "").toLowerCase();
  const tt = (ev.title ?? "").toLowerCase();
  const s = `${t} ${tt}`;

  if (/concert|live music|vinyl night|jazz night|performance|gig|music show|afrobeats night|dance.*show/.test(s)) return "concert";
  if (/\bparty\b|girls night|birthday bash|girls.night.out|rooftop.*party|dance all night|night out|noche|rave|social night/.test(s)) return "party";
  if (/\binvit(ation|e)\b|private.*invite/.test(s)) return "invitation";
  if (/open.?seat|last.?seat|open.?table|seat.?available/.test(s)) return "open_seats";
  if (/private dinner|reserved table|members.table|dinner.*table|table.*dinner/.test(s)) return "table";
  if (/supper club|supper|intimate dinner|dinner party|dinner society|italian dinner/.test(s)) return "supper";
  if (/cocktail|aperitivo|wine night|wine.*tasting|bar night|drinks night|happy hour|champagne|rosé|rose|spirits|martini|negroni/.test(s)) return "drinks";
  if (/bakery|boulangerie|pastry|croissant|peko|bread|pâtisserie/.test(s)) return "bakery";
  if (/pop.?up|café|coffee.*event|bites|brunch.*event/.test(s)) return "popup";
  if (/food.*partner|tasting menu|culinary|feast|dining.*experience/.test(s)) return "food";
  if (/\bbrunch\b|sunday.*brunch|brunch.*club|mimosa|bagels/.test(s)) return "brunch";
  if (/\bdinner\b|\blunch\b|\bmeal\b|restaurant/.test(s)) return "supper";
  if (/\bwalk\b|outdoor|hike|run club|morning.*walk|stroll|trail/.test(s)) return "walk";
  if (/museum|gallery|exhibition|moma|the met|\bart show\b|art.*night/.test(s)) return "museum";
  return "gathering";
}
