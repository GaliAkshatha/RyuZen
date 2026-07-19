import { z } from "zod";

import { EmploymentType } from "../../domain/constants/EmploymentType.js";

export const CreateExperienceSchema = z.object({

    company: z.string()

        .trim()

        .min(1, "Company is required.")

        .max(150),

    role: z.string()

        .trim()

        .min(1, "Role is required.")

        .max(150),

    employmentType: z.enum([

        EmploymentType.FULL_TIME,

        EmploymentType.PART_TIME,

        EmploymentType.INTERNSHIP,

        EmploymentType.CONTRACT,

        EmploymentType.FREELANCE

    ])

        .optional(),

    location: z.string()

        .trim()

        .max(150)

        .optional(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date()

        .optional(),

    currentlyWorking: z.boolean()

        .optional(),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    skills: z.array(

        z.string().trim()

    )

        .optional()

});

export const UpdateExperienceSchema = z.object({

    company: z.string()

        .trim()

        .min(1)

        .max(150)

        .optional(),

    role: z.string()

        .trim()

        .min(1)

        .max(150)

        .optional(),

    employmentType: z.enum([

        EmploymentType.FULL_TIME,

        EmploymentType.PART_TIME,

        EmploymentType.INTERNSHIP,

        EmploymentType.CONTRACT,

        EmploymentType.FREELANCE

    ])

        .optional(),

    location: z.string()

        .trim()

        .max(150)

        .optional(),

    startDate: z.coerce.date()

        .optional(),

    endDate: z.coerce.date()

        .optional(),

    currentlyWorking: z.boolean()

        .optional(),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    skills: z.array(

        z.string().trim()

    )

        .optional()

});
