import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { dayIndex, greetingForHour, learnerName, quoteForDay } from "@/lib/luna-greeting";

/**
 * Calm cosmic welcome shown at the top of the Luna AI chat. It refreshes the
 * greeting as the hours pass and picks a new quote once the date changes, so a
 * student who leaves the tab open still gets tomorrow's line tomorrow.
 */
export function LunaGreeting() {
  const { user } = useAuth();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => {
      setNow((prev) => {
        const next = new Date();
        if (!prev) return next;
        const changed =
          prev.getHours() !== next.getHours() || dayIndex(prev) !== dayIndex(next);
        return changed ? next : prev;
      });
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Render nothing until the client clock is known — avoids a hydration mismatch.
  if (!now) return null;

  const greeting = greetingForHour(now.getHours());
  const name = learnerName(
    (user?.user_metadata?.["full_name"] as string | undefined) ?? user?.email ?? null,
  );

  return (
    <div className="animate-rise relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 px-5 py-4 backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 35%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-0 h-48 w-56 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-chart-2) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="relative">
        <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {greeting.label}, {name} <span aria-hidden>{greeting.emoji}</span>
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          {quoteForDay(now)}
        </p>
      </div>
    </div>
  );
}
