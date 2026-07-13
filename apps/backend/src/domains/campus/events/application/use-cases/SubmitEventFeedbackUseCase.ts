import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { EventRegistrationResponseMapper } from "../../infrastructure/mappers/EventRegistrationResponseMapper.js";

import { SubmitEventFeedbackDto } from "../dto/SubmitEventFeedbackDto.js";
import { EventRegistrationResponseDto } from "../dto/EventRegistrationResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class SubmitEventFeedbackUseCase {

    constructor(

        private readonly registrationRepository: IEventRegistrationRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        eventId: string,

        userId: string,

        dto: SubmitEventFeedbackDto

    ): Promise<EventRegistrationResponseDto> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "Only students can submit event feedback.",

                HttpStatus.FORBIDDEN

            );

        }

        const registration =

            await this.registrationRepository.findByEventAndStudent(

                eventId,

                student.id!

            );

        if (!registration) {

            throw new ApiError(

                "You are not registered for this event.",

                HttpStatus.NOT_FOUND

            );

        }

        registration.submitFeedback(

            dto.feedback

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
