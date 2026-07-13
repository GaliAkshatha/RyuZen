import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { EventRegistrationResponseMapper } from "../../infrastructure/mappers/EventRegistrationResponseMapper.js";

import { MarkAttendanceDto } from "../dto/MarkAttendanceDto.js";
import { EventRegistrationResponseDto } from "../dto/EventRegistrationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class MarkAttendanceUseCase {

    constructor(

        private readonly repository: IEventRepository,

        private readonly registrationRepository: IEventRegistrationRepository

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

        registration.markAttendance(

            dto.attended

        );

        const updated =

            await this.registrationRepository.save(

                registration

            );

        return EventRegistrationResponseMapper.toDto(

            updated

        );

    }

}
