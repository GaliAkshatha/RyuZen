import { useApiQuery } from "@/hooks/useApiQuery";

import { jobApplicationService } from "@/features/job-applications/services/jobApplication.service";

export const MY_JOB_APPLICATIONS_QUERY_KEY = ["job-applications", "mine"] as const;

export function useMyJobApplications(enabled = true) {
  return useApiQuery({
    queryKey: MY_JOB_APPLICATIONS_QUERY_KEY,
    queryFn: jobApplicationService.listMine,
    enabled,
  });
}
