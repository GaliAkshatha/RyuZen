import { JobApplication } from "../../domain/entities/JobApplication.js";

import { JobApplicationStatus } from "../../domain/constants/JobApplicationStatus.js";

import { IJobApplicationRepository } from "../../infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationResponseMapper } from "../../infrastructure/mappers/JobApplicationResponseMapper.js";

import { ApplyToPlacementDto } from "../dto/ApplyToPlacementDto.js";
import { JobApplicationResponseDto } from "../dto/JobApplicationResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import { PlacementDriveStatus } from "../../../drives/domain/constants/PlacementDriveStatus.js";

import {
    IResumeRepository,
} from "../../../../career/resume/infrastructure/repositories/IResumeRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class ApplyToPlacementUseCase {

    constructor(

        private readonly repository: IJobApplicationRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly resumeRepository: IResumeRepository

    ) {}

    async execute(

        placementId: string,

        userId: string,

        dto: ApplyToPlacementDto

    ): Promise<JobApplicationResponseDto> {

        const drive =

            await this.placementDriveRepository.findById(
                placementId
            );

        if (!drive) {

            throw new ApiError(

                "Placement drive not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (drive.status !== PlacementDriveStatus.PUBLISHED) {

            throw new ApiError(

                "This placement drive is not open for applications.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (

            drive.deadline &&
            drive.deadline.getTime() < Date.now()

        ) {

            throw new ApiError(

                "The application deadline for this placement drive has passed.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "Only students can apply to placement drives.",

                HttpStatus.FORBIDDEN

            );

        }

        const alreadyApplied =

            await this.repository.existsByPlacementAndStudent(

                placementId,

                student.id!

            );

        if (alreadyApplied) {

            throw new ApiError(

                "You have already applied to this placement drive.",

                HttpStatus.CONFLICT

            );

        }

        let resume =

            dto.resume;

        if (!resume) {

            const existingResume =

                await this.resumeRepository.findByUserId(
                    userId
                );

            resume =

                existingResume?.resumeUrl;

        }

        const application = JobApplication.create({

            placementId,

            studentId:
                student.id!,

            resume,

            status:
                JobApplicationStatus.APPLIED,

            appliedAt:
                new Date()

        });

        const created =

            await this.repository.create(

                application

            );

        return JobApplicationResponseMapper.toDto(

            created

        );

    }

}
