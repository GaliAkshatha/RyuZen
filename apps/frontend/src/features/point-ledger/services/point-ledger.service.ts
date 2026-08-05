import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  PointLedgerAuditResponseDto,
  PointLedgerEntryResponseDto,
} from "@/features/point-ledger/types/point-ledger.types";

export const pointLedgerService = {
  /** The caller's own point history — STUDENT only, backend-enforced. */
  listMine(): Promise<PointLedgerEntryResponseDto[]> {
    return apiClient
      .get<PointLedgerEntryResponseDto[]>(`${API_ENDPOINTS.pointLedger}/me`)
      .then((response) => response.data);
  },

  listForStudent(studentId: string): Promise<PointLedgerEntryResponseDto[]> {
    return apiClient
      .get<PointLedgerEntryResponseDto[]>(`${API_ENDPOINTS.pointLedger}/${studentId}`)
      .then((response) => response.data);
  },

  /** The full organization chain plus real, independently recomputed hash-chain verification. */
  getAudit(): Promise<PointLedgerAuditResponseDto> {
    return apiClient
      .get<PointLedgerAuditResponseDto>(`${API_ENDPOINTS.pointLedger}/audit`)
      .then((response) => response.data);
  },
};
