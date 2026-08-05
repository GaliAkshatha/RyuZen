import { IUserRepository } from "../../../../identity/infrastructure/repositories/IUserRepository.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { IDepartmentRepository } from "../../../departments/infrastructure/repositories/IDepartmentRepository.js";

import { InviteUserUseCase } from "../../../../identity/application/use-cases/InviteUserUseCase.js";
import { CreateStudentUseCase } from "./CreateStudentUseCase.js";

import { parseStudentCsv } from "../../infrastructure/import/parseStudentCsv.js";
import { BulkStudentRowSchema } from "../../infrastructure/import/BulkStudentRowSchema.js";

import { BulkImportReportDto, BulkImportSuccessRow, BulkImportFailureRow } from "../dto/BulkImportReportDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";

/**
 * The real bulk-import flow: Upload -> Validate -> Create Users ->
 * Generate Invitations -> Send Emails -> Return Import Report.
 *
 * Deliberately reuses InviteUserUseCase and CreateStudentUseCase
 * unchanged for each row - the same real user-creation, invitation-
 * token, and email-sending logic already proven for a single admin
 * invite, rather than a parallel bulk-specific implementation. Each
 * row calls the exact same code path a one-at-a-time invite would.
 *
 * One row failing (duplicate email, validation error, an invite that
 * gets rejected) never aborts the batch - every row is attempted
 * independently and the outcome is recorded, so a single bad row in a
 * 200-row file doesn't cost the other 199 real invitations.
 *
 * Department ("Branch") is resolved by name against this
 * organization's real departments, fetched once up front rather than
 * once per row. An unmatched or blank branch is not a failure - it's
 * a student created without a department set, matching
 * CreateStudentDto's own optional departmentId.
 */
export class BulkImportStudentsUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly departmentRepository: IDepartmentRepository,

        private readonly inviteUserUseCase: InviteUserUseCase,

        private readonly createStudentUseCase: CreateStudentUseCase

    ) {}

    async execute(

        organizationId: string,

        invitedBy: string,

        invitedByRole: UserRole,

        fileBuffer: Buffer

    ): Promise<BulkImportReportDto> {

        const rawRows = parseStudentCsv(fileBuffer);

        const departments = await this.departmentRepository.findByOrganization(organizationId);

        const departmentsByName = new Map(
            departments.map(department => [department.name.trim().toLowerCase(), department])
        );

        const successfulImports: BulkImportSuccessRow[] = [];
        const duplicates: BulkImportFailureRow[] = [];
        const validationFailures: BulkImportFailureRow[] = [];
        const skippedRecords: BulkImportFailureRow[] = [];

        const emailsSeenInThisBatch = new Set<string>();

        for (let i = 0; i < rawRows.length; i++) {

            const rowNumber = i + 2; // real spreadsheet row number: header is row 1, data starts at row 2
            const rawRow = rawRows[i];

            const parsed = BulkStudentRowSchema.safeParse(rawRow);

            if (!parsed.success) {

                validationFailures.push({
                    row: rowNumber,
                    email: rawRow.email,
                    reason: parsed.error.issues.map(issue => issue.message).join("; ")
                });

                continue;

            }

            const row = parsed.data;

            if (emailsSeenInThisBatch.has(row.email)) {

                duplicates.push({
                    row: rowNumber,
                    email: row.email,
                    reason: "Duplicate email within this same file."
                });

                continue;

            }

            emailsSeenInThisBatch.add(row.email);

            const alreadyExists = await this.userRepository.existsByEmail(row.email);

            if (alreadyExists) {

                duplicates.push({
                    row: rowNumber,
                    email: row.email,
                    reason: "A user with this email already exists in the organization."
                });

                continue;

            }

            try {

                const invitation = await this.inviteUserUseCase.execute(

                    organizationId,

                    invitedBy,

                    invitedByRole,

                    {
                        name: row.name,
                        email: row.email,
                        role: UserRole.STUDENT
                    }

                );

                const department = row.branch
                    ? departmentsByName.get(row.branch.trim().toLowerCase())
                    : undefined;

                await this.createStudentUseCase.execute(

                    {

                        userId: invitation.userId,

                        departmentId: department?.id,

                        usn: row.usn,

                        batch: row.batch,

                        semester: row.semester,

                        section: row.section,

                        admissionYear: row.admissionYear,

                        graduationYear: row.graduationYear,

                        tenthPercentage: row.tenthPercentage,

                        twelfthPercentage: row.twelfthPercentage,

                        entranceRank: row.entranceRank

                    },

                    organizationId

                );

                successfulImports.push({
                    row: rowNumber,
                    name: row.name,
                    email: row.email,
                    userId: invitation.userId
                });

            } catch (error) {

                const reason = error instanceof ApiError
                    ? error.message
                    : "An unexpected error occurred while creating this student.";

                skippedRecords.push({
                    row: rowNumber,
                    email: row.email,
                    reason
                });

            }

        }

        return {

            totalRows: rawRows.length,

            successfulImports,

            duplicates,

            validationFailures,

            skippedRecords

        };

    }

}
