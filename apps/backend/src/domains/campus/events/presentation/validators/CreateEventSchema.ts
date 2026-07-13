import { z } from "zod";

export const CreateEventSchema = z.object({

    clubId: z.string()

        .trim()

        .min(1)

        .optional(),

    title: z.string()

        .trim()

        .min(3)

        .max(200),

    description: z.string()

        .trim()

        .min(1)

        .max(3000),

    venue: z.string()

        .trim()

        .max(300)

        .optional(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

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
