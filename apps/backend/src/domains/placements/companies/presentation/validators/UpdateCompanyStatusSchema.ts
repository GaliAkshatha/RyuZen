import { z } from "zod";

import { CompanyStatus } from "../../domain/constants/CompanyStatus.js";

export const UpdateCompanyStatusSchema = z.object({

    status: z.enum([

        CompanyStatus.ACTIVE,

        CompanyStatus.INACTIVE

    ])

});
