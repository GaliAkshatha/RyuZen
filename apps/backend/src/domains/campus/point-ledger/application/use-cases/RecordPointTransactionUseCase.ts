import { PointLedgerEntry } from "../../domain/entities/PointLedgerEntry.js";

import { IPointLedgerRepository } from "../../infrastructure/repositories/IPointLedgerRepository.js";

/**
 * The single real write path for the ledger - called internally by
 * ReviewSubmissionUseCase, MarkAttendanceUseCase, and
 * AdjustLeaderboardPointsUseCase at the moment each of those performs
 * a genuine point transaction. Deliberately NOT exposed as its own
 * public endpoint a client could call with arbitrary points/reason -
 * the ledger only ever records what a real business action actually
 * did, never a value a client asserts directly.
 *
 * A transaction with `points: 0` is skipped (nothing changed, nothing
 * to record) - e.g. a submission approved with 0 points awarded.
 */
export class RecordPointTransactionUseCase {

    constructor(

        private readonly repository: IPointLedgerRepository

    ) {}

    async execute(

        params: {
            organizationId: string;
            studentId: string;
            activityId?: string;
            points: number;
            reason: string;
        }

    ): Promise<void> {

        if (params.points === 0) {

            return;

        }

        const latest =

            await this.repository.findLatestForOrganization(
                params.organizationId
            );

        const previousHash =
            latest?.hash ?? PointLedgerEntry.genesisHash;

        const entry = PointLedgerEntry.record({

            organizationId:
                params.organizationId,

            studentId:
                params.studentId,

            activityId:
                params.activityId,

            points:
                params.points,

            reason:
                params.reason,

            previousHash

        });

        await this.repository.create(
            entry
        );

    }

}
