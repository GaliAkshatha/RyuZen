import { IJobApplicationRepository } from "../../infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationResponseMapper } from "../../infrastructure/mappers/JobApplicationResponseMapper.js";

import { UpdateJobApplicationStatusDto } from "../dto/UpdateJobApplicationStatusDto.js";
import { JobApplicationResponseDto } from "../dto/JobApplicationResponseDto.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateJobApplicationStatusUseCase {

    constructor(

        private readonly repository: IJobApplicationRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: UpdateJobApplicationStatusDto

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

        application.updateStatus(

            dto.status,

            dto.remarks

        );

        const updated =

            await this.repository.save(
                application
            );

        return JobApplicationResponseMapper.toDto(

            updated

        );

    }

}
