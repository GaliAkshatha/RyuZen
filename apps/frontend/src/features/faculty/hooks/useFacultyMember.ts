import { useApiQuery } from "@/hooks/useApiQuery";

import { facultyService } from "@/features/faculty/services/faculty.service";

export function useFacultyMember(id: string) {
  return useApiQuery({
    queryKey: ["faculty", id] as const,
    queryFn: () => facultyService.getById(id),
    enabled: Boolean(id),
  });
}
