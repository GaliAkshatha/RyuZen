import { z } from "zod";

export const VerifyInvitationSchema = z.object({

    email: z
        .email()
        .transform(email => email.toLowerCase()),

    token: z
        .string()
        .min(1)

});
