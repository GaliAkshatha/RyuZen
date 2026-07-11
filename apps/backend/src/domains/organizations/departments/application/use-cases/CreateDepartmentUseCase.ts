import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { Department } from "../../domain/entities/Department.js";
import { DepartmentStatus } from "../../domain/constants/DepartmentStatus.js";

import { CreateDepartmentDto } from "../dto/CreateDepartmentDto.js";
import { DepartmentResponseDto } from "../dto/DepartmentResponseDto.js";

import {
    IDepartmentRepository
} from "../../infrastructure/repositories/IDepartmentRepository.js";

export class CreateDepartmentUseCase {

    constructor(
        private readonly repository: IDepartmentRepository
    ) {}

    async execute(
        dto: CreateDepartmentDto
    ): Promise<DepartmentResponseDto> {

        const exists =
            await this.repository.existsByCode(
                dto.organizationId,
                dto.code.trim().toUpperCase()
            );

        if (exists) {

            throw new ApiError(
                "Department code already exists.",
                HttpStatus.CONFLICT
            );

        }

        const department = new Department({

            organizationId: dto.organizationId,

            name: dto.name,

            code: dto.code,

            description: dto.description,

            status: DepartmentStatus.ACTIVE

        });

        const created =
            await this.repository.create(
                department
            );

        return {

            id: created.id!,

            organizationId: created.organizationId,

            name: created.name,

            code: created.code,

            description: created.description,

            headId: created.headFacultyId,

            status: created.status

        };

    }

}