import Image from "next/image";
import { EventCard, type EventCardData } from "@/app/components/portal/event-card-templates";
import { PINK, POSTER_IMGS } from "@/lib/happenings/constants";
import { StaticPosterCard } from "./static-poster-card";

const DEMO_EVENTS: EventCardData[] = [
  { id: "d1",  type: "concert",    title: "Vinyl Night & Jazz",        host: "Girl Creatives",  location: "Elsewhere, Bushwick",  date: "SAT JUL 12", time: "9 PM",    spotsLeft: 12, accentColor: "#1C1B1C" },
  { id: "d2",  type: "party",      title: "Girls Night Out",           host: "BloomBay",        location: "SoHo",                 date: "FRI JUL 11", time: "10 PM",   spotsLeft: 6,  accentColor: PINK },
  { id: "d3",  type: "supper",     title: "Italian Dinner Society",    host: "Yande M.",        location: "Carbone, West Village",date: "THU JUL 17", time: "7:30 PM", going: 8 },
  { id: "d4",  type: "invitation", title: "Pilates + Matcha Morning",  host: "Sofia K.",        location: "Williamsburg",         date: "SUN JUL 13", time: "9 AM",    spotsLeft: 3 },
  { id: "d5",  type: "open_seats", title: "Sunday Supper",             host: "Natalie M.",      location: "West Village",         date: "SUN JUL 13", time: "7 PM",    spotsLeft: 2,  going: 6 },
  { id: "d6",  type: "table",      title: "Private Dinner Party",      host: "House of Flora",  location: "NoHo",                 date: "SAT JUL 19", time: "8 PM",    spotsLeft: 4,  accentColor: "#1A3A1A" },
  { id: "d7",  type: "drinks",     title: "Aperitivo Hour",            host: "Valentini's",     location: "Nolita",               date: "FRI JUL 18", time: "6 PM",    spotsLeft: 8,  accentColor: "#C84030" },
  { id: "d8",  type: "museum",     title: "MoMA + Froyo After",        host: "Museum Girls",    location: "Midtown",              date: "SAT JUL 19", time: "2 PM",    spotsLeft: 5 },
  { id: "d9",  type: "brunch",     title: "Sunday Brunch Club",        host: "BloomBay",        location: "Ladurée SoHo",         date: "SUN JUL 20", time: "11 AM",   going: 14 },
  { id: "d10", type: "bakery",     title: "Croissant Morning",         host: "Flour & Stone",   location: "Lower East Side",      date: "SAT JUL 12", time: "9 AM",    spotsLeft: 10, accentColor: "#8B3A2A" },
  { id: "d11", type: "walk",       title: "Brooklyn Bridge Walk",      host: "Walk & Talk Club",location: "Brooklyn Bridge Park", date: "SUN JUL 13", time: "8 AM",    going: 22 },
  { id: "d12", type: "food",       title: "Wine & Cheese Tasting",     host: "Buvette",         location: "West Village",         date: "WED JUL 16", time: "7 PM",    spotsLeft: 6,  accentColor: "#C8860A" },
];

export function StaticCollage() {
  return (
    <>
      <div style={{ padding: "0 14px 8px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>HAPPENING SOON</p>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" as const }}>
          {DEMO_EVENTS.map(ev => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 12px 12px", scrollbarWidth: "none" as const }}>
        {[
          { img: POSTER_IMGS[0], title: "Girls Night Out", sub: "This weekend · SoHo" },
          { img: POSTER_IMGS[7], title: "Rooftop Sessions", sub: "Fri · 8PM · Williamsburg" },
          { img: POSTER_IMGS[5], title: "Dance All Night", sub: "Sat · Midnight · DUMBO" },
        ].map((item, i) => (
          <div key={i} style={{ flexShrink: 0, width: 150, height: 190, borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 6px 22px rgba(0,0,0,0.45)" }}>
            <Image src={item.img} alt={item.title} fill style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }}/>
            <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2 }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", marginTop: 2 }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 12px" }}>
        <StaticPosterCard img={POSTER_IMGS[3]} title="Italian Dinner Society" sub="Fri · Carbone · 7PM"/>
        <StaticPosterCard img={POSTER_IMGS[6]} title="Sunday Brunch Club" sub="Sun · 11AM · Ladurée"/>
        <StaticPosterCard img={POSTER_IMGS[2]} title="Vinyl Night & Jazz" sub="Sat · 9PM · Bushwick"/>
        <StaticPosterCard img={POSTER_IMGS[4]} title="Film Club" sub="Sun · 3PM · Lower East Side"/>
        <StaticPosterCard img={POSTER_IMGS[8]} title="Bagels & Books" sub="Sun · 10AM · Prospect Park"/>
        <StaticPosterCard img={POSTER_IMGS[9]} title="Ladies First Road Trip" sub="Weekend Getaway"/>
      </div>
    </>
  );
}
