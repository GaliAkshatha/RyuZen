import { z } from "zod";

export const CreateRecruiterSchema = z.object({

    userId: z.string().min(1),

    companyId: z.string().min(1),

    jobTitle: z.string().trim().max(100).optional()

});
