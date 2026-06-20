/** Partner portal demo data */

export const PARTNER_PROFILE = {
  name: "The Rose Room",
  type: "Restaurant",
  address: "12 Grove St, West Village, NYC",
  capacity: 40,
  photos: ["/bloom-assets/refs/tonight.jpg", "/bloom-assets/refs/lounge.jpg"],
  rating: 4.9,
  hostRating: 4.8,
  venueRating: 4.9,
};

export const PARTNER_AVAILABILITY = [
  { day: "Mon", slots: [] as string[] },
  { day: "Tue", slots: ["6:00 PM", "8:00 PM"] },
  { day: "Wed", slots: ["6:00 PM"] },
  { day: "Thu", slots: ["7:00 PM", "9:00 PM"] },
  { day: "Fri", slots: ["6:00 PM", "8:00 PM", "10:00 PM"] },
  { day: "Sat", slots: ["11:00 AM", "1:00 PM", "7:00 PM"] },
  { day: "Sun", slots: ["11:00 AM", "6:00 PM"] },
];

export const PARTNER_BOOKINGS_UPCOMING = [
  { id: "b1", event: "Williamsburg Dinner Circle", host: "Amanda R.", date: "Fri May 30", women: 28, status: "confirmed" },
  { id: "b2", event: "Founders Brunch", host: "Zoe L.", date: "Sun Jun 1", women: 24, status: "confirmed" },
];

export const PARTNER_BOOKINGS_PAST = [
  { id: "b3", event: "Book Club Supper", host: "Priya S.", date: "May 18", women: 32, revenue: 1280 },
  { id: "b4", event: "Harlem Literary Night", host: "Maya K.", date: "May 11", women: 18, revenue: 720 },
];

export const PARTNER_REVENUE = {
  eventsHosted: 24,
  womenHosted: 612,
  revenueGenerated: 18420,
  monthDelta: "+12%",
};

export const PARTNER_MESSAGES = [
  { id: "pm1", from: "BloomBay", preview: "Your May payout summary is ready", unread: true, date: "Today" },
  { id: "pm2", from: "Amanda R. · Host", preview: "Can we add 4 seats for Friday?", unread: true, date: "Yesterday" },
  { id: "pm3", from: "BloomBay Ops", preview: "Venue photo refresh approved", unread: false, date: "May 26" },
];

export const PARTNER_REVIEWS = [
  { author: "Maya K.", role: "Member", rating: 5, text: "Perfect room for our book club — felt safe and beautiful." },
  { author: "Amanda R.", role: "Host", rating: 5, text: "Responsive team, easy check-in flow." },
];
