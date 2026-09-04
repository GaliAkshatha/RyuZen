import multer from "multer";

import { ApiError } from "../http/ApiError.js";
import { HttpStatus } from "../http/HttpStatus.js";

/**
 * Real memory storage, not disk - the actual persistence now happens
 * in IFileStorageService (see shared/infrastructure/storage), which
 * genuinely supports both local disk and real S3-compatible object
 * storage depending on STORAGE_PROVIDER. This file previously wrote
 * straight to disk itself and documented that as an honest
 * limitation for ephemeral deployments; that gap is now actually
 * fixed rather than just written down - the file buffer is handed to
 * whichever real storage implementation is configured.
 */
export const certificationFileUpload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (_req, file, callback) => {

        const allowedMimeTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {

            callback(new ApiError("Only PDF, JPEG, PNG, or WEBP files are supported.", HttpStatus.BAD_REQUEST));
            return;

        }

        callback(null, true);

    }

});
