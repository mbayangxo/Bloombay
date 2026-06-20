/** Happenings opens on a moment, not a tab list. */

export type HappeningMoment = {
  line: string;
  whisper: string;
};

export function happeningsMomentLine(tab: string): HappeningMoment {
  switch (tab) {
    case "invitations":
      return {
        line: "An envelope is waiting for you.",
        whisper: "Dinners, celebrations, tables set for women who show up.",
      };
    case "gatherings":
      return {
        line: "Tonight the city is already moving.",
        whisper: "Gatherings filling — admit one · her.",
      };
    case "city":
      return {
        line: "I want something tonight.",
        whisper: "Rooftops, pilates, girls out in SoHo.",
      };
    case "solo":
      return {
        line: "I need a soft hour alone — still in the city.",
        whisper: "Walk, museum, journal — your pace.",
      };
    case "bulletin":
      return {
        line: "I have a question for the city.",
        whisper: "Ask anything — the board answers back.",
      };
    default:
      return {
        line: "What should I do tonight?",
        whisper: "Seats · invitations · possibility.",
      };
  }
}
