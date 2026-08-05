import { useApiMutation } from "@/hooks/useApiMutation";

import { recruiterService, type SearchApplicantsParams } from "@/features/recruiters/services/recruiter.service";
import type { JobApplicationResponseDto } from "@/features/job-applications/types/jobApplication.types";

/**
 * A search mutation, not a query — triggered on-demand when the
 * recruiter submits real criteria, not auto-fetched on every
 * keystroke or on mount.
 */
export function useSearchApplicants() {
  return useApiMutation<JobApplicationResponseDto[], SearchApplicantsParams>({
    mutationFn: (params) => recruiterService.searchApplicants(params),
  });
}
