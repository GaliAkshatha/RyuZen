import { Briefcase } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useMyRecruiterProfile } from "@/domains/recruiters/hooks/useMyRecruiterProfile";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";

/**
 * Closes a previously-confirmed backend gap: "My Drives" could only
 * be approximated by deriving unique drive ids from the recruiter's
 * own applicants - incomplete, since a drive with zero applicants yet
 * would never appear. Now genuinely correct: filters the real drives
 * list by the recruiter's own real companyId (from the now-real
 * GET /recruiters/me self-lookup), so every one of their company's
 * drives shows up regardless of applicant count.
 */
export function MyDrivesPage() {
  const { data: profile, isLoading: isLoadingProfile } = useMyRecruiterProfile();
  const { data: drives, isLoading: isLoadingDrives, isError, error, refetch } = usePlacementDrives();

  const isLoading = isLoadingProfile || isLoadingDrives;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const myDrives = (drives ?? []).filter((d) => d.companyId === profile?.companyId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Drives</h1>
        <p className="text-sm text-muted-foreground">Every drive your company is running.</p>
      </div>

      {myDrives.length === 0 ? (
        <EmptyState icon={Briefcase} title="No drives yet" description="Your Placement Admin creates drives for your company." />
      ) : (
        <div className="flex flex-col gap-2">
          {myDrives.map((drive) => (
            <Card key={drive.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-foreground">{drive.title}</p>
                  {drive.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Apply by {new Date(drive.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <StatusBadge status={drive.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
