import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { alumniManagementService } from "@/domains/alumni-management/alumniManagementService";
import type { AlumniRecord } from "@/domains/alumni-management/alumniManagement.types";

export function useMyAlumniRecord() {
  return useApiQuery<AlumniRecord>({
    queryKey: ["alumni", "me"] as const,
    queryFn: alumniManagementService.getMe,
  });
}
