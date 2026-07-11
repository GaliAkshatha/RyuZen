import { Department } from "../../domain/entities/Department.js";

import { DepartmentDocument } from "../persistence/DepartmentModel.js";

export class DepartmentMapper {

    static toDomain(

        document: DepartmentDocument

    ): Department {

        return new Department({

            id: document.id,

            organizationId: document.organizationId.toString(),

            name: document.name,

            code: document.code,

            description: document.description,

            headFacultyId: document.headId?.toString(),

            status: document.status,

            createdAt: document.createdAt,

            updatedAt: document.updatedAt

        });

    }

}