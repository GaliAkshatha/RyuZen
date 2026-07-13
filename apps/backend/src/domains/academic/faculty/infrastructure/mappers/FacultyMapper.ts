import { Faculty } from "../../domain/entities/Faculty.js";

import { FacultyStatus } from "../../domain/constants/FacultyStatus.js";

import {
    FacultyDocument
} from "../persistence/FacultyModel.js";

export class FacultyMapper {

    static toDomain(

        document: FacultyDocument

    ): Faculty {

        return Faculty.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            userId:
                document.userId.toString(),

            departmentId:
                document.departmentId?.toString(),

            employeeId:
                document.employeeId,

            designation:
                document.designation,

            specialization:
                document.specialization,

            status:
                document.status as FacultyStatus,

            joinedAt:
                document.joinedAt,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        faculty: Faculty

    ) {

        const data =
            faculty.toObject();

        return {

            organizationId:
                data.organizationId,

            userId:
                data.userId,

            departmentId:
                data.departmentId,

            employeeId:
                data.employeeId,

            designation:
                data.designation,

            specialization:
                data.specialization,

            status:
                data.status,

            joinedAt:
                data.joinedAt

        };

    }

}