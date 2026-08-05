import { Recruiter } from "../../domain/entities/Recruiter.js";
import { RecruiterStatus } from "../../domain/constants/RecruiterStatus.js";

import { RecruiterDocument } from "../persistence/RecruiterModel.js";

export class RecruiterMapper {

    static toDomain(

        document: RecruiterDocument

    ): Recruiter {

        return Recruiter.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            userId:
                document.userId.toString(),

            companyId:
                document.companyId.toString(),

            jobTitle:
                document.jobTitle,

            status:
                document.status as RecruiterStatus,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        recruiter: Recruiter

    ) {

        const data =
            recruiter.toObject();

        return {

            organizationId:
                data.organizationId,

            userId:
                data.userId,

            companyId:
                data.companyId,

            jobTitle:
                data.jobTitle,

            status:
                data.status

        };

    }

}
