import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { EventRegistrationResponseMapper } from "../../infrastructure/mappers/EventRegistrationResponseMapper.js";

import { EventRegistrationResponseDto } from "../dto/EventRegistrationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

/**
 * A genuinely separate certificate mechanism from campus/certificates'
 * Certificate entity — this tracks issuance as a boolean flag on the
 * EventRegistration itself, confirmed by reading both domains before
 * touching either. Pre-existing architecture, not something introduced
 * here; left as-is rather than unifying the two, which would be a real
 * redesign beyond notification wiring.
 */
export class IssueCertificatesUseCase {

    constructor(

        private readonly repository: IEventRepository,

        private readonly registrationRepository: IEventRegistrationRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        eventId: string,

        organizationId: string,

        issuedBy: string

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

                const student =

                    await this.studentRepository.findById(
                        registration.studentId
                    );

                if (student) {

                    await this.recordSystemNotification.execute({

                        organizationId,

                        recipientUserId:
                            student.userId,

                        senderId:
                            issuedBy,

                        title:
                            "New certificate issued",

                        message:
                            `A certificate for "${event.title}" has been issued to your profile.`

                    });

                }

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
