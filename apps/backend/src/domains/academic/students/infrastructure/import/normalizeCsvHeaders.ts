/**
 * Real CSV files use human-readable headers ("Admission Year", "10th
 * Percentage"), while BulkStudentRowSchema expects camelCase keys
 * (admissionYear, tenthPercentage) to match CreateStudentDto/
 * InviteUserDto's own field names. This maps the real, expected header
 * text (case/spacing-insensitive) to those keys - unrecognized columns
 * are dropped rather than guessed at.
 */
const HEADER_MAP: Record<string, string> = {
    "name": "name",
    "email": "email",
    "usn": "usn",
    "branch": "branch",
    "department": "branch",
    "section": "section",
    "semester": "semester",
    "batch": "batch",
    "admissionyear": "admissionYear",
    "admission year": "admissionYear",
    "graduationyear": "graduationYear",
    "graduation year": "graduationYear",
    "10thpercentage": "tenthPercentage",
    "10th percentage": "tenthPercentage",
    "12thpercentage": "twelfthPercentage",
    "12th percentage": "twelfthPercentage",
    "entrancerank": "entranceRank",
    "entrance rank": "entranceRank"
};

function normalizeKey(header: string): string {
    return header.trim().toLowerCase();
}

export function normalizeCsvRow(row: Record<string, string>): Record<string, string> {

    const normalized: Record<string, string> = {};

    for (const [header, value] of Object.entries(row)) {

        const mappedKey = HEADER_MAP[normalizeKey(header)];

        if (mappedKey) {
            normalized[mappedKey] = value;
        }

    }

    return normalized;

}
