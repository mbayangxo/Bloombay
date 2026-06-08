/** Demo attendance / no-show data for club owners */

export type NoShowRecord = {
  id: string;
  memberName: string;
  eventTitle: string;
  eventDate: string;
  rsvpStatus: "confirmed" | "waitlist";
};

export function listNoShows(clubId: string): NoShowRecord[] {
  void clubId;
  return [
    { id: "ns1", memberName: "Alex R.", eventTitle: "Sunday Supper", eventDate: "May 18", rsvpStatus: "confirmed" },
    { id: "ns2", memberName: "Sam T.", eventTitle: "Harlem Book Night", eventDate: "May 11", rsvpStatus: "confirmed" },
  ];
}

export function attendanceRateForClub(clubId: string): number {
  void clubId;
  return 88;
}
