import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { pointLedgerService } from "@/domains/point-ledger/pointLedgerService";
import type { PointLedgerEntry } from "@/domains/point-ledger/pointLedger.types";

export function useMyPointLedger() {
  return useApiQuery<PointLedgerEntry[]>({
    queryKey: ["point-ledger", "me"] as const,
    queryFn: pointLedgerService.listMine,
  });
}
