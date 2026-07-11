import { Submission } from "../../domain/entities/Submission.js";

import {

    SubmissionDocument

} from "../persistence/SubmissionModel.js";

export class SubmissionMapper {

    static toDomain(

        document: SubmissionDocument

    ): Submission {

        return Submission.create({

            id: document.id,

            activityId:

                document.activityId.toString(),

            organizationId:

                document.organizationId.toString(),

            submittedBy:

                document.submittedBy.toString(),

            status:

                document.status,

            remarks:

                document.remarks,

            attachments:

                document.attachments.map(

                    attachment => ({

                        name: attachment.name,

                        url: attachment.url,

                        mimeType: attachment.mimeType

                    })

                ),

            review: {

                reviewedBy:

                    document.review.reviewedBy?.toString() ?? "",

                reviewedAt:

                    document.review.reviewedAt,

                feedback:

                    document.review.feedback,

                pointsAwarded:

                    document.review.pointsAwarded

            },

            submittedAt:

                document.submittedAt,

            createdAt:

                document.createdAt,

            updatedAt:

                document.updatedAt

        });

    }

    static toPersistence(

        submission: Submission

    ) {

        return submission.toObject();

    }

}