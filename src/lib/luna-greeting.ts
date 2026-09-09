/**
 * Daily greeting + motivational quote for the Luna AI chat.
 *
 * Both values are derived from the clock and the calendar day, so every student
 * sees the same quote on a given day and a brand new one the next morning.
 */

export type Greeting = { label: string; emoji: string };

export function greetingForHour(hour: number): Greeting {
  if (hour >= 5 && hour < 12) return { label: "Good morning", emoji: "🌅" };
  if (hour >= 12 && hour < 17) return { label: "Good afternoon", emoji: "☀️" };
  if (hour >= 17 && hour < 21) return { label: "Good evening", emoji: "🌆" };
  return { label: "Good night", emoji: "🌙" };
}

/** Short, student-focused lines about learning, curiosity, tech and growth. */
export const QUOTES = [
  "Learn today. Build tomorrow. 🚀",
  "Curiosity is where every great invention begins. ✨",
  "One concept understood today can become one skill that shapes your future. 🌌",
  "Don't just study technology. Learn to create with it.",
  "Small steps, taken daily, become big engineering. 🛠️",
  "Every question you ask today takes you one step closer to your future.",
  "Understanding beats memorising, every single time.",
  "Debugging a problem is just learning in disguise. 🐞",
  "The best engineers are simply the most curious students. 🔍",
  "Progress is quiet. Keep showing up. 🌱",
  "Learn the basics deeply — the advanced part gets easy. 📘",
  "Your notes today are your confidence tomorrow. ✍️",
  "Ideas grow faster when you start building them. ⚙️",
  "Ask the simple question. That's where clarity lives.",
  "One hour of focus beats a whole day of scrolling. ⏳",
  "Technology rewards the people who stay curious. 💡",
  "You don't need to be perfect. You need to be consistent.",
  "Turn today's doubt into tomorrow's explanation. 🌠",
  "Great careers are built from small, finished projects. 🧩",
  "Learn it well enough to teach it. That's mastery. 🎓",
  "Innovation starts the moment you stop copying. ✨",
  "Read a little, build a lot. 🔧",
  "Every skill you learn opens a door you can't see yet. 🚪",
  "Curiosity today, capability tomorrow. 🌌",
  "The concept you fear most is the one worth learning first.",
  "Careers grow where learning never stops. 📈",
  "Write the code. The understanding follows. 💻",
  "You are one focused session away from getting it. ⭐",
  "Learning is the only shortcut that actually works.",
  "Build something small today, and be proud of it tonight. 🌙",
] as const;

/** Days elapsed since the epoch, in local time, so it flips at midnight. */
export function dayIndex(date = new Date()): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
}

export function quoteForDay(date = new Date()): string {
  const index = ((dayIndex(date) % QUOTES.length) + QUOTES.length) % QUOTES.length;
  return QUOTES[index]!;
}

/** A friendly name for the student, falling back to "Learner". */
export function learnerName(raw?: string | null): string {
  const name = (raw ?? "").trim();
  if (!name) return "Learner";
  const first = name.split(/[\s@.]+/)[0] ?? "";
  if (!first) return "Learner";
  return first.charAt(0).toUpperCase() + first.slice(1);
}
