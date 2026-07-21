import { Department } from "../../domain/entities/Department.js";

import {
    DepartmentDocument
} from "../persistence/DepartmentModel.js";

export class DepartmentMapper {

    static toDomain(

        document: DepartmentDocument

    ): Department {

        return Department.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            name:
                document.name,

            code:
                document.code,

            description:
                document.description,

            headOfDepartmentId:
                document.headOfDepartmentId?.toString(),

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        department: Department

    ) {

        const data =
            department.toObject();

        return {

            organizationId:
                data.organizationId,

            name:
                data.name,

            code:
                data.code,

            description:
                data.description,

            headOfDepartmentId:
                data.headOfDepartmentId

        };

    }

}
