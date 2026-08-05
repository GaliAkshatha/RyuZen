import { useApiQuery } from "@/hooks/useApiQuery";

import { recruiterService } from "@/features/recruiters/services/recruiter.service";

export const MY_APPLICANTS_QUERY_KEY = ["recruiters", "me", "applicants"] as const;

export function useMyApplicants() {
  return useApiQuery({
    queryKey: MY_APPLICANTS_QUERY_KEY,
    queryFn: recruiterService.getMyApplicants,
  });
}
