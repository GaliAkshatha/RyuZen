import { ErrorState } from "@/shared/components/ErrorState";

import { useMyApplicants } from "@/features/recruiters/hooks/useMyApplicants";
import { RecruiterLayout } from "@/features/recruiter-portal/components/RecruiterLayout";
import { ApplicantsTable } from "@/features/recruiter-portal/components/ApplicantsTable";

export function RecruiterApplicantsPage() {
  const { data: applicants, isLoading, isError, error, refetch } = useMyApplicants();

  if (isError) {
    return (
      <RecruiterLayout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <ApplicantsTable
        applicants={applicants ?? []}
        isLoading={isLoading}
        emptyTitle="No applicants yet"
        emptyDescription="Applicants to your company's placement drives will appear here."
      />
    </RecruiterLayout>
  );
}
