import { z } from "zod";

export const CreateSubmissionSchema = z.object({

    activityId:

        z.string()

        .trim()

        .min(

            1,

            "Activity ID is required."

        ),

    remarks:

        z.string()

        .trim()

        .max(

            500,

            "Remarks cannot exceed 500 characters."

        )

        .default(""),

    attachments:

        z.array(

            z.object({

                name:

                    z.string()

                    .trim()

                    .min(

                        1,

                        "Attachment name is required."

                    ),

                url:

                    z.string()

                    .url(

                        "Invalid attachment URL."

                    ),

                mimeType:

                    z.string()

                    .trim()

                    .min(

                        1,

                        "MIME type is required."

                    )

            })

        )

        .min(

            1,

            "At least one attachment is required."

        )

});