/**
 * An immutable record of one real point transaction. This is NOT
 * blockchain (no consensus, no distributed nodes, no mining) - it's a
 * single-writer, hash-chained append-only ledger: each entry's `hash`
 * is computed from its own content plus the PREVIOUS entry's hash
 * (see PointLedgerEntry.computeHash), so altering or deleting any past
 * entry breaks every hash after it - tamper-evident, not
 * tamper-proof. The chain is scoped per-organization (not one global
 * chain across every tenant, and not one micro-chain per student) so
 * an organization's full transaction history can be independently
 * audited without crossing tenant boundaries.
 *
 * Deliberately modeled as flat, self-contained facts (no references
 * that require joining other collections to make sense of an entry)
 * so persistence could genuinely be swapped for a real blockchain or
 * external ledger service later without changing any business logic
 * that reads or writes through IPointLedgerRepository.
 */
export interface IPointLedgerEntry {

    id?: string;

    organizationId: string;

    transactionId: string;

    studentId: string;

    /** Optional - not every point transaction is tied to a single activity (e.g. a manual admin adjustment). */
    activityId?: string;

    /** Positive for an award, negative for a deduction/correction. */
    points: number;

    reason: string;

    timestamp: Date;

    previousHash: string;

    hash: string;

}
