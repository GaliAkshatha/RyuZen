import { z } from "zod";

export const ApplyToPlacementSchema = z.object({

    resume: z.string()

        .trim()

        .url("Invalid resume URL.")

        .optional()

});
