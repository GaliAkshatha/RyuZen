import { StudentBadge } from "../../domain/entities/StudentBadge.js";

import {
    StudentBadgeDocument
} from "../persistence/StudentBadgeModel.js";

export class StudentBadgeMapper {

    static toDomain(

        document: StudentBadgeDocument

    ): StudentBadge {

        return StudentBadge.create({

            id:
                document.id,

            studentId:
                document.studentId.toString(),

            badgeId:
                document.badgeId.toString(),

            awardedBy:
                document.awardedBy.toString(),

            awardedAt:
                document.awardedAt

        });

    }

    static toPersistence(

        studentBadge: StudentBadge

    ) {

        const data =
            studentBadge.toObject();

        return {

            studentId:
                data.studentId,

            badgeId:
                data.badgeId,

            awardedBy:
                data.awardedBy,

            awardedAt:
                data.awardedAt

        };

    }

}
