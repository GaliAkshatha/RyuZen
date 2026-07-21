import { z } from "zod";

import { Permission } from "@/types/enums";

const permissionEnum = z.nativeEnum(Permission);

/** Mirrors GrantPermissionSchema exactly */
export const grantPermissionSchema = z.object({
  userId: z.string().trim().min(1, "A user ID is required."),
  permission: permissionEnum,
});

export type GrantPermissionFormValues = z.infer<typeof grantPermissionSchema>;

/** Mirrors RevokePermissionSchema exactly — identical shape to grant */
export const revokePermissionSchema = z.object({
  userId: z.string().trim().min(1, "A user ID is required."),
  permission: permissionEnum,
});

export type RevokePermissionFormValues = z.infer<typeof revokePermissionSchema>;
