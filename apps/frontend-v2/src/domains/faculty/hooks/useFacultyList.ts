import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { facultyService } from "@/domains/faculty/facultyService";
import type { Faculty } from "@/domains/faculty/faculty.types";

export const FACULTY_QUERY_KEY = ["faculty"] as const;

export function useFacultyList() {
  return useApiQuery<Faculty[]>({
    queryKey: FACULTY_QUERY_KEY,
    queryFn: facultyService.list,
  });
}
