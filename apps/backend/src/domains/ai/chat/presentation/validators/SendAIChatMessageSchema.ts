import { z } from "zod";

export const SendAIChatMessageSchema = z.object({

    chatId: z.string()

        .trim()

        .min(1)

        .optional(),

    message: z.string()

        .trim()

        .min(1, "Message is required.")

        .max(5000),

    context: z.string()

        .trim()

        .max(200)

        .optional()

});
