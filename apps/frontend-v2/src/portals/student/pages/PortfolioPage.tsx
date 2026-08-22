import { useState } from "react";
import {
  Pencil,
  Trophy,
  Sparkles,
  Link2,
  Globe,
  Code2,
  GraduationCap,
  Briefcase,
  Award,
  FolderGit2,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { cn } from "@/shared/utils/cn";
import { usePortfolio } from "@/domains/portfolio/hooks/usePortfolio";
import { useUpdatePortfolioSettings } from "@/domains/portfolio/hooks/useUpdatePortfolioSettings";
import { PortfolioSettingsForm } from "@/domains/portfolio/components/PortfolioSettingsForm";

type SectionKey = "skills" | "projects" | "achievements" | "experience" | "education" | "certifications";

const TILE_TONE: Record<SectionKey, { icon: LucideIcon; bg: string; fg: string }> = {
  skills: { icon: Code2, bg: "bg-success/10", fg: "text-success" },
  projects: { icon: FolderGit2, bg: "bg-primary/10", fg: "text-primary" },
  achievements: { icon: Trophy, bg: "bg-warning/10", fg: "text-warning" },
  experience: { icon: Briefcase, bg: "bg-info/10", fg: "text-info" },
  education: { icon: GraduationCap, bg: "bg-primary/10", fg: "text-primary" },
  certifications: { icon: Award, bg: "bg-success/10", fg: "text-success" },
};

/**
 * Real icon-tile grid landing (matching the approved wireframe),
 * click a tile to expand that section's real detail below - avoids
 * needing 6 separate routes while staying true to "tap tile to view
 * that section." Every count is real, no invented XP/level system.
 */
export function PortfolioPage() {
  const { data: portfolio, isLoading, isError, error, refetch } = usePortfolio();
  const { mutate: updateSettings, isPending } = useUpdatePortfolioSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

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

  const sectionCounts: Record<SectionKey, number> = {
    skills: portfolio.skills.length,
    projects: portfolio.projects.length,
    achievements: portfolio.achievements.length,
    experience: portfolio.experience.length,
    education: portfolio.education.length,
    certifications: portfolio.certifications.length,
  };

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
              {Object.values(sectionCounts).filter((c) => c > 0).length}/6 sections complete
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

      {/* Icon-tile grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(Object.keys(TILE_TONE) as SectionKey[]).map((key) => {
          const tone = TILE_TONE[key];
          return (
            <button
              key={key}
              onClick={() => setActiveSection(activeSection === key ? null : key)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-colors",
                activeSection === key ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone.bg, tone.fg)}>
                <tone.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold capitalize text-foreground">{key}</span>
              <span className="text-xs text-muted-foreground">{sectionCounts[key]} {sectionCounts[key] === 1 ? "entry" : "entries"}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded section detail */}
      {activeSection === "skills" && (
        <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            {portfolio.skills.length === 0 ? (
              <EmptyState title="No skills yet" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <span key={skill.id} className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeSection === "achievements" && (
        <Card>
          <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
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
      )}

      {activeSection === "projects" && (
        <Card>
          <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
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
      )}

      {activeSection === "experience" && (
        <Card>
          <CardHeader><CardTitle>Experience</CardTitle></CardHeader>
          <CardContent>
            {portfolio.experience.length === 0 ? (
              <EmptyState title="No experience yet" />
            ) : (
              <div className="flex flex-col gap-3">
                {portfolio.experience.map((exp) => (
                  <div key={exp.id}>
                    <p className="font-medium text-foreground">{exp.role} · {exp.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(exp.startDate).getFullYear()} - {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeSection === "education" && (
        <Card>
          <CardHeader><CardTitle>Education</CardTitle></CardHeader>
          <CardContent>
            {portfolio.education.length === 0 ? (
              <EmptyState title="No education records yet" />
            ) : (
              <div className="flex flex-col gap-3">
                {portfolio.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-medium text-foreground">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">
                      {edu.institution} · {edu.startYear}{edu.endYear ? `-${edu.endYear}` : ""}{edu.cgpa ? ` · CGPA ${edu.cgpa}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeSection === "certifications" && (
        <Card>
          <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
          <CardContent>
            {portfolio.certifications.length === 0 ? (
              <EmptyState title="No certifications yet" />
            ) : (
              <div className="flex flex-col gap-3">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="font-medium text-foreground">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer} · {new Date(cert.issueDate).getFullYear()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
