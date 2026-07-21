import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { facultyService } from "@/features/faculty/services/faculty.service";
import { FACULTY_QUERY_KEY } from "@/features/faculty/hooks/useFaculty";
import type {
  CreateFacultyPayload,
  FacultyResponseDto,
} from "@/features/faculty/types/faculty.types";

export function useCreateFaculty() {
  const queryClient = useQueryClient();

  return useApiMutation<FacultyResponseDto, CreateFacultyPayload>({
    mutationFn: facultyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEY });
    },
  });
}
