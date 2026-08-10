import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";

function daysUntil(deadline: string) {
  const diffMs = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * "Should feel like a Placement Management System" - real, currently
 * open drives sorted by how soon they close, not a static count. The
 * whole point is answering "what should I do today" (a drive closing
 * in 2 days is genuinely more urgent to review than one closing in 3
 * weeks) rather than a number that doesn't tell you where to look.
 */
export function ActiveDrivesWidget() {
  const { data: drives, isLoading } = usePlacementDrives();

  const active = (drives ?? [])
    .filter((d) => d.status === "PUBLISHED")
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 5);

  return (
    <WidgetCard title="Active Drives" icon={Rocket} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : active.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          No open drives right now — publish one to start accepting applications.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {active.map((drive) => {
            const days = drive.deadline ? daysUntil(drive.deadline) : null;
            return (
              <li key={drive.id}>
                <Link
                  to={`/app/placements/drives/${drive.id}`}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-accent/50"
                >
                  <span className="truncate font-body text-sm text-foreground">{drive.title}</span>
                  {days !== null && (
                    <span
                      className={`shrink-0 font-body text-xs ${days <= 3 ? "font-medium text-destructive" : "text-muted-foreground"}`}
                    >
                      {days > 0 ? `${days}d left` : "closing today"}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </WidgetCard>
  );
}
