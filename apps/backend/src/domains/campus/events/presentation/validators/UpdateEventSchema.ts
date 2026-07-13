import { z } from "zod";

export const UpdateEventSchema = z.object({

    title: z.string()

        .trim()

        .min(3)

        .max(200)

        .optional(),

    description: z.string()

        .trim()

        .min(1)

        .max(3000)

        .optional(),

    venue: z.string()

        .trim()

        .max(300)

        .optional(),

    startDate: z.coerce.date()

        .optional(),

    endDate: z.coerce.date()

        .optional(),

    registrationDeadline: z.coerce.date()

        .optional(),

    capacity: z.number()

        .min(1)

        .optional(),

    points: z.number()

        .min(0)

        .optional(),

    certificateEnabled: z.boolean()

        .optional()

});
