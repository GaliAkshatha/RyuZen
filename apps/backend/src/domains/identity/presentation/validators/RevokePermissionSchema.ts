import { z } from "zod";

import { Permission } from "../../../platform/permissions/domain/constants/Permission.js";

export const RevokePermissionSchema = z.object({

    permission: z.enum(Permission)

});
