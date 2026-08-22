import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { alumniManagementService } from "@/domains/alumni-management/alumniManagementService";
import type { AlumniRecord } from "@/domains/alumni-management/alumniManagement.types";

export const ALUMNI_QUERY_KEY = ["alumni"] as const;

export function useAlumniList() {
  return useApiQuery<AlumniRecord[]>({ queryKey: ALUMNI_QUERY_KEY, queryFn: alumniManagementService.list });
}
