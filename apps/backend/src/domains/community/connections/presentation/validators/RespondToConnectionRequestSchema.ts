import { z } from "zod";

export const RespondToConnectionRequestSchema = z.object({

    accept: z.boolean()

});
