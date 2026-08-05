/**
 * Mirrors PointLedgerEntryResponseDto exactly. This is NOT blockchain
 * (no consensus, no distributed nodes) — a single-writer, hash-chained
 * append-only ledger, confirmed by reading PointLedgerEntry.ts
 * directly: each entry's `hash` is a SHA-256 over its own content plus
 * the previous entry's `hash`, chained per-organization. Genuinely
 * immutable — the backend repository interface exposes only `create`
 * and reads, no update or delete exists anywhere.
 *
 * Every entry here corresponds to a real point transaction the backend
 * actually performed — submission approval, event attendance, or a
 * manual admin adjustment (recorded as the real delta, not the new
 * absolute total) — never a value asserted by a client. `activityId`
 * is only present for activity-approval transactions; event-derived
 * transactions leave it undefined rather than misusing the field for
 * a different domain's id.
 */
export interface PointLedgerEntryResponseDto {
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

/**
 * Mirrors PointLedgerAuditResponseDto. `isValid` and
 * `brokenAtTransactionId` are computed fresh on every request by
 * GetPointLedgerAuditUseCase — independently recomputing every entry's
 * hash and confirming the chain, not trusting a stored flag.
 */
export interface PointLedgerAuditResponseDto {
  entries: PointLedgerEntryResponseDto[];
  isValid: boolean;
  brokenAtTransactionId?: string;
}
