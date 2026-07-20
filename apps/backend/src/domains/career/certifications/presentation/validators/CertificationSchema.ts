import { z } from "zod";

export const CreateCertificationSchema = z.object({

    title: z.string()

        .trim()

        .min(1, "Title is required.")

        .max(200),

    issuer: z.string()

        .trim()

        .min(1, "Issuer is required.")

        .max(150),

    credentialId: z.string()

        .trim()

        .max(150)

        .optional(),

    issueDate: z.coerce.date(),

    expiryDate: z.coerce.date()

        .optional(),

    credentialUrl: z.string()

        .trim()

        .url("Invalid credential URL.")

        .optional(),

    skills: z.array(

        z.string().trim()

    )

        .optional()

});

export const UpdateCertificationSchema = z.object({

    title: z.string()

        .trim()

        .min(1)

        .max(200)

        .optional(),

    issuer: z.string()

        .trim()

        .min(1)

        .max(150)

        .optional(),

    credentialId: z.string()

        .trim()

        .max(150)

        .optional(),

    issueDate: z.coerce.date()

        .optional(),

    expiryDate: z.coerce.date()

        .optional(),

    credentialUrl: z.string()

        .trim()

        .url("Invalid credential URL.")

        .optional(),

    skills: z.array(

        z.string().trim()

    )

        .optional()

});
