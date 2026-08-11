import { useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap } from "lucide-react";

import { EmptyState } from "@/shared/components/EmptyState";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";

import type { ExperienceResponseDto } from "@/features/experience/types/experience.types";
import type { EducationResponseDto } from "@/features/education/types/education.types";

function formatDateRange(start: string, end: string | undefined, current: boolean) {
  const startLabel = new Date(start).toLocaleDateString(undefined, { month: "short", year: "numeric" });
  if (current) return `${startLabel} - Present`;
  if (!end) return startLabel;
  return `${startLabel} - ${new Date(end).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
}

export function GrowthExperienceEducationTab({
  experience,
  education,
}: {
  experience: ExperienceResponseDto[];
  education: EducationResponseDto[];
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="flex items-center gap-2 font-body text-sm font-semibold text-foreground">
          <Briefcase className="h-4 w-4 text-primary" aria-hidden="true" />
          Experience
        </h3>
        {experience.length === 0 ? (
          <EmptyState
            title="No experience yet"
            description="Add internships or jobs to build your professional history."
            actionLabel="Add experience"
            onAction={() => navigate("/app/career/experience")}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {experience.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border bg-card/60 p-3">
                <p className="font-body text-sm font-medium text-foreground">
                  {entry.role} · {entry.company}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {formatDateRange(entry.startDate, entry.endDate, entry.currentlyWorking)}
                  {entry.employmentType && ` · ${humanizeEnumValue(entry.employmentType)}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="flex items-center gap-2 font-body text-sm font-semibold text-foreground">
          <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
          Education
        </h3>
        {education.length === 0 ? (
          <EmptyState
            title="No education entries yet"
            description="Add your academic background to build your profile."
            actionLabel="Add education"
            onAction={() => navigate("/app/career/education")}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {education.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border bg-card/60 p-3">
                <p className="font-body text-sm font-medium text-foreground">
                  {entry.institution} — {entry.degree}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {entry.startYear}
                  {entry.endYear ? ` - ${entry.endYear}` : ""}
                  {entry.cgpa !== undefined && ` · CGPA ${entry.cgpa}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
