import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { facultyService } from "@/domains/faculty/facultyService";
import type { Faculty } from "@/domains/faculty/faculty.types";

export function useFacultyMember(id: string) {
  return useApiQuery<Faculty>({
    queryKey: ["faculty", id] as const,
    queryFn: () => facultyService.getById(id),
    enabled: Boolean(id),
  });
}
