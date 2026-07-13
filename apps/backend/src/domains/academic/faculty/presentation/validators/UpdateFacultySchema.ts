import { z } from "zod";

export const UpdateFacultySchema = z.object({

    employeeId: z.string()

        .trim()

        .min(1)

        .optional(),

    designation: z.string()

        .trim()

        .min(2)

        .max(100)

        .optional(),

    specialization: z.string()

        .trim()

        .max(200)

        .optional()

});