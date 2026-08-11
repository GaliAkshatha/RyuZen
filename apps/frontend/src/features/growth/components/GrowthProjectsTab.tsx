import { useNavigate } from "react-router-dom";
import { FolderKanban, Github, ExternalLink } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";
import { EmptyState } from "@/shared/components/EmptyState";

import type { PortfolioProjectResponseDto } from "@/features/portfolio/types/portfolio.types";

export function GrowthProjectsTab({ projects }: { projects: PortfolioProjectResponseDto[] }) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Add real projects to showcase what you've built - this is what recruiters see on your portfolio."
        actionLabel="Add a project"
        onAction={() => navigate("/app/career/portfolio")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {projects.map((project) => (
        <div key={project.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-4">
          <div className="flex items-start gap-2">
            <FolderKanban className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-body text-sm font-medium text-foreground">{project.title}</p>
              {project.description && (
                <p className="mt-0.5 line-clamp-2 font-body text-xs text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="outline" className="text-[10px]">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-primary"
              >
                <Github className="h-3 w-3" aria-hidden="true" /> Code
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" /> Live
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
