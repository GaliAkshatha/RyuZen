import { Link } from "react-router-dom";
import { Send } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { StatusBadge } from "@/shared/components/StatusBadge";

import { useMyJobApplications } from "@/features/job-applications/hooks/useMyJobApplications";
import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";

/** Wired in PL3. Shows the student's own applications and their status. */
export function MyApplicationsWidget() {
  const { data: applications, isLoading } = useMyJobApplications();
  const { data: drives } = usePlacementDrives();

  const driveById = new Map((drives ?? []).map((d) => [d.id, d]));

  const recent = (applications ?? [])
    .slice()
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 4);

  return (
    <WidgetCard title="My Applications" icon={Send} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : recent.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          You haven't applied to any drives yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((application) => (
            <li key={application.id} className="flex items-center justify-between gap-2">
              <Link
                to={`/app/placements/drives/${application.placementId}`}
                className="truncate font-body text-sm text-foreground hover:underline"
              >
                {driveById.get(application.placementId)?.title ?? application.placementId}
              </Link>
              <StatusBadge status={application.status} />
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
