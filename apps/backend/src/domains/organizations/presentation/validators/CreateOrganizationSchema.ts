import { z } from "zod";

export const CreateOrganizationSchema = z.object({

    name: z.string()

        .trim()

        .min(3)

        .max(100),

    code: z.string()

        .trim()

        .min(2)

        .max(10),

    emailDomains:

        z.array(

            z.string()

        )

        .min(1)

});