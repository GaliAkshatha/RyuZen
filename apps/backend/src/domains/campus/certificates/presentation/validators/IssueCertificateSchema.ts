import { z } from "zod";

export const IssueCertificateSchema = z.object({

    studentId: z.string()

        .trim()

        .min(1, "Student id is required."),

    eventId: z.string()

        .trim()

        .min(1)

        .optional(),

    activityId: z.string()

        .trim()

        .min(1)

        .optional(),

    certificateUrl: z.string()

        .trim()

        .url("A valid certificate URL is required.")

});
