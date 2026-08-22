import { z } from "zod";

export const UpdateActivitySchema = z.object({

    title:

        z.string()

            .min(5)

            .max(150)

            .optional(),

    description:

        z.string()

            .max(3000)

            .optional(),

    type:

        z.enum([

            "ASSIGNMENT",

            "WORKSHOP",

            "EVENT",

            "HACKATHON",

            "QUIZ",

            "FORM",

            "SURVEY"

        ])

            .optional(),

    visibility:

        z.enum([

            "PUBLIC",

            "DEPARTMENT",

            "SEMESTER",

            "YEAR",

            "PRIVATE"

        ])

            .optional(),

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

        z.number().min(0)

            .optional(),

    penaltyPoints:

        z.number().min(0)

            .optional(),

    startDate:

        z.coerce.date()

            .optional(),

    endDate:

        z.coerce.date()

            .optional(),

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

            .optional()

});
