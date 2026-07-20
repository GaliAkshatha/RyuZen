import { z } from "zod";

export const GenerateResumeSchema = z.object({

    selectedTemplate: z.string()

        .trim()

        .min(1, "A resume template must be selected."),

    resumeUrl: z.string()

        .trim()

        .url("A valid resume file URL is required.")

});
