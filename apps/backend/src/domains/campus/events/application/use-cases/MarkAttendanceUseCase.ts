import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { EventRegistrationResponseMapper } from "../../infrastructure/mappers/EventRegistrationResponseMapper.js";

import { MarkAttendanceDto } from "../dto/MarkAttendanceDto.js";
import { EventRegistrationResponseDto } from "../dto/EventRegistrationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { RecordPointTransactionUseCase } from "../../../point-ledger/application/use-cases/RecordPointTransactionUseCase.js";

/**
 * The real point-transaction moment for event points, mirroring
 * ReviewSubmissionUseCase's reasoning for activity points —
 * RecalculateLeaderboardUseCase only re-aggregates from decisions like
 * this one, it never originates a transaction itself.
 *
 * `activityId` is deliberately left undefined on the ledger entry —
 * this is an Event, a genuinely different domain from Activity in this
 * codebase, and forcing an event's id into a field named for
 * activities would misrepresent what happened. The `reason` string
 * carries the real context instead.
 *
 * Only records a transaction when attendance transitions from
 * not-attended to attended — re-marking an already-attended
 * registration, or un-marking one, does not create a duplicate or
 * phantom award.
 */
export class MarkAttendanceUseCase {

    constructor(

        private readonly repository: IEventRepository,

        private readonly registrationRepository: IEventRegistrationRepository,

        private readonly recordPointTransaction: RecordPointTransactionUseCase

    ) {}

    async execute(

        eventId: string,

        organizationId: string,

        dto: MarkAttendanceDto

    ): Promise<EventRegistrationResponseDto> {

        const event =

            await this.repository.findById(
                eventId
            );

        if (

            !event ||
            event.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Event not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const registration =

            await this.registrationRepository.findByEventAndStudent(

                eventId,

                dto.studentId

            );

        if (!registration) {

            throw new ApiError(

                "This student is not registered for the event.",

                HttpStatus.NOT_FOUND

            );

        }

        const wasAlreadyAttended = registration.attendance;

        registration.markAttendance(

            dto.attended

        );

        const updated =

            await this.registrationRepository.save(

                registration

            );

        if (

            dto.attended &&
            !wasAlreadyAttended &&
            event.points > 0

        ) {

            await this.recordPointTransaction.execute({

                organizationId,

                studentId:
                    dto.studentId,

                points:
                    event.points,

                reason:
                    `Event attendance confirmed: "${event.title}" (${event.points} pts)`

            });

        }

        return EventRegistrationResponseMapper.toDto(

            updated

        );

    }

}
