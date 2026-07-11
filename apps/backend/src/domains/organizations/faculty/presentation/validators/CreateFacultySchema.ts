import { z } from "zod";

import { FacultyDesignation } from "../../domain/constants/FacultyDesignation.js";

export const CreateFacultySchema = z.object({

    departmentId: z
        .string()
        .trim()
        .min(1, "Department is required."),

    name: z
        .string()
        .trim()
        .min(3)
        .max(100),

    email: z
        .string()
        .email(),

    password: z
        .string()
        .min(8)
        .max(64),

    employeeId: z
        .string()
        .trim()
        .min(1),

    designation: z.nativeEnum(
        FacultyDesignation
    ),

    joiningDate: z
        .string()

});