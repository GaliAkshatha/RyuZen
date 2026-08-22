import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ReviewSubmissionDto } from "../dto/ReviewSubmissionDto.js";
import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

import { SubmissionResponseMapper } from "../mappers/SubmissionResponseMapper.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import {
    IActivityRepository,
} from "../../../activities/infrastructure/repositories/IActivityRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { RecordPointTransactionUseCase } from "../../../../campus/point-ledger/application/use-cases/RecordPointTransactionUseCase.js";
import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";

/**
 * SECURITY FIX: previously had no organizationId parameter and no
 * role/ownership check at all - any authenticated user of any role,
 * in any organization, could approve or reject any submission,
 * including the real point-award side effect this triggers. Now
 * enforces exactly what SubmissionEligibilityService already proves
 * out on the submit side (organization match), plus a real ownership
 * check: only the Activity's own creator (a real Faculty member,
 * confirmed - activity.createdBy is the creating user's real id, the
 * same value reviewerId already carries) or a SUPER_ADMIN may review
 * it. Route-level authorizePermission(SUPER_ADMIN, FACULTY) narrows
 * the caller's role before this even runs; this use case narrows
 * further to genuine ownership.
 *
 * The real point-transaction moment for activity points — a ledger
 * entry is recorded here (not in RecalculateLeaderboardUseCase, which
 * only ever re-aggregates totals from records like this one, never
 * originates a transaction itself). Ledger recording happens after the
 * review is saved and never throws past that point — a ledger failure
 * must not roll back or block a real, already-persisted grading
 * decision; it's logged by RecordPointTransactionUseCase's own
 * dependencies instead (see PointLedgerRepository).
 *
 * A notification is recorded for BOTH approval and rejection — a
 * student cares about a rejected submission at least as much as an
 * approved one.
 */
export class ReviewSubmissionUseCase {

    constructor(

        private readonly repository: ISubmissionRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly activityRepository: IActivityRepository,

        private readonly recordPointTransaction: RecordPointTransactionUseCase,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase

    ) {}

    async execute(

        submissionId: string,

        organizationId: string,

        reviewerId: string,

        requesterRole: UserRole,

        dto: ReviewSubmissionDto

    ): Promise<SubmissionResponseDto> {

        const submission =

            await this.repository.findById(

                submissionId

            );

        if (

            !submission ||
            submission.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Submission not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const activity =

            await this.activityRepository.findById(
                submission.activityId
            );

        if (

            !activity ||
            activity.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Submission not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (

            requesterRole !== UserRole.SUPER_ADMIN &&
            activity.createdBy !== reviewerId

        ) {

            throw new ApiError(

                "Submission not found.",

                HttpStatus.NOT_FOUND

            );

        }

        submission.applyreview(

            reviewerId,

            dto.status === SubmissionStatus.APPROVED,

            dto.feedback,

            dto.pointsAwarded

        );

        const updated =

            await this.repository.save(

                submission

            );

        if (dto.status === SubmissionStatus.APPROVED) {

            const student =

                await this.studentRepository.findByUserId(
                    updated.submittedBy
                );

            if (student) {

                if (dto.pointsAwarded) {

                    await this.recordPointTransaction.execute({

                        organizationId:
                            updated.organizationId,

                        studentId:
                            student.id!,

                        activityId:
                            updated.activityId,

                        points:
                            dto.pointsAwarded,

                        reason:
                            `Activity submission approved (${dto.pointsAwarded} pts)`

                    });

                }

                await this.recordGrowthEvent.execute({

                    organizationId: updated.organizationId,

                    studentId: student.id!,

                    domain: "academic",

                    eventType: "SUBMISSION_APPROVED",

                    evidence: { entityType: "Submission", entityId: updated.id! },

                    verifiedBy: reviewerId,

                    contributionWeight: dto.pointsAwarded ?? 0

                }).catch(() => {
                    // Growth Profile recording must never break a real, already-persisted review decision.
                });

            }

        }

        const isApproved = dto.status === SubmissionStatus.APPROVED;

        await this.recordSystemNotification.execute({

            organizationId:
                updated.organizationId,

            recipientUserId:
                updated.submittedBy,

            senderId:
                reviewerId,

            title:
                isApproved ? "Submission approved" : "Submission needs changes",

            message:
                isApproved
                    ? `Your submission was approved${dto.pointsAwarded ? ` — you earned ${dto.pointsAwarded} points.` : "."}`
                    : `Your submission was reviewed and needs changes.${dto.feedback ? ` Feedback: ${dto.feedback}` : ""}`

        });

        return SubmissionResponseMapper.toDto(

            updated

        );

    }

}