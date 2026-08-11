import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useMyPortfolio } from "@/features/portfolio/hooks/useMyPortfolio";
import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";
import { GrowthOverviewTab } from "@/features/growth/components/GrowthOverviewTab";
import { GrowthLayout } from "@/features/growth/components/GrowthLayout";

import { useNavigate } from "react-router-dom";

const TAB_ROUTES: Record<string, string> = {
  skills: "/app/growth/skills",
  projects: "/app/growth/projects",
  achievements: "/app/growth/achievements",
  certifications: "/app/growth/certifications",
  experience: "/app/growth/experience",
  education: "/app/growth/experience",
};

export function GrowthOverviewPage() {
  const navigate = useNavigate();
  const { data: portfolio, isLoading, isError, error, refetch } = useMyPortfolio();
  const { data: careerScore } = useCareerScore();

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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <GrowthOverviewTab
          portfolio={portfolio}
          careerScore={careerScore}
          onSelectTab={(tab) => navigate(TAB_ROUTES[tab] ?? "/app/growth")}
        />
      )}
    </GrowthLayout>
  );
}
