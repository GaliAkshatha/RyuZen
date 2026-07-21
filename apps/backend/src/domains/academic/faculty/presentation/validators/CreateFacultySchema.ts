import { z } from "zod";

export const CreateFacultySchema = z.object({

    userId: z.string()

        .trim()

        .min(1, "User id is required."),

    departmentId: z.string()

        .trim()

        .min(1)

        .optional(),

    employeeId: z.string()

        .trim()

        .min(1, "Employee id is required."),

    designation: z.string()

        .trim()

        .min(2)

        .max(100),

    specialization: z.string()

        .trim()

        .max(200)

        .optional()

});
