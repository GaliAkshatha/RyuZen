import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { studentService } from "@/domains/students/studentService";
import { STUDENTS_QUERY_KEY } from "@/domains/students/hooks/useStudentList";
import type { BulkImportReport } from "@/domains/students/student.types";

export function useBulkImportStudents() {
  const queryClient = useQueryClient();
  return useApiMutation<BulkImportReport, File>({
    mutationFn: (file) => studentService.bulkImport(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });
}
