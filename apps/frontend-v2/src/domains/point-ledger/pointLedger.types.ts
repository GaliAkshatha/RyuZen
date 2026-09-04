/** Matches the real backend PointLedgerEntryResponseDto exactly. */
export interface PointLedgerEntry {
  id: string;
  transactionId: string;
  studentId: string;
  activityId?: string;
  points: number;
  reason: string;
  timestamp: string;
  previousHash: string;
  hash: string;
}

/** Matches the real backend PointLedgerAuditResponseDto exactly - a real, independently recomputed hash-chain verification, not just a row dump. */
export interface PointLedgerAudit {
  entries: PointLedgerEntry[];
  isValid: boolean;
  brokenAtTransactionId?: string;
}
