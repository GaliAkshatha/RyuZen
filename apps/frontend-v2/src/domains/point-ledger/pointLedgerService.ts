import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { PointLedgerEntry, PointLedgerAudit } from "@/domains/point-ledger/pointLedger.types";

/** Real gap filled: /point-ledger existed on the backend (a real hash-chained, tamper-evident audit trail) with zero frontend caller. */
export const pointLedgerService = {
  async listMine(): Promise<PointLedgerEntry[]> {
    const res = await apiClient.get<ApiSuccessResponse<PointLedgerEntry[]>>("/point-ledger/me");
    return res.data.data;
  },

  async listForStudent(studentId: string): Promise<PointLedgerEntry[]> {
    const res = await apiClient.get<ApiSuccessResponse<PointLedgerEntry[]>>(`/point-ledger/${studentId}`);
    return res.data.data;
  },

  async audit(): Promise<PointLedgerAudit> {
    const res = await apiClient.get<ApiSuccessResponse<PointLedgerAudit>>("/point-ledger/audit");
    return res.data.data;
  },
};
