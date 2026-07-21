import { z } from "zod";

import { ChatType } from "@/types/enums";

/** Mirrors CreateChatSchema exactly */
export const createChatSchema = z.object({
  participantIds: z.array(z.string().trim().min(1)).min(1, "At least one participant is required."),
  type: z.enum([ChatType.DIRECT, ChatType.GROUP]).optional(),
});

export type CreateChatFormValues = z.infer<typeof createChatSchema>;

/** Mirrors SendMessageSchema exactly */
export const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(5000, "Message must be at most 5000 characters."),
  attachments: z.array(z.string().trim().url("Invalid attachment URL.")).optional(),
});

export type SendMessageFormValues = z.infer<typeof sendMessageSchema>;
