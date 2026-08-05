import { PointLedgerEntry } from "../../domain/entities/PointLedgerEntry.js";

export interface IPointLedgerRepository {

    /** The only write operation - matches the immutable, append-only design. No update/delete exist on this interface at all. */
    create(
        entry: PointLedgerEntry
    ): Promise<PointLedgerEntry>;

    /** The real chaining anchor - null means this organization has no entries yet (use PointLedgerEntry.genesisHash). */
    findLatestForOrganization(
        organizationId: string
    ): Promise<PointLedgerEntry | null>;

    findByStudentId(
        organizationId: string,
        studentId: string
    ): Promise<PointLedgerEntry[]>;

    /** The full ordered chain for one organization - used for audit-trail verification. */
    findAllForOrganization(
        organizationId: string
    ): Promise<PointLedgerEntry[]>;

}
