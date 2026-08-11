import { EmptyState } from "@/shared/components/EmptyState";

/**
 * Real careerScore.roadmap from GetCareerScoreUseCase's AI generation
 * - the same source as Your Focus's recommendations, but framed here
 * as a longer-horizon sequence rather than immediate next steps.
 */
export function GrowthRoadmapTab({ roadmap }: { roadmap: string[] }) {
  if (roadmap.length === 0) {
    return (
      <EmptyState
        title="No roadmap yet"
        description="Your personalized career roadmap will appear here once there's enough activity to analyze."
      />
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {roadmap.map((step, index) => (
        <li key={index} className="flex items-start gap-3 rounded-lg border border-border bg-card/60 p-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <p className="font-body text-sm text-foreground">{step}</p>
        </li>
      ))}
    </ol>
  );
}
