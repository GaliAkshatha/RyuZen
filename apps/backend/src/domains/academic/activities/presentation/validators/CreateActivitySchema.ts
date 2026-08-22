import { z } from "zod";

export const CreateActivitySchema = z.object({

    title:

        z.string()

            .min(5)

            .max(150),

    description:

        z.string()

            .max(3000),

    type:

        z.enum([

            "ASSIGNMENT",

            "WORKSHOP",

            "EVENT",

            "HACKATHON",

            "QUIZ",

            "FORM",

            "SURVEY"

        ]),

    visibility:

        z.enum([

            "PUBLIC",

            "DEPARTMENT",

            "SEMESTER",

            "YEAR",

            "PRIVATE"

        ]),

    departmentIds:

        z.array(z.string())
            .optional(),

    batches:

        z.array(z.string())
            .optional(),

    semesters:

        z.array(z.number().int().min(1).max(12))
            .optional(),

    sections:

        z.array(z.string())
            .optional(),

    points:

        z.number().min(0),

    penaltyPoints:

        z.number().min(0),

    startDate:

        z.coerce.date(),

    endDate:

        z.coerce.date(),

    attachments:

        z.array(

            z.object({

                name:

                    z.string(),

                url:

                    z.string().url(),

                mimeType:

                    z.string()

            })

        )

});