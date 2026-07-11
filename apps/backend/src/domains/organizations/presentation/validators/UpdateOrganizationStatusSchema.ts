import { z } from "zod";

import { OrganizationStatus } from "../../domain/constants/OrganizationStatus.js";

export const UpdateOrganizationStatusSchema = z.object({

    status:

        z.enum([

            OrganizationStatus.ACTIVE,

            OrganizationStatus.INACTIVE,

            OrganizationStatus.SUSPENDED

        ])

});
