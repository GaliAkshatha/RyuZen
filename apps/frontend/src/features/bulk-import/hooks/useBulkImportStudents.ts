import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { bulkImportService } from "@/features/bulk-import/services/bulk-import.service";
import type { BulkImportReportDto } from "@/features/bulk-import/types/bulk-import.types";
import { INVITATIONS_QUERY_KEY } from "@/features/invitations/hooks/useInvitations";

export function useBulkImportStudents() {
  const queryClient = useQueryClient();

  return useApiMutation<BulkImportReportDto, File>({
    mutationFn: (file) => bulkImportService.importStudents(file),
    onSuccess: () => {
      // Every successful row created a real invitation, so the
      // Invitations list is now stale.
      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
    },
  });
}
