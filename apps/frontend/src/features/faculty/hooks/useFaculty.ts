import { useApiQuery } from "@/hooks/useApiQuery";

import { facultyService } from "@/features/faculty/services/faculty.service";

export const FACULTY_QUERY_KEY = ["faculty"] as const;

export function useFaculty() {
  return useApiQuery({
    queryKey: FACULTY_QUERY_KEY,
    queryFn: facultyService.list,
  });
}
