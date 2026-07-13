import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { EventRegistrationResponseMapper } from "../../infrastructure/mappers/EventRegistrationResponseMapper.js";

import { EventRegistrationResponseDto } from "../dto/EventRegistrationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class IssueCertificatesUseCase {

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

        if (!event.certificateEnabled) {

            throw new ApiError(

                "Certificates are not enabled for this event.",

                HttpStatus.BAD_REQUEST

            );

        }

        const registrations =

            await this.registrationRepository.findByEvent(
                eventId
            );

        const issued = [];

        for (const registration of registrations) {

            if (

                registration.attendance &&
                !registration.certificateIssued

            ) {

                registration.issueCertificate();

                const updated =

                    await this.registrationRepository.save(
                        registration
                    );

                issued.push(updated);

            } else if (registration.certificateIssued) {

                issued.push(registration);

            }

        }

        return issued.map(

            registration =>

                EventRegistrationResponseMapper.toDto(
                    registration
                )

        );

    }

}
