import { IInterviewRoundRepository } from "../../infrastructure/repositories/IInterviewRoundRepository.js";

import { InterviewRoundResponseMapper } from "../../infrastructure/mappers/InterviewRoundResponseMapper.js";

import { RecordInterviewEvaluationDto } from "../dto/RecordInterviewEvaluationDto.js";
import { InterviewRoundResponseDto } from "../dto/InterviewRoundResponseDto.js";

import {
    IJobApplicationRepository,
} from "../../../applications/infrastructure/repositories/IJobApplicationRepository.js";

import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";
import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Every round should support ... structured evaluation, feedback,
 * analytics." Passing a real round is a genuine, externally-verified
 * milestone - it emits a real growth event, distinct per round type
 * (PASSING technical round 2 is real evidence, distinct from passing
 * the HR round). Failing a round never emits one - only real positive
 * progress counts, same discipline as everywhere else this pattern is
 * wired in.
 */
export class RecordInterviewEvaluationUseCase {

    constructor(

        private readonly repository: IInterviewRoundRepository,

        private readonly applicationRepository: IJobApplicationRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        roundId: string,

        organizationId: string,

        dto: RecordInterviewEvaluationDto,

        evaluatedBy: string

    ): Promise<InterviewRoundResponseDto> {

        const round =

            await this.repository.findById(
                roundId
            );

        if (

            !round ||
            round.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Interview round not found.",

                HttpStatus.NOT_FOUND

            );

        }

        round.recordEvaluation(

            dto.passed,

            {
                rating: dto.rating,
                strengths: dto.strengths,
                weaknesses: dto.weaknesses,
                notes: dto.notes
            }

        );

        const updated =

            await this.repository.save(
                round
            );

        const application =

            await this.applicationRepository.findById(
                round.applicationId
            );

        if (!application) {

            return InterviewRoundResponseMapper.toDto(
                updated
            );

        }

        const student =

            await this.studentRepository.findById(
                application.studentId
            );

        if (student) {

            if (dto.passed) {

                await this.recordGrowthEvent.execute({

                    organizationId,

                    studentId: student.id!,

                    domain: "placements",

                    eventType: `INTERVIEW_ROUND_PASSED_${updated.roundType}`,

                    evidence: { entityType: "InterviewRound", entityId: updated.id! },

                    verifiedBy: evaluatedBy

                }).catch(() => {
                    // Growth Profile recording must never break a real, already-recorded evaluation.
                });

            }

            await this.recordSystemNotification.execute({

                organizationId,

                recipientUserId:
                    student.userId,

                senderId:
                    evaluatedBy,

                title:
                    `Interview round ${dto.passed ? "passed" : "result"}: ${updated.roundType.replace(/_/g, " ")}`,

                message:
                    dto.passed
                        ? "You've moved forward to the next stage."
                        : "Your interview process for this drive has concluded."

            }).catch(() => {
                // A notification failure must never break a real, already-recorded evaluation.
            });

        }

        return InterviewRoundResponseMapper.toDto(

            updated

        );

    }

}
