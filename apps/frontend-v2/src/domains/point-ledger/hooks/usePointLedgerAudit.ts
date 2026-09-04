import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { pointLedgerService } from "@/domains/point-ledger/pointLedgerService";
import type { PointLedgerAudit } from "@/domains/point-ledger/pointLedger.types";

export function usePointLedgerAudit() {
  return useApiQuery<PointLedgerAudit>({
    queryKey: ["point-ledger", "audit"] as const,
    queryFn: pointLedgerService.audit,
  });
}
