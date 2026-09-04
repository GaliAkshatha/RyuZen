import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { pointLedgerService } from "@/domains/point-ledger/pointLedgerService";
import type { PointLedgerEntry } from "@/domains/point-ledger/pointLedger.types";

export function useStudentPointLedger(studentId: string) {
  return useApiQuery<PointLedgerEntry[]>({
    queryKey: ["point-ledger", studentId] as const,
    queryFn: () => pointLedgerService.listForStudent(studentId),
    enabled: Boolean(studentId),
  });
}
