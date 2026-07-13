import { Department } from "../../domain/entities/Department.js";

import { DepartmentResponseDto } from "../../application/dto/DepartmentResponseDto.js";

export class DepartmentResponseMapper {

    static toDto(

        department: Department

    ): DepartmentResponseDto {

        return {

            id:
                department.id!,

            organizationId:
                department.organizationId,

            name:
                department.name,

            code:
                department.code,

            description:
                department.description,

            headOfDepartmentId:
                department.headOfDepartmentId,

            createdAt:
                department.createdAt,

            updatedAt:
                department.updatedAt

        };

    }

}