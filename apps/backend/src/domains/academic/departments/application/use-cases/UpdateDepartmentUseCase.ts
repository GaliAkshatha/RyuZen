import { IDepartmentRepository } from "../../infrastructure/repositories/IDepartmentRepository.js";

import { DepartmentResponseMapper } from "../../infrastructure/mappers/DepartmentResponseMapper.js";

import { UpdateDepartmentDto } from "../dto/UpdateDepartmentDto.js";
import { DepartmentResponseDto } from "../dto/DepartmentResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateDepartmentUseCase {

    constructor(

        private readonly repository: IDepartmentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: UpdateDepartmentDto

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

        department.updateDetails(dto);

        const updated =

            await this.repository.save(
                department
            );

        return DepartmentResponseMapper.toDto(

            updated

        );

    }

}