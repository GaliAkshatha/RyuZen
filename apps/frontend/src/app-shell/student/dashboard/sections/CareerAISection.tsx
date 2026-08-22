import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { Button } from "@/shared/ui/Button";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

/**
 * Reuses the same careerScore response already fetched for
 * CareerScoreSection (React Query dedupes the call - no second
 * request). Summary + link only, never an embedded chat, per the
 * approved spec.
 */
export function CareerAISection() {
  const { data: score, isLoading, isError } = useCareerScore();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <SkeletonLoader className="h-3.5 w-64" />
            <SkeletonLoader className="h-3.5 w-48" />
          </div>
        ) : isError || !score?.narrative ? (
          <p className="font-body text-sm text-muted-foreground">
            Your AI insight will appear here once there's enough activity to analyze.
          </p>
        ) : (
          <p className="line-clamp-2 font-body text-sm text-foreground">{score.narrative}</p>
        )}
      </div>
      <Button asChild variant="outline" size="sm" className="shrink-0">
        <Link to="/app/ai/chat">Open AI Assistant</Link>
      </Button>
    </div>
  );
}
