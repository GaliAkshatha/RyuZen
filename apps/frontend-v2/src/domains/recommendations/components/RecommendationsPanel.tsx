import { Sparkles, ClipboardList, Calendar, Users2 } from "lucide-react";

import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useRecommendations } from "@/domains/recommendations/hooks/useRecommendations";

const TYPE_ICON = { ACTIVITY: ClipboardList, EVENT: Calendar, CLUB: Users2 } as const;

export function RecommendationsPanel() {
  const { data: recommendations, isLoading, isError, error, refetch } = useRecommendations();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (!recommendations || recommendations.length === 0) {
    return <EmptyState icon={Sparkles} title="No recommendations yet" description="Check back as you complete more activities." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {recommendations.map((rec) => {
        const Icon = TYPE_ICON[rec.type] ?? Sparkles;
        return (
          <div key={rec.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{rec.title}</p>
              <p className="text-xs text-muted-foreground">{rec.reason}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
