import { z } from "zod";

export const CreateDepartmentSchema = z.object({

    name: z.string()

        .trim()

        .min(2)

        .max(150),

    code: z.string()

        .trim()

        .min(2)

        .max(20),

    description: z.string()

        .trim()

        .max(500)

        .optional()

});