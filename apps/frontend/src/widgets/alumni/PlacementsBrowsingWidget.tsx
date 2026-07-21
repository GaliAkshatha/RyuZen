import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";
import { PlacementDriveStatus } from "@/types/enums";

/**
 * Wired in PL2. Distinct from Student's future MyApplicationsWidget —
 * F5's backend research found Job Applications' apply/list-mine
 * endpoints are STUDENT-only. Alumni can browse placement drives (open
 * to all roles) but not apply, so this widget wires to PL2 (Placement
 * Drives, browse-only), not PL3 (Job Applications).
 */
export function PlacementsBrowsingWidget() {
  const { data: drives, isLoading } = usePlacementDrives();

  const published = (drives ?? [])
    .filter((d) => d.status === PlacementDriveStatus.PUBLISHED)
    .slice(0, 4);

  return (
    <WidgetCard title="Placements" icon={Briefcase} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : published.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          No open placement drives right now.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {published.map((drive) => (
            <li key={drive.id}>
              <Link
                to={`/app/placements/drives/${drive.id}`}
                className="flex items-center justify-between gap-2 font-body text-sm text-foreground hover:underline"
              >
                <span className="truncate">{drive.title}</span>
                {drive.package && (
                  <span className="shrink-0 text-muted-foreground">{drive.package}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
