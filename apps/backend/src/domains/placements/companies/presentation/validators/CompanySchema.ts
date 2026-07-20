import { z } from "zod";

export const CreateCompanySchema = z.object({

    name: z.string()

        .trim()

        .min(1, "Company name is required.")

        .max(150),

    logo: z.string()

        .trim()

        .url("Invalid logo URL.")

        .optional(),

    website: z.string()

        .trim()

        .url("Invalid website URL.")

        .optional(),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    hrName: z.string()

        .trim()

        .max(150)

        .optional(),

    hrEmail: z.email()

        .optional()

});

export const UpdateCompanySchema = z.object({

    name: z.string()

        .trim()

        .min(1)

        .max(150)

        .optional(),

    logo: z.string()

        .trim()

        .url("Invalid logo URL.")

        .optional(),

    website: z.string()

        .trim()

        .url("Invalid website URL.")

        .optional(),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    hrName: z.string()

        .trim()

        .max(150)

        .optional(),

    hrEmail: z.email()

        .optional()

});
