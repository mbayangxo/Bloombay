/** Curator portal demo data */

export const CURATOR_PROFILE = {
  name: "Amanda Williams",
  email: "curator@bloombay.app",
  city: "Williamsburg",
  neighborhood: "Brooklyn",
  status: "active" as const,
  clubs: ["Morning Run Club", "Book & Wine"],
};

export const CURATOR_STATS = {
  womenWelcomed: 42,
  gatheringsHosted: 6,
  eventsScheduled: 3,
};

export const CURATOR_GATHERINGS = [
  {
    id: "cg1",
    title: "Saturday in Soho",
    date: "May 24 · 8:00 PM",
    venue: "Sant Ambroeus",
    status: "confirmed" as const,
    women: 8,
  },
  {
    id: "cg2",
    title: "Wine & Girl Talk",
    date: "May 25 · 7:30 PM",
    venue: "Café Lume",
    status: "confirmed" as const,
    women: 5,
  },
  {
    id: "cg3",
    title: "Morning run · pier",
    date: "Jun 1 · 7:00 AM",
    venue: "Brooklyn Bridge Park",
    status: "draft" as const,
    women: 0,
  },
];

export const CURATOR_WOMEN = [
  { id: "w1", name: "Sarah M.", status: "welcomed", club: "Book & Wine", note: "First gathering May 12" },
  { id: "w2", name: "Priya K.", status: "invited", club: "Morning Run", note: "Referred by host" },
  { id: "w3", name: "Jordan L.", status: "welcomed", club: "Book & Wine", note: "Verified · NYC" },
  { id: "w4", name: "Maya T.", status: "new", club: "—", note: "Bloom request: dinner club" },
];
