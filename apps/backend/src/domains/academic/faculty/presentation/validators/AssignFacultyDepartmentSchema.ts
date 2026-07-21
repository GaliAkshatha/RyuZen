import { z } from "zod";

export const AssignFacultyDepartmentSchema = z.object({

    departmentId: z.string()

        .trim()

        .min(1, "Department id is required.")

});
