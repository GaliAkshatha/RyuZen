import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { alumniManagementService } from "@/domains/alumni-management/alumniManagementService";
import type { AlumniRecord } from "@/domains/alumni-management/alumniManagement.types";

export function useAlumniRecord(id: string) {
  return useApiQuery<AlumniRecord>({
    queryKey: ["alumni", id] as const,
    queryFn: () => alumniManagementService.getById(id),
    enabled: Boolean(id),
  });
}
