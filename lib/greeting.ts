export function getGreeting(firstName: string): { greeting: string; sub: string } {
  const h = new Date().getHours();
  const name = firstName?.trim() || "there";
  if (h < 6)  return { greeting: `Up late, ${name}.`, sub: "Night owl energy. We see you." };
  if (h < 12) return { greeting: `Good morning, ${name}.`, sub: "Fresh start. Let's see what's today." };
  if (h < 17) return { greeting: `Hey ${name}.`, sub: "Afternoon. Anything catching your eye?" };
  if (h < 21) return { greeting: `Evening, ${name}.`, sub: "The best plans start now." };
  return { greeting: `Good night, ${name}.`, sub: "Winding down. Plans for tomorrow?" };
}
