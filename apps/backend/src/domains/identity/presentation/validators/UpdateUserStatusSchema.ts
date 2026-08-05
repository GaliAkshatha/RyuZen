import { z } from "zod";

import { UserStatus } from "../../domain/constants/UserStatus.js";

export const UpdateUserStatusSchema = z.object({

    status: z.enum([UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.ARCHIVED])

});
