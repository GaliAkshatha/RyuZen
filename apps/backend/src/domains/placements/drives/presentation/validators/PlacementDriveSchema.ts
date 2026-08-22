import { z } from "zod";

export const CreatePlacementDriveSchema = z.object({

    companyId: z.string()

        .trim()

        .min(1, "Company id is required."),

    title: z.string()

        .trim()

        .min(1, "Title is required.")

        .max(200),

    description: z.string()

        .trim()

        .max(3000)

        .optional(),

    package: z.string()

        .trim()

        .max(100)

        .optional(),

    location: z.string()

        .trim()

        .max(200)

        .optional(),

    eligibility: z.string()

        .trim()

        .max(2000)

        .optional(),

    /**
     * BACKEND GAP FIX: previously entirely absent from this schema
     * despite IPlacementDrive, CreatePlacementDriveDto,
     * CreatePlacementDriveUseCase, PlacementDrive entity, and
     * PlacementDriveModel all genuinely supporting this field - it was
     * being silently stripped from every create request before the
     * use case ever saw it (Zod's default .object() behavior discards
     * unrecognized keys). Now genuinely reachable from the API.
     */
    eligibilityCriteria: z.object({

        departmentIds: z.array(z.string()).optional(),

        minCgpa: z.number().min(0).max(10).optional(),

        minSemester: z.number().int().min(1).max(12).optional(),

        batches: z.array(z.string()).optional()

    }).optional(),

    deadline: z.coerce.date()

        .optional()

});

export const UpdatePlacementDriveSchema = z.object({

    title: z.string()

        .trim()

        .min(1)

        .max(200)

        .optional(),

    description: z.string()

        .trim()

        .max(3000)

        .optional(),

    package: z.string()

        .trim()

        .max(100)

        .optional(),

    location: z.string()

        .trim()

        .max(200)

        .optional(),

    eligibility: z.string()

        .trim()

        .max(2000)

        .optional(),

    eligibilityCriteria: z.object({

        departmentIds: z.array(z.string()).optional(),

        minCgpa: z.number().min(0).max(10).optional(),

        minSemester: z.number().int().min(1).max(12).optional(),

        batches: z.array(z.string()).optional()

    }).optional(),

    deadline: z.coerce.date()

        .optional()

});
