import { ICodingProfileRepository } from "../../infrastructure/repositories/ICodingProfileRepository.js";

import { CodingProfileResponseMapper } from "../../infrastructure/mappers/CodingProfileResponseMapper.js";
import { CodingProfileResponseDto } from "../dto/CodingProfileResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMyCodingProfilesUseCase {

    constructor(

        private readonly repository: ICodingProfileRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        requestingUserId: string

    ): Promise<CodingProfileResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                requestingUserId
            );

        if (!student) {

            throw new ApiError(

                "No student profile found for this account.",

                HttpStatus.FORBIDDEN

            );

        }

        const profiles =

            await this.repository.findByStudent(
                student.id!
            );

        return profiles.map(

            profile => CodingProfileResponseMapper.toDto(profile)

        );

    }

}
