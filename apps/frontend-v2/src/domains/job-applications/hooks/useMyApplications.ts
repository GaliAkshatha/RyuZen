import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { jobApplicationService } from "@/domains/job-applications/jobApplicationService";
import type { JobApplication } from "@/domains/job-applications/jobApplication.types";

export const MY_APPLICATIONS_QUERY_KEY = ["applications", "me"] as const;

export function useMyApplications() {
  return useApiQuery<JobApplication[]>({
    queryKey: MY_APPLICATIONS_QUERY_KEY,
    queryFn: jobApplicationService.listMine,
  });
}
