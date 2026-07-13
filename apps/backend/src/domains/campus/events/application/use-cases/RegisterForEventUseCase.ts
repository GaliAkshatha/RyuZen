import { EventRegistration } from "../../domain/entities/EventRegistration.js";

import { EventStatus } from "../../domain/constants/EventStatus.js";

import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { EventRegistrationResponseMapper } from "../../infrastructure/mappers/EventRegistrationResponseMapper.js";

import { EventRegistrationResponseDto } from "../dto/EventRegistrationResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class RegisterForEventUseCase {

    constructor(

        private readonly repository: IEventRepository,

        private readonly registrationRepository: IEventRegistrationRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        eventId: string,

        organizationId: string,

        userId: string

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

        if (event.status !== EventStatus.PUBLISHED) {

            throw new ApiError(

                "Only published events accept registrations.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (

            event.registrationDeadline &&
            event.registrationDeadline.getTime() < Date.now()

        ) {

            throw new ApiError(

                "The registration deadline for this event has passed.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Only students can register for events.",

                HttpStatus.FORBIDDEN

            );

        }

        const alreadyRegistered =

            await this.registrationRepository.findByEventAndStudent(

                eventId,

                student.id!

            );

        if (alreadyRegistered) {

            throw new ApiError(

                "You are already registered for this event.",

                HttpStatus.CONFLICT

            );

        }

        if (event.capacity !== undefined) {

            const registeredCount =

                await this.registrationRepository.countByEvent(
                    eventId
                );

            if (registeredCount >= event.capacity) {

                throw new ApiError(

                    "This event has reached its registration capacity.",

                    HttpStatus.BAD_REQUEST

                );

            }

        }

        const registration = EventRegistration.create({

            eventId,

            studentId:
                student.id!,

            attendance:
                false,

            certificateIssued:
                false,

            registeredAt:
                new Date()

        });

        const created =

            await this.registrationRepository.create(

                registration

            );

        return EventRegistrationResponseMapper.toDto(

            created

        );

    }

}
