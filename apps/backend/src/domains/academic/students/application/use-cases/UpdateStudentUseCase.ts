import { IStudentRepository } from "../../infrastructure/repositories/IStudentRepository.js";

import { StudentResponseMapper } from "../../infrastructure/mappers/StudentResponseMapper.js";

import { UpdateStudentDto } from "../dto/UpdateStudentDto.js";
import { StudentResponseDto } from "../dto/StudentResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateStudentUseCase {

    constructor(

        private readonly repository: IStudentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: UpdateStudentDto

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

        if (

            dto.usn !== undefined &&
            dto.usn !== student.usn

        ) {

            const usnTaken =

                await this.repository.existsByUsn(

                    organizationId,

                    dto.usn

                );

            if (usnTaken) {

                throw new ApiError(

                    "A student with this USN already exists.",

                    HttpStatus.CONFLICT

                );

            }

        }

        student.updateDetails(dto);

        const updated =

            await this.repository.save(
                student
            );

        return StudentResponseMapper.toDto(

            updated

        );

    }

}
