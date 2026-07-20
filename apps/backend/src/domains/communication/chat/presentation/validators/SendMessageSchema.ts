import { z } from "zod";

export const SendMessageSchema = z.object({

    message: z.string()

        .trim()

        .min(1, "Message is required.")

        .max(5000),

    attachments: z.array(

        z.string().trim().url("Invalid attachment URL.")

    )

        .optional()

});
