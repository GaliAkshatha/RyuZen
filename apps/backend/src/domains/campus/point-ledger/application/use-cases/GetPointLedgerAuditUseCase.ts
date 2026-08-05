import { PointLedgerEntry } from "../../domain/entities/PointLedgerEntry.js";

import { IPointLedgerRepository } from "../../infrastructure/repositories/IPointLedgerRepository.js";

import { PointLedgerResponseMapper } from "../../infrastructure/mappers/PointLedgerResponseMapper.js";

import { PointLedgerAuditResponseDto } from "../dto/PointLedgerAuditResponseDto.js";

/**
 * Returns the organization's full ledger PLUS a real, independently
 * recomputed verification - not just "here are the rows", but actual
 * proof the chain hasn't been tampered with. For each entry (in
 * chronological order): recompute its hash from its own stored
 * content and confirm it matches the stored `hash`, and confirm its
 * stored `previousHash` matches the actual previous entry's hash. The
 * first entry must chain to PointLedgerEntry.genesisHash.
 *
 * This is what "audit trail" means for a non-blockchain, single-writer
 * ledger: verification happens on read, computed fresh every time, not
 * trusted from storage.
 */
export class GetPointLedgerAuditUseCase {

    constructor(

        private readonly repository: IPointLedgerRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<PointLedgerAuditResponseDto> {

        const entries =

            await this.repository.findAllForOrganization(
                organizationId
            );

        let expectedPreviousHash = PointLedgerEntry.genesisHash;
        let isValid = true;
        let brokenAtTransactionId: string | undefined;

        for (const entry of entries) {

            const recomputedHash = PointLedgerEntry.computeHash({
                transactionId: entry.transactionId,
                organizationId: entry.organizationId,
                studentId: entry.studentId,
                activityId: entry.activityId,
                points: entry.points,
                reason: entry.reason,
                timestamp: entry.timestamp,
                previousHash: entry.previousHash
            });

            const hashMatches = recomputedHash === entry.hash;
            const chainMatches = entry.previousHash === expectedPreviousHash;

            if (!hashMatches || !chainMatches) {

                isValid = false;
                brokenAtTransactionId = entry.transactionId;
                break;

            }

            expectedPreviousHash = entry.hash;

        }

        return {

            entries: entries.map(
                entry => PointLedgerResponseMapper.toDto(entry)
            ),

            isValid,

            brokenAtTransactionId

        };

    }

}
