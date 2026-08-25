import { z } from "zod";

/** Mirrors the real backend CreateNewsSchema exactly. */
export const createNewsSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().trim().min(1, "Content is required").max(5000),
});
export type CreateNewsFormValues = z.infer<typeof createNewsSchema>;
