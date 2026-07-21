import { Department } from "../../domain/entities/Department.js";

import { IDepartmentRepository } from "../../infrastructure/repositories/IDepartmentRepository.js";

import { DepartmentResponseMapper } from "../../infrastructure/mappers/DepartmentResponseMapper.js";

import { CreateDepartmentDto } from "../dto/CreateDepartmentDto.js";
import { DepartmentResponseDto } from "../dto/DepartmentResponseDto.js";

import { AuthenticatedUser } from "../../../../../shared/types/AuthenticatedUser.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateDepartmentUseCase {

    constructor(

        private readonly repository: IDepartmentRepository

    ) {}

    async execute(

        dto: CreateDepartmentDto,

        user: AuthenticatedUser

    ): Promise<DepartmentResponseDto> {

        const exists =

            await this.repository.existsByCode(

                user.organizationId,

                dto.code

            );

        if (exists) {

            throw new ApiError(

                "A department with this code already exists.",

                HttpStatus.CONFLICT

            );

        }

        const department = Department.create({

            organizationId:
                user.organizationId,

            name:
                dto.name,

            code:
                dto.code,

            description:
                dto.description

        });

        const created =

            await this.repository.create(

                department

            );

        return DepartmentResponseMapper.toDto(

            created

        );

    }

}
