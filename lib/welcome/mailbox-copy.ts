export function welcomeMailboxSubject(firstName: string) {
  return firstName ? `Welcome to BloomBay, ${firstName}` : "Welcome to BloomBay";
}

export function welcomeMailboxBody(input: {
  fullName: string;
  city?: string;
  neighborhood?: string;
}) {
  const firstName = input.fullName.trim().split(/\s+/)[0] || "there";
  const place =
    input.neighborhood && input.city
      ? `${input.neighborhood}, ${input.city}`
      : input.city || input.neighborhood || "your city";

  return `Hi ${firstName},

Welcome to BloomBay — women meeting women IRL in ${place}.

Open seats, clubs, and tonight in the city are waiting for you. Tap below to enter your home feed.

— BloomBay`;
}

export function welcomeSmsBody(input: {
  fullName: string;
  city?: string;
  neighborhood?: string;
}) {
  const firstName = input.fullName.trim().split(/\s+/)[0] || "there";
  const place =
    input.neighborhood && input.city
      ? `${input.neighborhood}, ${input.city}`
      : input.city || input.neighborhood || null;

  const where = place ? ` in ${place}` : "";
  return `Welcome to BloomBay, ${firstName}! You're in${where}. Open BloomBay for seats, clubs & tonight in the city.`;
}
