import { IJobApplicationRepository } from "../../infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationResponseMapper } from "../../infrastructure/mappers/JobApplicationResponseMapper.js";

import { JobApplicationResponseDto } from "../dto/JobApplicationResponseDto.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetJobApplicationsForPlacementUseCase {

    constructor(

        private readonly repository: IJobApplicationRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository

    ) {}

    async execute(

        placementId: string,

        organizationId: string

    ): Promise<JobApplicationResponseDto[]> {

        const drive =

            await this.placementDriveRepository.findById(
                placementId
            );

        if (

            !drive ||
            drive.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Placement drive not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const applications =

            await this.repository.findByPlacement(
                placementId
            );

        return applications.map(

            application =>

                JobApplicationResponseMapper.toDto(
                    application
                )

        );

    }

}
