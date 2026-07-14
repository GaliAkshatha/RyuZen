import { Certificate } from "../../domain/entities/Certificate.js";

import { ICertificateRepository } from "../../infrastructure/repositories/ICertificateRepository.js";

import { CertificateResponseMapper } from "../../infrastructure/mappers/CertificateResponseMapper.js";

import { IssueCertificateDto } from "../dto/IssueCertificateDto.js";
import { CertificateResponseDto } from "../dto/CertificateResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    IEventRepository,
} from "../../../events/infrastructure/repositories/IEventRepository.js";

import {
    IActivityRepository,
} from "../../../../academic/activities/infrastructure/repositories/IActivityRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class IssueCertificateUseCase {

    constructor(

        private readonly repository: ICertificateRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly eventRepository: IEventRepository,

        private readonly activityRepository: IActivityRepository

    ) {}

    async execute(

        organizationId: string,

        dto: IssueCertificateDto

    ): Promise<CertificateResponseDto> {

        if (

            !dto.eventId &&
            !dto.activityId

        ) {

            throw new ApiError(

                "Either an eventId or an activityId is required.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (

            dto.eventId &&
            dto.activityId

        ) {

            throw new ApiError(

                "A certificate cannot reference both an event and an activity.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await this.studentRepository.findById(
                dto.studentId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Student not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (dto.eventId) {

            const event =

                await this.eventRepository.findById(
                    dto.eventId
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

        }

        if (dto.activityId) {

            const activity =

                await this.activityRepository.findById(
                    dto.activityId
                );

            if (

                !activity ||
                activity.organizationId !== organizationId

            ) {

                throw new ApiError(

                    "Activity not found.",

                    HttpStatus.NOT_FOUND

                );

            }

        }

        const certificate = Certificate.create({

            studentId:
                dto.studentId,

            eventId:
                dto.eventId,

            activityId:
                dto.activityId,

            certificateUrl:
                dto.certificateUrl,

            issuedAt:
                new Date()

        });

        const created =

            await this.repository.create(

                certificate

            );

        return CertificateResponseMapper.toDto(

            created

        );

    }

}
