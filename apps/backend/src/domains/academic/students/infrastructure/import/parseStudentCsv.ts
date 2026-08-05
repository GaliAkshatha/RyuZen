import { parse } from "csv-parse/sync";

import { normalizeCsvRow } from "./normalizeCsvHeaders.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * The only place in the codebase that parses an uploaded CSV buffer -
 * every row comes back with real, normalized field names
 * (BulkStudentRowSchema's shape), never the raw human-readable
 * headers. Genuinely malformed CSV (unparseable structure, not just a
 * bad individual row - that's handled per-row in
 * BulkImportStudentsUseCase) throws a real, clear error rather than
 * a cryptic csv-parse internal message.
 */
export function parseStudentCsv(buffer: Buffer): Record<string, string>[] {

    let rawRows: Record<string, string>[];

    try {

        rawRows = parse(buffer, {

            columns: true,

            skip_empty_lines: true,

            trim: true

        }) as Record<string, string>[];

    } catch (error) {

        const message = error instanceof Error ? error.message : String(error);

        throw new ApiError(

            `Could not parse the uploaded file as CSV: ${message}`,

            HttpStatus.BAD_REQUEST

        );

    }

    if (rawRows.length === 0) {

        throw new ApiError(

            "The uploaded file has no data rows.",

            HttpStatus.BAD_REQUEST

        );

    }

    return rawRows.map(row => normalizeCsvRow(row));

}
