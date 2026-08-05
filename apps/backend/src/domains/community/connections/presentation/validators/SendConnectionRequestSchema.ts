import { z } from "zod";

export const SendConnectionRequestSchema = z.object({

    toUserId: z.string().min(1)

});
