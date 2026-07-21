import { useState } from "react";
import { UserSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard, SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";

import { useMyPortfolio } from "@/features/portfolio/hooks/useMyPortfolio";
import { useUpdatePortfolioSettings } from "@/features/portfolio/hooks/useUpdatePortfolioSettings";
import { useMyPortfolioProjects } from "@/features/portfolio/hooks/useMyPortfolioProjects";
import { useCreatePortfolioProject } from "@/features/portfolio/hooks/useCreatePortfolioProject";
import { useUpdatePortfolioProject } from "@/features/portfolio/hooks/useUpdatePortfolioProject";
import { PortfolioSettingsForm } from "@/features/portfolio/components/PortfolioSettingsForm";
import { PortfolioProjectForm } from "@/features/portfolio/components/PortfolioProjectForm";
import { DeletePortfolioProjectAction } from "@/features/portfolio/components/DeletePortfolioProjectAction";
import type { PortfolioProjectResponseDto } from "@/features/portfolio/types/portfolio.types";
import type {
  CreatePortfolioProjectFormValues,
  UpdatePortfolioProjectFormValues,
} from "@/features/portfolio/schemas/portfolioProject.schemas";

function ProjectRow({ project }: { project: PortfolioProjectResponseDto }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const { mutate: updateProject, isPending, error } = useUpdatePortfolioProject(project.id);

  if (editing) {
    return (
      <li className="rounded-md border border-border p-3">
        <PortfolioProjectForm
          project={project}
          isSubmitting={isPending}
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={(values) =>
            updateProject(values as UpdatePortfolioProjectFormValues, {
              onSuccess: () => {
                toast({ title: "Project updated" });
                setEditing(false);
              },
            })
          }
        />
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-2 rounded-md border border-border p-3">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
          {project.title}
          {project.featured && <Badge variant="outline">Featured</Badge>}
        </span>
        {project.description && (
          <p className="font-body text-sm text-muted-foreground">{project.description}</p>
        )}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DeletePortfolioProjectAction projectId={project.id} />
      </div>
    </li>
  );
}

export function MyPortfolioPage() {
  const { data: portfolio, isLoading, isError, error, refetch } = useMyPortfolio();
  const { data: projects, isLoading: isLoadingProjects } = useMyPortfolioProjects();
  const {
    mutate: updateSettings,
    isPending: isSavingSettings,
    error: settingsError,
  } = useUpdatePortfolioSettings();
  const {
    mutate: createProject,
    isPending: isCreatingProject,
    error: createProjectError,
  } = useCreatePortfolioProject();
  const { toast } = useToast();
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <UserSquare className="h-6 w-6 text-primary" aria-hidden="true" />
        My Portfolio
      </h1>

      {portfolio && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 font-body text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Skills</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {portfolio.skills.length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Experience</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {portfolio.experience.length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Education</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {portfolio.education.length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Certifications</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {portfolio.certifications.length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Achievements</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {portfolio.achievements.length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Projects</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {portfolio.projects.length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioSettingsForm
            settings={portfolio}
            isSubmitting={isSavingSettings}
            error={settingsError}
            onSubmit={(values) =>
              updateSettings(values, { onSuccess: () => toast({ title: "Settings saved" }) })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add a Project</CardTitle>
        </CardHeader>
        <CardContent>
          {showAddProjectForm ? (
            <PortfolioProjectForm
              isSubmitting={isCreatingProject}
              error={createProjectError}
              onCancel={() => setShowAddProjectForm(false)}
              onSubmit={(values) =>
                createProject(values as CreatePortfolioProjectFormValues, {
                  onSuccess: () => {
                    toast({ title: "Project added" });
                    setShowAddProjectForm(false);
                  },
                })
              }
            />
          ) : (
            <Button size="sm" onClick={() => setShowAddProjectForm(true)}>
              Add project
            </Button>
          )}
        </CardContent>
      </Card>

      {isLoadingProjects ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-20" />
          ))}
        </div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Showcase your work by adding a project." />
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}
