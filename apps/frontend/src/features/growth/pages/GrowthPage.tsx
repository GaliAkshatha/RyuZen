import { useState } from "react";
import { TrendingUp } from "lucide-react";

import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/Tabs";

import { useMyPortfolio } from "@/features/portfolio/hooks/useMyPortfolio";
import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

import { GrowthOverviewTab } from "@/features/growth/components/GrowthOverviewTab";
import { GrowthSkillsTab } from "@/features/growth/components/GrowthSkillsTab";
import { GrowthAchievementsTab } from "@/features/growth/components/GrowthAchievementsTab";
import { GrowthCertificationsTab } from "@/features/growth/components/GrowthCertificationsTab";
import { GrowthProjectsTab } from "@/features/growth/components/GrowthProjectsTab";
import { GrowthExperienceEducationTab } from "@/features/growth/components/GrowthExperienceEducationTab";
import { GrowthRoadmapTab } from "@/features/growth/components/GrowthRoadmapTab";

/**
 * "What have I accomplished? What am I good at? What am I missing?
 * What should I improve next?" - built entirely from two real,
 * already-existing endpoints: GET /portfolio/me (skills, projects,
 * experience, education, certifications, verified achievements - one
 * aggregate call, not six) and GET /ai/career-score (score, narrative,
 * recommendations, roadmap). No new backend capability was invented;
 * every section maps to real, already-supported data. This is
 * deliberately NOT MyPortfolioPage's job (settings + project CRUD
 * forms) - Growth is read-focused, organized around "what does my
 * progress look like," not a data-entry page.
 */
export function GrowthPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: portfolio, isLoading: isLoadingPortfolio, isError, error, refetch } = useMyPortfolio();
  const { data: careerScore } = useCareerScore();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="particles" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
        Growth
      </h1>

      {isLoadingPortfolio || !portfolio ? (
        <div className="flex flex-col gap-4">
          <SkeletonLoader className="h-10 w-full max-w-xl" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-24" />
            ))}
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            {[
              { value: "overview", label: "Overview" },
              { value: "skills", label: "Skills" },
              { value: "achievements", label: "Achievements" },
              { value: "certifications", label: "Certifications" },
              { value: "projects", label: "Projects" },
              { value: "experience", label: "Experience & Education" },
              { value: "roadmap", label: "Roadmap" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-md border border-border bg-card/60 data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <GrowthOverviewTab portfolio={portfolio} careerScore={careerScore} onSelectTab={setActiveTab} />
          </TabsContent>
          <TabsContent value="skills">
            <GrowthSkillsTab skills={portfolio.skills} />
          </TabsContent>
          <TabsContent value="achievements">
            <GrowthAchievementsTab achievements={portfolio.achievements} />
          </TabsContent>
          <TabsContent value="certifications">
            <GrowthCertificationsTab certifications={portfolio.certifications} />
          </TabsContent>
          <TabsContent value="projects">
            <GrowthProjectsTab projects={portfolio.projects} />
          </TabsContent>
          <TabsContent value="experience">
            <GrowthExperienceEducationTab experience={portfolio.experience} education={portfolio.education} />
          </TabsContent>
          <TabsContent value="roadmap">
            <GrowthRoadmapTab roadmap={careerScore?.roadmap ?? []} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
