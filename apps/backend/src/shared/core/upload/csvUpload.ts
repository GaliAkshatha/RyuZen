import multer from "multer";

import { ApiError } from "../http/ApiError.js";
import { HttpStatus } from "../http/HttpStatus.js";

/**
 * In-memory storage (no disk writes) - the uploaded file only ever
 * needs to be parsed once and discarded, matching
 * BulkImportStudentsUseCase's use of the raw buffer directly. A real
 * 5MB cap and a real MIME/extension check reject obviously-wrong
 * uploads before they ever reach parsing.
 */
export const csvUpload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (_req, file, callback) => {

        const isCsv =
            file.mimetype === "text/csv" ||
            file.mimetype === "application/vnd.ms-excel" ||
            file.originalname.toLowerCase().endsWith(".csv");

        if (!isCsv) {

            // A real ApiError, not a plain Error - guarantees this
            // reaches the client as a clear 400, not a generic 500,
            // regardless of how Multer itself wraps fileFilter errors
            // internally.
            callback(new ApiError("Only CSV files are supported.", HttpStatus.BAD_REQUEST));
            return;

        }

        callback(null, true);

    }

});
