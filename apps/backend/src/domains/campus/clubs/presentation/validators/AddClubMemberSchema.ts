import { z } from "zod";

import { ClubMemberRole } from "../../domain/constants/ClubMemberRole.js";

export const AddClubMemberSchema = z.object({

    studentId: z.string()

        .trim()

        .min(1, "Student id is required."),

    role: z.enum([

        ClubMemberRole.MEMBER,

        ClubMemberRole.PRESIDENT,

        ClubMemberRole.VICE_PRESIDENT

    ])

        .optional()

});
