import { Users } from "lucide-react";

import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useMyApplicants } from "@/domains/recruiters/hooks/useMyApplicants";
import { ApplicantRow } from "@/domains/recruiters/components/ApplicantRow";

export function ApplicantsPage() {
  const { data: applicants, isLoading, isError, error, refetch } = useMyApplicants();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Applicants</h1>
        <p className="text-sm text-muted-foreground">Every applicant to your company's real drives.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !applicants || applicants.length === 0 ? (
        <EmptyState icon={Users} title="No applicants yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {applicants.map((applicant) => (
            <ApplicantRow key={applicant.id} applicant={applicant} />
          ))}
        </div>
      )}
    </div>
  );
}
