import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { EventRegistrationResponseMapper } from "../../infrastructure/mappers/EventRegistrationResponseMapper.js";

import { EventRegistrationResponseDto } from "../dto/EventRegistrationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetEventRegistrationsUseCase {

    constructor(

        private readonly repository: IEventRepository,

        private readonly registrationRepository: IEventRegistrationRepository

    ) {}

    async execute(

        eventId: string,

        organizationId: string

    ): Promise<EventRegistrationResponseDto[]> {

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

        const registrations =

            await this.registrationRepository.findByEvent(
                eventId
            );

        return registrations.map(

            registration =>

                EventRegistrationResponseMapper.toDto(
                    registration
                )

        );

    }

}
