import { GrowthEvent } from "./GrowthEvent.js";

import { IGrowthEventRepository } from "./IGrowthEventRepository.js";

/**
 * The single real write path for the Growth Profile - mirrors
 * RecordPointTransactionUseCase and RecordSystemNotificationUseCase
 * exactly, the same proven pattern used twice already in this
 * codebase for cross-cutting infrastructure a domain calls into
 * rather than owns. Injected into real domain use cases at their real
 * verification moments (ReviewSubmissionUseCase, VerifyAchievementUseCase,
 * IssueCertificateUseCase, and future Assessment/Attendance/Interview/
 * Mentorship domains as they're built) - never called directly by a
 * controller, and never exposed as its own public endpoint. A client
 * cannot assert that a growth event happened; only a real, already-
 * verified domain action can cause one.
 */
export class RecordGrowthEventUseCase {

    constructor(

        private readonly repository: IGrowthEventRepository

    ) {}

    async execute(

        params: {
            organizationId: string;
            studentId: string;
            domain: string;
            eventType: string;
            evidence: { entityType: string; entityId: string };
            verifiedBy: string;
            contributionWeight?: number;
        }

    ): Promise<void> {

        const event = GrowthEvent.record({

            organizationId:
                params.organizationId,

            studentId:
                params.studentId,

            domain:
                params.domain,

            eventType:
                params.eventType,

            evidence:
                params.evidence,

            verifiedBy:
                params.verifiedBy,

            contributionWeight:
                params.contributionWeight ?? 0

        });

        await this.repository.create(
            event
        );

    }

}
