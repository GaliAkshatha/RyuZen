import { IJobApplicationRepository } from "../../infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationResponseMapper } from "../../infrastructure/mappers/JobApplicationResponseMapper.js";

import { JobApplicationResponseDto } from "../dto/JobApplicationResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMyJobApplicationsUseCase {

    constructor(

        private readonly repository: IJobApplicationRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        userId: string

    ): Promise<JobApplicationResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "No student profile is linked to your account yet. Contact your administrator.",

                HttpStatus.FORBIDDEN

            );

        }

        const applications =

            await this.repository.findByStudent(
                student.id!
            );

        return applications.map(

            application =>

                JobApplicationResponseMapper.toDto(
                    application
                )

        );

    }

}
