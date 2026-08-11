import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useMyPortfolio } from "@/features/portfolio/hooks/useMyPortfolio";
import { GrowthExperienceEducationTab } from "@/features/growth/components/GrowthExperienceEducationTab";
import { GrowthLayout } from "@/features/growth/components/GrowthLayout";

export function GrowthExperiencePage() {
  const { data: portfolio, isLoading, isError, error, refetch } = useMyPortfolio();

  if (isError) {
    return (
      <GrowthLayout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </GrowthLayout>
    );
  }

  return (
    <GrowthLayout>
      {isLoading || !portfolio ? (
        <SkeletonLoader className="h-24 w-full" />
      ) : (
        <GrowthExperienceEducationTab experience={portfolio.experience} education={portfolio.education} />
      )}
    </GrowthLayout>
  );
}
