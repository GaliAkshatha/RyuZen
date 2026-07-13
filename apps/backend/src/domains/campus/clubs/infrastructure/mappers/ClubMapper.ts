import { Club } from "../../domain/entities/Club.js";

import { ClubStatus } from "../../domain/constants/ClubStatus.js";

import {
    ClubDocument
} from "../persistence/ClubModel.js";

export class ClubMapper {

    static toDomain(

        document: ClubDocument

    ): Club {

        return Club.create({

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

            logo:
                document.logo,

            facultyAdvisorId:
                document.facultyAdvisorId?.toString(),

            presidentStudentId:
                document.presidentStudentId?.toString(),

            vicePresidentStudentId:
                document.vicePresidentStudentId?.toString(),

            status:
                document.status as ClubStatus,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        club: Club

    ) {

        const data =
            club.toObject();

        return {

            organizationId:
                data.organizationId,

            name:
                data.name,

            code:
                data.code,

            description:
                data.description,

            logo:
                data.logo,

            facultyAdvisorId:
                data.facultyAdvisorId,

            presidentStudentId:
                data.presidentStudentId,

            vicePresidentStudentId:
                data.vicePresidentStudentId,

            status:
                data.status

        };

    }

}
