import { z } from "zod";

export const CreateDepartmentSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, "Department name is required.")
        .max(100),

    code: z
        .string()
        .trim()
        .min(2)
        .max(10),

    description: z
        .string()
        .trim()
        .max(500)
        .optional()

});