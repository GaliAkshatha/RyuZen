import { z } from "zod";

/**
 * A blank CSV cell arrives as an empty string, not undefined/missing -
 * z.coerce.number() on "" silently produces 0 (Number("") === 0 in
 * JS), which would corrupt a genuinely blank "Semester" or
 * "Entrance Rank" cell into a real, wrong 0 rather than leaving it
 * unset. This normalizes every empty-string field on the whole row to
 * undefined BEFORE the real schema runs, rather than fighting Zod's
 * type inference per-field with preprocess() wrappers.
 */
function blankStringsToUndefined(row: Record<string, unknown>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
        cleaned[key] = typeof value === "string" && value.trim() === "" ? undefined : value;
    }
    return cleaned;
}

const RawBulkStudentRowSchema = z.object({

    name: z.string().trim().min(3, "Name must be at least 3 characters."),

    email: z.string().trim().email("Invalid email address.").transform(e => e.toLowerCase()),

    usn: z.string().trim().min(1, "USN is required."),

    branch: z.string().trim().optional(),

    section: z.string().trim().optional(),

    semester: z.coerce.number().int().min(1).max(12).optional(),

    batch: z.string().trim().min(1, "Batch is required."),

    admissionYear: z.coerce.number().int().min(1990).max(2100).optional(),

    graduationYear: z.coerce.number().int().min(1990).max(2100).optional(),

    tenthPercentage: z.coerce.number().min(0).max(100).optional(),

    twelfthPercentage: z.coerce.number().min(0).max(100).optional(),

    entranceRank: z.coerce.number().int().min(1).optional()

});

/**
 * One CSV row. Name/Email/USN/Batch are the real required fields (an
 * Invitation and a Student record cannot be created without them -
 * confirmed against InviteUserUseCase and CreateStudentDto directly).
 * Everything else is optional, matching CreateStudentDto's own optional
 * fields - a row missing a percentage or entrance rank is still a
 * genuinely valid import, not a failure.
 */
export const BulkStudentRowSchema = z.preprocess(
    (row) => blankStringsToUndefined(row as Record<string, unknown>),
    RawBulkStudentRowSchema
);

export type BulkStudentRow = z.infer<typeof RawBulkStudentRowSchema>;
