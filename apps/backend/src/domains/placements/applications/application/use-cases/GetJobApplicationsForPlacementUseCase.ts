import { IJobApplicationRepository } from "../../infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationResponseMapper } from "../../infrastructure/mappers/JobApplicationResponseMapper.js";

import { JobApplicationResponseDto } from "../dto/JobApplicationResponseDto.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real gap found while auditing Placement Admin: reviewers here (Org
 * Admin and Placement Admin, via JobApplicationReviewSection embedded
 * in the drive detail page) previously saw only a raw studentId with
 * no way to tell who they were actually reviewing. Placement Admin in
 * particular cannot resolve this client-side at all - GET
 * /students/:id is confirmed Org Admin/Super Admin only. Same
 * enrichment pattern already proven for Leaderboard and Mentorship,
 * applied here.
 */
export class GetJobApplicationsForPlacementUseCase {

    constructor(

        private readonly repository: IJobApplicationRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly userRepository: IUserRepository

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

        const dtos: JobApplicationResponseDto[] = [];

        for (const application of applications) {

            const dto =

                JobApplicationResponseMapper.toDto(
                    application
                );

            const student =

                await this.studentRepository.findById(
                    dto.studentId
                );

            if (student) {

                dto.studentUsn = student.usn;

                dto.studentUserId = student.userId;

                const user =

                    await this.userRepository.findById(
                        student.userId
                    );

                if (user) {

                    dto.studentName = user.name;

                }

            }

            dtos.push(dto);

        }

        return dtos;

    }

}
