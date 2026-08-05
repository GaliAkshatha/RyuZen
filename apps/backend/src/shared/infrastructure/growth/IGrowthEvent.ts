/**
 * Infrastructure, not a domain — see GrowthEvent.ts for the full
 * rationale. This is the shared vocabulary every real domain's
 * verification moment writes to (submission approved, achievement
 * verified, certificate issued, assessment scored, attendance
 * milestone, interview round passed, mentorship session logged),
 * mirroring the exact shape PointLedgerEntry/AuditLog already
 * established: a real evidence pointer, never a copy of the evidence
 * itself.
 */
export interface IGrowthEvent {

    id?: string;

    organizationId: string;

    studentId: string;

    /** Which real domain emitted this - "academic", "career", "campus", "placements", etc. Free text, not an enum, since new domains will keep integrating and a closed enum here would defeat the point. */
    domain: string;

    /** A specific, real action - "SUBMISSION_APPROVED", "ACHIEVEMENT_VERIFIED", "CERTIFICATE_ISSUED", etc. Matches the same naming convention already established for AuditLog actions. */
    eventType: string;

    /** A real pointer to the record that caused this event - never a duplicated copy of its data. */
    evidence: {
        entityType: string;
        entityId: string;
    };

    /** The real userId of whoever/whatever verified this - a faculty member's id, an admin's id, or "system" for an automatic, code-verified event (e.g. a deterministic score threshold). Never fabricated. */
    verifiedBy: string;

    /**
     * How much this event contributes to an aggregate view of growth -
     * a real, simple, transparent number the emitting domain decides
     * for itself (mirroring how Point Ledger's `points` is decided by
     * the caller, never invented here). 0 is valid - some events are
     * worth recording for the timeline/AI context even with no
     * numeric weight.
     */
    contributionWeight: number;

    occurredAt: Date;

}
