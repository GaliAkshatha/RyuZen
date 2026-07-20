import { JobApplication } from "../../domain/entities/JobApplication.js";

import { JobApplicationStatus } from "../../domain/constants/JobApplicationStatus.js";

import {
    JobApplicationDocument
} from "../persistence/JobApplicationModel.js";

export class JobApplicationMapper {

    static toDomain(

        document: JobApplicationDocument

    ): JobApplication {

        return JobApplication.create({

            id:
                document.id,

            placementId:
                document.placementId.toString(),

            studentId:
                document.studentId.toString(),

            resume:
                document.resume,

            status:
                document.status as JobApplicationStatus,

            remarks:
                document.remarks,

            appliedAt:
                document.appliedAt

        });

    }

    static toPersistence(

        application: JobApplication

    ) {

        const data =
            application.toObject();

        return {

            placementId:
                data.placementId,

            studentId:
                data.studentId,

            resume:
                data.resume,

            status:
                data.status,

            remarks:
                data.remarks,

            appliedAt:
                data.appliedAt

        };

    }

}
