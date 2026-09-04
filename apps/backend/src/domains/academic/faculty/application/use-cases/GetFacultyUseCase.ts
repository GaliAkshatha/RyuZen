import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";

import { IUserRepository } from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { FacultyResponseMapper } from "../../infrastructure/mappers/FacultyResponseMapper.js";

import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real gap found while auditing account-management flows: this DTO
 * only ever carried the FACULTY record's own status (an employment
 * concern), never the linked User account's real login-access status
 * or permissions - the two things Suspend/Unlock/Grant-Permission
 * actually operate on. A Faculty detail page had no way to show
 * whether the account was even suspended before this.
 */
export class GetFacultyUseCase {

    constructor(

        private readonly repository: IFacultyRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<FacultyResponseDto> {

        const faculty =

            await this.repository.findById(
                id
            );

        if (

            !faculty ||
            faculty.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Faculty not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const dto =

            FacultyResponseMapper.toDto(

                faculty

            );

        const user =

            await this.userRepository.findById(
                faculty.userId
            );

        if (user) {

            dto.userStatus = user.status;
            dto.permissions = [...user.permissions];

        }

        return dto;

    }

}
