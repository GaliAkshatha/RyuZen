import { IDepartmentRepository } from "../../infrastructure/repositories/IDepartmentRepository.js";

import { DepartmentResponseMapper } from "../../infrastructure/mappers/DepartmentResponseMapper.js";

import { AssignHeadOfDepartmentDto } from "../dto/AssignHeadOfDepartmentDto.js";
import { DepartmentResponseDto } from "../dto/DepartmentResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AssignHeadOfDepartmentUseCase {

    constructor(

        private readonly repository: IDepartmentRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: AssignHeadOfDepartmentDto

    ): Promise<DepartmentResponseDto> {

        const department =

            await this.repository.findById(
                id
            );

        if (

            !department ||
            department.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Department not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const user =

            await this.userRepository.findById(
                dto.userId
            );

        if (

            !user ||
            user.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Faculty user not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (user.role !== UserRole.FACULTY) {

            throw new ApiError(

                "Head of Department must be a faculty member.",

                HttpStatus.BAD_REQUEST

            );

        }

        department.assignHeadOfDepartment(

            dto.userId

        );

        const updated =

            await this.repository.save(
                department
            );

        return DepartmentResponseMapper.toDto(

            updated

        );

    }

}
