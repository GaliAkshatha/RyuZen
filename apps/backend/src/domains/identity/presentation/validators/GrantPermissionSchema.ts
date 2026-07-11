import { z } from "zod";

import { Permission } from "../../../platform/permissions/domain/constants/Permission.js";

export const GrantPermissionSchema = z.object({

    permission: z.enum(Permission)

});