import { useApiQuery } from "@/hooks/useApiQuery";

import { pointLedgerService } from "@/features/point-ledger/services/point-ledger.service";

export function useStudentPointHistory(studentId: string) {
  return useApiQuery({
    queryKey: ["point-ledger", "students", studentId] as const,
    queryFn: () => pointLedgerService.listForStudent(studentId),
    enabled: Boolean(studentId),
  });
}
