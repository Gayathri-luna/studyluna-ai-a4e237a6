import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUp, Sparkles } from "lucide-react";

const EXAMPLES = [
  "Explain Fourier transform simply",
  "Best roadmap for embedded systems",
  "Project ideas for 2nd year ECE",
  "How do I prepare for GATE?",
] as const;

/**
 * Home-page AI search bar: sends the question straight to LunaAI, which opens a
 * fresh chat and streams the answer.
 */
export function HomeAiSearch() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    void navigate({ to: "/luna-ai", search: { q } });
  };

  return (
    <div className="mt-9 w-full max-w-2xl">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(value);
        }}
        className="group flex items-center gap-2 rounded-full border border-border/70 bg-card/70 p-2 pl-5 shadow-lg backdrop-blur-xl transition-colors focus-within:border-primary/70"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-primary" />
        <label className="sr-only" htmlFor="home-ai-search">
          Ask Luna AI anything
        </label>
        <input
          id="home-ai-search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask Luna AI anything — concepts, roadmaps, projects…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-base"
        />
        <button
          type="submit"
          aria-label="Ask Luna AI"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
          disabled={!value.trim()}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => ask(example)}
            className="rounded-full border border-border/70 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
