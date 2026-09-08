import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Brain,
  Image as ImageIcon,
  Video,
  Layers,
  Headphones,
  FileText,
  HelpCircle,
  Presentation,
  Paperclip,
  Rocket,
  Star,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TITLE = "Luna AI V3 Pro — ₹299/month | StudyLUNA";
const DESCRIPTION =
  "Luna AI V3 Pro is the premium StudyLUNA AI plan: advanced Luna AI, image, video, flashcard, podcast, notes, quiz and presentation generation, advanced file analysis and higher usage limits for ₹299/month.";
const URL = "https://studyluna-ai.lovable.app/luna-pro";

export const Route = createFileRoute("/luna-pro")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: LunaProPage,
});

const PRO_FEATURES = [
  {
    icon: Brain,
    title: "Advanced Luna AI",
    text: "Deeper reasoning, longer context and step-by-step explanations built for tough engineering concepts.",
  },
  {
    icon: ImageIcon,
    title: "Generate Image",
    text: "Turn any concept, circuit or diagram idea into a clear visual you can study from.",
  },
  {
    icon: Video,
    title: "Generate Video",
    text: "Short explainer videos for topics you keep forgetting — learn by watching, not just reading.",
  },
  {
    icon: Layers,
    title: "Generate Flashcards",
    text: "Instant spaced-repetition cards from your notes, syllabus or a single chapter.",
  },
  {
    icon: Headphones,
    title: "Generate Podcast",
    text: "Listen to your topics as a natural two-voice audio lesson during travel or a break.",
  },
  {
    icon: FileText,
    title: "Advanced Study Notes",
    text: "Exam-ready structured notes with definitions, formulas, diagrams and quick revision points.",
  },
  {
    icon: HelpCircle,
    title: "AI Quiz",
    text: "Auto-generated practice tests with answer explanations and weak-area feedback.",
  },
  {
    icon: Presentation,
    title: "AI Presentation",
    text: "Slide decks for seminars, mini-projects and reviews created from a single prompt.",
  },
  {
    icon: Paperclip,
    title: "Advanced File Analysis",
    text: "Upload PDFs, question papers, lab manuals and datasets — Luna reads and explains them.",
  },
  {
    icon: Rocket,
    title: "Higher AI Usage Limits",
    text: "Much larger daily message and generation limits so long study sessions never stop.",
  },
  {
    icon: Star,
    title: "Early Access to New Features",
    text: "Try every new Luna capability before it reaches the free plan.",
  },
] as const;

const TRUST = [
  "Cancel anytime — no lock-in",
  "Student-friendly pricing in ₹",
  "Your chats and files stay private",
] as const;

function LunaProPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/70 p-8 backdrop-blur-xl sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-chart-2/20 blur-3xl"
        />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Premium
        </span>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          ✨ Luna AI V3 Pro
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          The smarter AI learning experience for students — every premium Luna tool in one place.
        </p>

        <div className="mt-7 flex flex-wrap items-end gap-3">
          <span className="text-5xl font-extrabold tracking-tight text-foreground">₹299</span>
          <span className="pb-1.5 text-sm text-muted-foreground">/ month</span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade to Luna AI V3 Pro — ₹299/month
        </button>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {TRUST.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <h2 className="mt-14 text-2xl font-bold tracking-tight text-foreground">
        What you unlock with V3 Pro
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRO_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-semibold text-foreground">{feature.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{feature.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-14 grid gap-6 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm sm:grid-cols-2 sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">Free vs V3 Pro</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything on the free plan stays free. V3 Pro simply removes the limits and adds the
            creation tools.
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          {[
            "Free: chat with Luna AI, roadmaps, skills, projects and resources",
            "Pro: image, video, flashcards, podcast, quiz and presentation generation",
            "Pro: advanced study notes and advanced file analysis",
            "Pro: higher daily usage limits and early access to new features",
          ].map((line) => (
            <li key={line} className="flex gap-2 text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Sparkles className="h-4 w-4" /> Upgrade to Luna AI V3 Pro — ₹299/month
        </button>
        <Link
          to="/luna-ai"
          search={{}}
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Keep using the free plan
        </Link>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Checkout is not live yet
            </DialogTitle>
            <DialogDescription>
              Luna AI V3 Pro is ₹299/month. Online payment isn’t connected to StudyLUNA yet, so no
              charge can be made and no subscription is activated right now. Once payments are
              connected, this button will open a real, secure checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-2">
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Contact us about V3 Pro
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
