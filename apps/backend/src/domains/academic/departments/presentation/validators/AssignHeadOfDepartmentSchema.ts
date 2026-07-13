import { z } from "zod";

export const AssignHeadOfDepartmentSchema = z.object({

    userId: z.string()

        .trim()

        .min(1, "User id is required.")

});