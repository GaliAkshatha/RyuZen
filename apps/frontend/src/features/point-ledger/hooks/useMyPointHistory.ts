import { useApiQuery } from "@/hooks/useApiQuery";

import { pointLedgerService } from "@/features/point-ledger/services/point-ledger.service";

export function useMyPointHistory() {
  return useApiQuery({
    queryKey: ["point-ledger", "mine"] as const,
    queryFn: pointLedgerService.listMine,
  });
}
