import { Mentorship } from "../../domain/entities/Mentorship.js";

import { MentorshipStatus } from "../../domain/constants/MentorshipStatus.js";

import {
    MentorshipDocument
} from "../persistence/MentorshipModel.js";

export class MentorshipMapper {

    static toDomain(

        document: MentorshipDocument

    ): Mentorship {

        return Mentorship.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            facultyId:
                document.facultyId.toString(),

            studentId:
                document.studentId.toString(),

            assignedBy:
                document.assignedBy.toString(),

            assignedDate:
                document.assignedDate,

            status:
                document.status as MentorshipStatus,

            remarks:
                document.remarks,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        mentorship: Mentorship

    ) {

        const data =
            mentorship.toObject();

        return {

            organizationId:
                data.organizationId,

            facultyId:
                data.facultyId,

            studentId:
                data.studentId,

            assignedBy:
                data.assignedBy,

            assignedDate:
                data.assignedDate,

            status:
                data.status,

            remarks:
                data.remarks

        };

    }

}
