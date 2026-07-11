import { Activity } from "../../domain/entities/Activity.js";

import { ActivityResponseDto } from "../../application/dto/ActivityResponseDto.js";

export class ActivityResponseMapper {

    static toDto(

        activity: Activity

    ): ActivityResponseDto {

        return {

            id:
                activity.id!,

            organizationId:
                activity.organizationId,

            createdBy:
                activity.createdBy,

            title:
                activity.title,

            description:
                activity.description,

            type:
                activity.type,

            status:
                activity.status,

            visibility:
                activity.visibility,

            points:
                activity.points,

            penaltyPoints:
                activity.penaltyPoints,

            startDate:
                activity.startDate,

            endDate:
                activity.endDate,

            attachments:

                activity.attachments.map(

                    attachment => ({

                        name:
                            attachment.name,

                        url:
                            attachment.url,

                        mimeType:
                            attachment.mimeType

                    })

                ),

            createdAt:
                activity.createdAt,

            updatedAt:
                activity.updatedAt

        };

    }

}