import { Faculty } from "../../domain/entities/Faculty.js";

import { FacultyDocument } from "../persistence/FacultyModel.js";

export class FacultyMapper {

    static toDomain(

        document: FacultyDocument

    ): Faculty {

        return new Faculty({

            id: document.id,

            userId: document.userId.toString(),

            organizationId: document.organizationId.toString(),

            departmentId: document.departmentId.toString(),

            employeeId: document.employeeId,

            designation: document.designation,

            joiningDate: document.joiningDate,

            status: document.status,

            createdAt: document.createdAt,

            updatedAt: document.updatedAt

        });

    }

}