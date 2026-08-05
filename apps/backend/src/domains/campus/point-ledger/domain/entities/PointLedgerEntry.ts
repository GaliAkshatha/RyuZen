import { randomUUID, createHash } from "node:crypto";

import { IPointLedgerEntry } from "../interfaces/IPointLedgerEntry.js";

const GENESIS_HASH = "0".repeat(64);

export class PointLedgerEntry {

    constructor(

        private readonly props: IPointLedgerEntry

    ) {}

    /**
     * The one real factory for a new ledger entry - computes
     * transactionId, timestamp, and hash itself, so no caller can
     * construct an entry with a hash that doesn't genuinely match its
     * own content. `previousHash` must be the real previous entry's
     * hash for this organization (or GENESIS_HASH for the first entry
     * ever recorded) - see PointLedgerRepository.findLatestHash.
     */
    static record(

        props: {
            organizationId: string;
            studentId: string;
            activityId?: string;
            points: number;
            reason: string;
            previousHash: string;
        }

    ): PointLedgerEntry {

        const transactionId = randomUUID();
        const timestamp = new Date();

        const hash = PointLedgerEntry.computeHash({
            transactionId,
            organizationId: props.organizationId,
            studentId: props.studentId,
            activityId: props.activityId,
            points: props.points,
            reason: props.reason,
            timestamp,
            previousHash: props.previousHash
        });

        return new PointLedgerEntry({
            organizationId: props.organizationId,
            transactionId,
            studentId: props.studentId,
            activityId: props.activityId,
            points: props.points,
            reason: props.reason,
            timestamp,
            previousHash: props.previousHash,
            hash
        });

    }

    /** Reconstructs a persisted entry exactly as stored, without recomputing anything - used by the mapper, never for creating new entries. */
    static fromPersisted(

        props: IPointLedgerEntry

    ): PointLedgerEntry {

        return new PointLedgerEntry(props);

    }

    static get genesisHash(): string {
        return GENESIS_HASH;
    }

    /**
     * Deterministic SHA-256 over the entry's own real content plus the
     * previous entry's hash - the actual chaining mechanism. Exposed
     * as a static method (not private) so an audit use case can
     * independently recompute and verify every entry's hash against
     * what's stored, proving the chain hasn't been tampered with.
     */
    static computeHash(

        content: {
            transactionId: string;
            organizationId: string;
            studentId: string;
            activityId?: string;
            points: number;
            reason: string;
            timestamp: Date;
            previousHash: string;
        }

    ): string {

        const payload = JSON.stringify({
            transactionId: content.transactionId,
            organizationId: content.organizationId,
            studentId: content.studentId,
            activityId: content.activityId ?? null,
            points: content.points,
            reason: content.reason,
            timestamp: content.timestamp.toISOString(),
            previousHash: content.previousHash
        });

        return createHash("sha256")
            .update(payload)
            .digest("hex");

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get transactionId(): string {
        return this.props.transactionId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get activityId(): string | undefined {
        return this.props.activityId;
    }

    get points(): number {
        return this.props.points;
    }

    get reason(): string {
        return this.props.reason;
    }

    get timestamp(): Date {
        return this.props.timestamp;
    }

    get previousHash(): string {
        return this.props.previousHash;
    }

    get hash(): string {
        return this.props.hash;
    }

    toObject(): Readonly<IPointLedgerEntry> {
        return Object.freeze({ ...this.props });
    }

}
