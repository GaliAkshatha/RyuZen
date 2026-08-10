import { useApiQuery } from "@/hooks/useApiQuery";

import { facultyService } from "@/features/faculty/services/faculty.service";

/**
 * Closes the real, previously-documented gap: a faculty user now has
 * a genuine way to resolve their own Faculty.id. isError is expected
 * and normal for non-faculty callers or faculty accounts with no
 * linked profile - consumers should treat that as "no self-scoping
 * available" rather than a hard failure.
 */
export function useMyFacultyProfile() {
  return useApiQuery({
    queryKey: ["faculty", "me"] as const,
    queryFn: facultyService.getMe,
    retry: false,
  });
}
