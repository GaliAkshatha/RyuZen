import { IJobApplicationRepository } from "../../infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationResponseMapper } from "../../infrastructure/mappers/JobApplicationResponseMapper.js";

import { JobApplicationResponseDto } from "../dto/JobApplicationResponseDto.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetJobApplicationUseCase {

    constructor(

        private readonly repository: IJobApplicationRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        userId: string,

        viewerIsAdmin: boolean

    ): Promise<JobApplicationResponseDto> {

        const application =

            await this.repository.findById(
                id
            );

        if (!application) {

            throw new ApiError(

                "Job application not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const drive =

            await this.placementDriveRepository.findById(
                application.placementId
            );

        if (

            !drive ||
            drive.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Job application not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (!viewerIsAdmin) {

            const student =

                await this.studentRepository.findByUserId(
                    userId
                );

            if (

                !student ||
                student.id !== application.studentId

            ) {

                throw new ApiError(

                    "You do not have access to this job application.",

                    HttpStatus.FORBIDDEN

                );

            }

        }

        return JobApplicationResponseMapper.toDto(

            application

        );

    }

}
