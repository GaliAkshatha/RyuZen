import { JobApplication } from "../../domain/entities/JobApplication.js";

import { JobApplicationResponseDto } from "../../application/dto/JobApplicationResponseDto.js";

export class JobApplicationResponseMapper {

    static toDto(

        application: JobApplication

    ): JobApplicationResponseDto {

        return {

            id:
                application.id!,

            placementId:
                application.placementId,

            studentId:
                application.studentId,

            resume:
                application.resume,

            status:
                application.status,

            remarks:
                application.remarks,

            appliedAt:
                application.appliedAt

        };

    }

}
