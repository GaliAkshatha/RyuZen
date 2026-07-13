import { IStudentRepository } from "../../infrastructure/repositories/IStudentRepository.js";

import { StudentResponseMapper } from "../../infrastructure/mappers/StudentResponseMapper.js";

import { StudentResponseDto } from "../dto/StudentResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class ArchiveStudentUseCase {

    constructor(

        private readonly repository: IStudentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<StudentResponseDto> {

        const student =

            await this.repository.findById(
                id
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

        student.archive();

        const updated =

            await this.repository.save(
                student
            );

        return StudentResponseMapper.toDto(

            updated

        );

    }

}
