import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { jobApplicationService } from "@/domains/job-applications/jobApplicationService";
import type { JobApplication } from "@/domains/job-applications/jobApplication.types";

export function useApplicationsForDrive(placementId: string) {
  return useApiQuery<JobApplication[]>({
    queryKey: ["applications", "drive", placementId] as const,
    queryFn: () => jobApplicationService.listForDrive(placementId),
    enabled: Boolean(placementId),
  });
}
