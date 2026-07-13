import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";

import { FacultyResponseMapper } from "../../infrastructure/mappers/FacultyResponseMapper.js";

import { AssignFacultyDepartmentDto } from "../dto/AssignFacultyDepartmentDto.js";
import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

import {
    IDepartmentRepository,
} from "../../../departments/infrastructure/repositories/IDepartmentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AssignFacultyDepartmentUseCase {

    constructor(

        private readonly repository: IFacultyRepository,

        private readonly departmentRepository: IDepartmentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: AssignFacultyDepartmentDto

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

        const department =

            await this.departmentRepository.findById(
                dto.departmentId
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

        faculty.assignDepartment(

            dto.departmentId

        );

        const updated =

            await this.repository.save(
                faculty
            );

        return FacultyResponseMapper.toDto(

            updated

        );

    }

}