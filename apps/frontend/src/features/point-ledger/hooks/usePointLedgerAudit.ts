import { useApiQuery } from "@/hooks/useApiQuery";

import { pointLedgerService } from "@/features/point-ledger/services/point-ledger.service";

export function usePointLedgerAudit() {
  return useApiQuery({
    queryKey: ["point-ledger", "audit"] as const,
    queryFn: pointLedgerService.getAudit,
  });
}
