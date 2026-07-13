import { z } from "zod";

export const UpdateMentorshipSchema = z.object({

    remarks: z.string()

        .trim()

        .min(1, "Remarks are required.")

        .max(1000)

});
