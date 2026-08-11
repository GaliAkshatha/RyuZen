import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";
import { GrowthRoadmapTab } from "@/features/growth/components/GrowthRoadmapTab";
import { GrowthLayout } from "@/features/growth/components/GrowthLayout";

export function GrowthRoadmapPage() {
  const { data: careerScore, isLoading, isError, error, refetch } = useCareerScore();

  if (isError) {
    return (
      <GrowthLayout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </GrowthLayout>
    );
  }

  return (
    <GrowthLayout>
      {isLoading ? (
        <SkeletonLoader className="h-24 w-full" />
      ) : (
        <GrowthRoadmapTab roadmap={careerScore?.roadmap ?? []} />
      )}
    </GrowthLayout>
  );
}
