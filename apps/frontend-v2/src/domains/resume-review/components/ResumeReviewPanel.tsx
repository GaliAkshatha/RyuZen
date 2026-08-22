import { FileSearch, CheckCircle2, AlertTriangle } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ScoreRing } from "@/shared/components/ScoreRing";
import { EmptyState } from "@/shared/components/EmptyState";
import { useResumeReview } from "@/domains/resume-review/hooks/useResumeReview";

export function ResumeReviewPanel() {
  const { mutate: runReview, data: review, isPending, error } = useResumeReview();

  return (
    <div className="flex flex-col gap-4">
      {!review ? (
        <EmptyState
          icon={FileSearch}
          title="Get real AI feedback on your resume"
          description="Reviews your saved resume, skills, projects, and experience together."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-5 rounded-lg border border-border p-4">
            <ScoreRing value={review.score} size={90} />
            <p className="text-sm text-foreground">{review.summary}</p>
          </div>

          {review.strengths.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Strengths
              </p>
              <ul className="flex flex-col gap-1 text-sm text-foreground">
                {review.strengths.map((s, i) => <li key={i}>· {s}</li>)}
              </ul>
            </div>
          )}

          {review.improvements.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-warning">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Suggested improvements
              </p>
              <ul className="flex flex-col gap-1 text-sm text-foreground">
                {review.improvements.map((s, i) => <li key={i}>· {s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <Button size="sm" className="w-fit" disabled={isPending} onClick={() => runReview()}>
        {isPending ? "Reviewing…" : review ? "Review again" : "Review my resume"}
      </Button>
    </div>
  );
}
