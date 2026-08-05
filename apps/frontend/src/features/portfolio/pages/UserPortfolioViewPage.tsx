import { useParams } from "react-router-dom";
import {
  Github,
  Linkedin,
  Globe,
  Code2,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  Trophy,
  FolderKanban,
  Lock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Spinner } from "@/shared/components/Spinner";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { useUserPortfolio } from "@/features/portfolio/hooks/useUserPortfolio";

function initialsOf(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const SOCIAL_LINKS: { key: keyof NonNullable<ReturnType<typeof useUserPortfolio>["data"]>; label: string; icon: typeof Github }[] = [
  { key: "github", label: "GitHub", icon: Github },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "website", label: "Website", icon: Globe },
];

/**
 * The real page consuming GET /portfolio/:userId - a genuine, complete
 * backend capability (private-portfolio gating, unapproved-skill
 * filtering, verified-only achievements) that had no frontend page at
 * all until now. Reached from People/My Connections, closing the loop
 * between real connections and real portfolios.
 */
export function UserPortfolioViewPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: portfolio, isLoading, isError, error } = useUserPortfolio(userId!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    const isPrivate = (error as { statusCode?: number })?.statusCode === 403;
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Lock className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <p className="font-body text-sm text-muted-foreground">
          {isPrivate
            ? "This portfolio is private."
            : ((error as { message?: string })?.message ?? "This portfolio couldn't be loaded.")}
        </p>
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <Card>
        <CardContent className="flex flex-col gap-4 py-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-semibold text-primary">
              {portfolio.profileImage ? (
                <img
                  src={portfolio.profileImage}
                  alt={portfolio.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initialsOf(portfolio.name)
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-2xl font-semibold text-foreground">
                {portfolio.name}
              </h1>
              {portfolio.headline && (
                <p className="font-body text-sm text-muted-foreground">{portfolio.headline}</p>
              )}
              <Badge variant="outline" className="w-fit capitalize">
                {portfolio.role.toLowerCase().replace(/_/g, " ")}
              </Badge>
            </div>
          </div>

          {portfolio.summary && (
            <p className="font-body text-sm text-foreground">{portfolio.summary}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(({ key, label, icon: Icon }) => {
              const value = portfolio[key];
              if (typeof value !== "string" || !value) return null;
              return (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 font-body text-sm text-primary underline underline-offset-4"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {portfolio.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Skills
              <span className="font-body text-xs font-normal text-muted-foreground">
                (verified only)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {portfolio.skills.map((skill) => (
              <Badge key={skill.id} variant={skill.verified ? "success" : "outline"}>
                {skill.name}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {portfolio.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderKanban className="h-4 w-4 text-primary" aria-hidden="true" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {portfolio.projects.map((project) => (
              <div key={project.id} className="rounded-md border border-border p-3">
                <p className="font-body text-sm font-medium text-foreground">{project.title}</p>
                {project.description && (
                  <p className="font-body text-sm text-muted-foreground">{project.description}</p>
                )}
                {project.techStack.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {portfolio.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4 text-primary" aria-hidden="true" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {portfolio.experience.map((entry) => (
              <div key={entry.id}>
                <p className="font-body text-sm font-medium text-foreground">
                  {entry.role} · {entry.company}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {portfolio.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {portfolio.education.map((entry) => (
              <p key={entry.id} className="font-body text-sm text-foreground">
                {entry.institution} — {entry.degree}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {portfolio.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {portfolio.certifications.map((cert) => (
              <p key={cert.id} className="font-body text-sm text-foreground">
                {cert.title}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {portfolio.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />
              Achievements
              <span className="font-body text-xs font-normal text-muted-foreground">
                (verified only)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {portfolio.achievements.map((achievement) => (
              <p key={achievement.id} className="font-body text-sm text-foreground">
                {achievement.title}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
