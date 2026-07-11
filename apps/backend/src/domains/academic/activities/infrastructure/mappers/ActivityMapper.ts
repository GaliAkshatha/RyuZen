import { Activity } from "../../domain/entities/Activity.js";
import { IAttachment } from "../../domain/interfaces/IAttachment.js";

import {
    ActivityDocument
} from "../persistence/ActivityModel.js";

export class ActivityMapper {

    static toDomain(

        document: ActivityDocument

    ): Activity {

        return Activity.create({

            id: document.id,

            organizationId:
                document.organizationId.toString(),

            createdBy:
                document.createdBy.toString(),

            title:
                document.title,

            description:
                document.description,

            type:
                document.type,

            status:
                document.status,

            visibility:
                document.visibility,

            points:
                document.points,

            penaltyPoints:
                document.penaltyPoints,

            startDate:
                document.startDate,

            endDate:
                document.endDate,

            attachments:

                document.attachments.map(

                    (attachment: IAttachment) => ({

                        name:
                            attachment.name,

                        url:
                            attachment.url,

                        mimeType:
                            attachment.mimeType

                    })

                ),

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        activity: Activity

    ) {

        const data =
            activity.toObject();

        return {

            organizationId:
                data.organizationId,

            createdBy:
                data.createdBy,

            title:
                data.title,

            description:
                data.description,

            type:
                data.type,

            status:
                data.status,

            visibility:
                data.visibility,

            points:
                data.points,

            penaltyPoints:
                data.penaltyPoints,

            startDate:
                data.startDate,

            endDate:
                data.endDate,

            attachments:

                data.attachments.map(

                    attachment => ({

                        name:
                            attachment.name,

                        url:
                            attachment.url,

                        mimeType:
                            attachment.mimeType

                    })

                )

        };

    }

}