import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { recruiterService } from "@/domains/recruiters/recruiterService";
import type { JobApplication } from "@/domains/job-applications/jobApplication.types";

export const MY_APPLICANTS_QUERY_KEY = ["recruiters", "me", "applicants"] as const;

export function useMyApplicants() {
  return useApiQuery<JobApplication[]>({
    queryKey: MY_APPLICANTS_QUERY_KEY,
    queryFn: recruiterService.listMyApplicants,
  });
}
