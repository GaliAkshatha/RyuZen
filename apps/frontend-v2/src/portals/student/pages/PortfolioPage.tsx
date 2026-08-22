import { useState } from "react";
import { Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { usePortfolio } from "@/domains/portfolio/hooks/usePortfolio";
import { useUpdatePortfolioSettings } from "@/domains/portfolio/hooks/useUpdatePortfolioSettings";
import { PortfolioSettingsForm } from "@/domains/portfolio/components/PortfolioSettingsForm";

/**
 * Real, read-only display of the 6 aggregated sub-domains
 * (skills/projects/experience/education/certifications/achievements) -
 * confirmed the skills are already approved-only and achievements
 * already VERIFIED-only, server-side. Full create/edit for each
 * individual sub-domain (adding a new project, a new skill, etc.) is
 * genuinely separate, larger work - each has its own real backend
 * CRUD surface not yet built fresh in this rebuild. Only the
 * portfolio-level settings (headline/summary/links/visibility) are
 * editable here, matching what this one real endpoint actually owns.
 */
export function PortfolioPage() {
  const { data: portfolio, isLoading, isError, error, refetch } = usePortfolio();
  const { mutate: updateSettings, isPending } = useUpdatePortfolioSettings();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !portfolio) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{portfolio.headline || portfolio.name}</h1>
          {portfolio.summary && <p className="mt-1 max-w-xl text-sm text-muted-foreground">{portfolio.summary}</p>}
        </div>
        <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => setIsEditing((v) => !v)}>
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioSettingsForm
              portfolio={portfolio}
              isSubmitting={isPending}
              onSubmit={(values) => updateSettings(values, { onSuccess: () => setIsEditing(false) })}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.skills.length === 0 ? (
            <EmptyState title="No skills yet" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.projects.length === 0 ? (
            <EmptyState title="No projects yet" />
          ) : (
            <div className="flex flex-col gap-3">
              {portfolio.projects.map((project) => (
                <div key={project.id}>
                  <p className="font-medium text-foreground">{project.title}</p>
                  {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                  {project.techStack.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">{project.techStack.join(" · ")}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.experience.length === 0 ? (
            <EmptyState title="No experience yet" />
          ) : (
            <div className="flex flex-col gap-3">
              {portfolio.experience.map((exp) => (
                <div key={exp.id}>
                  <p className="font-medium text-foreground">
                    {exp.role} · {exp.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(exp.startDate).getFullYear()} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.education.length === 0 ? (
            <EmptyState title="No education records yet" />
          ) : (
            <div className="flex flex-col gap-3">
              {portfolio.education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-medium text-foreground">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.institution} · {edu.startYear}
                    {edu.endYear ? `-${edu.endYear}` : ""}
                    {edu.cgpa ? ` · CGPA ${edu.cgpa}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.certifications.length === 0 ? (
            <EmptyState title="No certifications yet" />
          ) : (
            <div className="flex flex-col gap-3">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id}>
                  <p className="font-medium text-foreground">{cert.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuer} · {new Date(cert.issueDate).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.achievements.length === 0 ? (
            <EmptyState title="No verified achievements yet" />
          ) : (
            <div className="flex flex-col gap-3">
              {portfolio.achievements.map((achievement) => (
                <div key={achievement.id}>
                  <p className="font-medium text-foreground">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(achievement.achievementDate).toLocaleDateString()}
                    {achievement.position ? ` · ${achievement.position}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
