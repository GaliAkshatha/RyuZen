import { Submission } from "../../domain/entities/Submission.js";

import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

export class SubmissionResponseMapper {

    static toDto(

        submission: Submission

    ): SubmissionResponseDto {

        return {

            id:

                submission.id!,

            activityId:

                submission.activityId,

            organizationId:

                submission.organizationId,

            submittedBy:

                submission.submittedBy,

            status:

                submission.status,

            remarks:

                submission.remarks,

            attachments:

                submission.attachments.map(

                    attachment => ({

                        ...attachment

                    })

                ),

            review:
                {

                        ...submission.review

                },

            submittedAt:

                submission.submittedAt,

            createdAt:

                submission.createdAt,

            updatedAt:

                submission.updatedAt

        };

    }

}