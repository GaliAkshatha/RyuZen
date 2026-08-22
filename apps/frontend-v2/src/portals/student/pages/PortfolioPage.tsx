import { useState } from "react";
import { Pencil, Trophy, Sparkles, Link2, Globe, Code2, GraduationCap, Briefcase, Award, FolderGit2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { usePortfolio } from "@/domains/portfolio/hooks/usePortfolio";
import { useUpdatePortfolioSettings } from "@/domains/portfolio/hooks/useUpdatePortfolioSettings";
import { PortfolioSettingsForm } from "@/domains/portfolio/components/PortfolioSettingsForm";

const SECTIONS = ["skills", "projects", "experience", "education", "certifications", "achievements"] as const;

/**
 * Real, read-only display of the 6 aggregated sub-domains - a
 * "profile card" treatment built entirely from real counts, not
 * invented gamification. "Sections complete" is an honest ratio (how
 * many of the 6 real sections have at least one entry) - not a fake
 * XP/level system with numbers that don't map to anything real.
 * Skills/achievements/certifications get colored chip/badge treatment
 * since those are genuinely list-of-tags data; projects and
 * experience stay as real cards since they carry real prose.
 */
export function PortfolioPage() {
  const { data: portfolio, isLoading, isError, error, refetch } = usePortfolio();
  const { mutate: updateSettings, isPending } = useUpdatePortfolioSettings();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !portfolio) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const sectionCounts: Record<(typeof SECTIONS)[number], number> = {
    skills: portfolio.skills.length,
    projects: portfolio.projects.length,
    experience: portfolio.experience.length,
    education: portfolio.education.length,
    certifications: portfolio.certifications.length,
    achievements: portfolio.achievements.length,
  };
  const completedSections = SECTIONS.filter((s) => sectionCounts[s] > 0).length;

  const socialLinks = [
    { icon: FolderGit2, url: portfolio.github, label: "GitHub" },
    { icon: Link2, url: portfolio.linkedin, label: "LinkedIn" },
    { icon: Code2, url: portfolio.leetcode, label: "LeetCode" },
    { icon: Globe, url: portfolio.website, label: "Website" },
  ].filter((l) => l.url);

  return (
    <div className="flex flex-col gap-6">
      {/* Profile header card */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        <CardContent className="-mt-10 flex flex-col gap-4 pb-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
                {portfolio.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-foreground">{portfolio.headline || portfolio.name}</h1>
                {portfolio.summary && <p className="max-w-md text-sm text-muted-foreground">{portfolio.summary}</p>}
              </div>
            </div>
            <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => setIsEditing((v) => !v)}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {completedSections}/6 sections complete
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              {portfolio.achievements.length} achievements unlocked
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
              {portfolio.skills.length} skills verified
            </span>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                <link.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

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

      {/* Skills as unlocked badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-success" aria-hidden="true" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.skills.length === 0 ? (
            <EmptyState title="No skills yet" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-sm font-medium text-success"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements as trophy cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.achievements.length === 0 ? (
            <EmptyState title="No verified achievements yet" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {portfolio.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(achievement.achievementDate).toLocaleDateString()}
                      {achievement.position ? ` · ${achievement.position}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-primary" aria-hidden="true" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.projects.length === 0 ? (
            <EmptyState title="No projects yet" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {portfolio.projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium text-foreground">{project.title}</p>
                  {project.description && <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>}
                  {project.techStack.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-info" aria-hidden="true" />
            Experience
          </CardTitle>
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

      {/* Education + Certifications side by side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-secondary" aria-hidden="true" />
              Education
            </CardTitle>
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
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" aria-hidden="true" />
              Certifications
            </CardTitle>
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
      </div>
    </div>
  );
}
