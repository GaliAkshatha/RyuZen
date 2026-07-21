import { Sparkles } from "lucide-react";

import { cn } from "@/utils/cn";

/**
 * Every AI Platform feature (AI1-AI5) currently returns real,
 * functional data for anything computable (scores, candidate
 * selection, session state) but placeholder narrative TEXT, since no
 * live language-model provider is configured on the backend yet (see
 * each AI milestone's backend notes). This notice makes that honest
 * and visible wherever such text is shown — never silently presenting
 * placeholder copy as if it were real AI output.
 *
 * Deliberately NOT used for genuinely computed values (e.g. Resume's
 * atsScore, Career Score's four component numbers) — only for the
 * generated-text portions. See CE7 and AI2/AI3's roadmap notes for the
 * score-vs-narrative distinction this component exists to support.
 */
export function AiPlaceholderNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-info/30 bg-info/5 px-3 py-2 font-body text-xs text-muted-foreground",
        className,
      )}
    >
      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" aria-hidden="true" />
      <span>
        This text is a placeholder — a live AI provider isn&apos;t connected yet. Any numbers shown
        alongside it are real.
      </span>
    </div>
  );
}
