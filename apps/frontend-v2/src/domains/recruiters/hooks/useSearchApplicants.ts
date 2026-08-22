import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { recruiterService, type SearchApplicantsParams } from "@/domains/recruiters/recruiterService";
import type { JobApplication } from "@/domains/job-applications/jobApplication.types";

/** A mutation, not a query - the search only runs when the recruiter explicitly submits criteria, not automatically on every keystroke. */
export function useSearchApplicants() {
  return useApiMutation<JobApplication[], SearchApplicantsParams>({
    mutationFn: (params) => recruiterService.searchMyApplicants(params),
  });
}
