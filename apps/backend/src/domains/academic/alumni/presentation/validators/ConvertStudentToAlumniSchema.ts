import { z } from "zod";

export const ConvertStudentToAlumniSchema = z.object({

    graduationYear: z.coerce.number().int().min(1990).max(2100).optional(),

    company: z.string().trim().max(200).optional(),

    designation: z.string().trim().max(200).optional()

});
