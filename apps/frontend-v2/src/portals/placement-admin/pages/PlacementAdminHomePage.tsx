import { Building2, Briefcase, Send, Lock } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";
import { PlacementDriveStatus } from "@/domains/placement-drives/placementDrive.types";

/** Real Placement Admin home - counts from the real Companies/Drives lists. */
export function PlacementAdminHomePage() {
  const { data: companies } = useCompanies();
  const { data: drives } = usePlacementDrives();

  const published = (drives ?? []).filter((d) => d.status === PlacementDriveStatus.PUBLISHED).length;
  const closed = (drives ?? []).filter((d) => d.status === PlacementDriveStatus.CLOSED).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Placements overview</h1>
        <p className="text-sm text-muted-foreground">A real snapshot of your placement pipeline.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Building2} value={companies?.length ?? 0} label="Companies" tone="primary" />
        <StatCard icon={Briefcase} value={drives?.length ?? 0} label="Total drives" tone="info" />
        <StatCard icon={Send} value={published} label="Published" tone="success" />
        <StatCard icon={Lock} value={closed} label="Closed" tone="warning" />
      </div>
    </div>
  );
}
