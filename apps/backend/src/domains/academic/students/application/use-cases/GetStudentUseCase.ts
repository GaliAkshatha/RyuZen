import { IStudentRepository } from "../../infrastructure/repositories/IStudentRepository.js";

import { IUserRepository } from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { StudentResponseMapper } from "../../infrastructure/mappers/StudentResponseMapper.js";

import { StudentResponseDto } from "../dto/StudentResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real gap found while auditing account-management flows: this DTO
 * only ever carried the STUDENT record's own status (an enrollment
 * concern), never the linked User account's real login-access status
 * or permissions - the two things Suspend/Unlock/Grant-Permission
 * actually operate on. Same fix applied symmetrically to
 * GetFacultyUseCase.
 */
export class GetStudentUseCase {

    constructor(

        private readonly repository: IStudentRepository,

        private readonly userRepository: IUserRepository

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

        const dto =

            StudentResponseMapper.toDto(

                student

            );

        const user =

            await this.userRepository.findById(
                student.userId
            );

        if (user) {

            dto.userStatus = user.status;
            dto.permissions = [...user.permissions];

        }

        return dto;

    }

}
