import { z } from "zod";

/** Mirrors SendAIChatMessageSchema exactly */
export const sendAIChatMessageSchema = z.object({
  chatId: z.string().trim().min(1).optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(5000, "Message must be at most 5000 characters."),
  context: z.string().trim().max(200, "Context must be at most 200 characters.").optional(),
});

export type SendAIChatMessageFormValues = z.infer<typeof sendAIChatMessageSchema>;
