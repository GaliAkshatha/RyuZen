import { z } from "zod";

import { CodingPlatform } from "../../domain/constants/CodingPlatform.js";

export const LinkCodingProfileSchema = z.object({

    platform: z.enum([CodingPlatform.CODEFORCES]),

    handle: z.string().trim().min(1).max(50)

});
