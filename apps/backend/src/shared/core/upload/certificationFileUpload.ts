import path from "path";
import fs from "fs";
import multer from "multer";

import { ApiError } from "../http/ApiError.js";
import { HttpStatus } from "../http/HttpStatus.js";

/**
 * Real disk storage, not multer.memoryStorage() like csvUpload.ts -
 * a certification file needs to persist and be served back out later
 * (unlike a CSV, which is parsed once and discarded), so it has to
 * actually be written somewhere.
 *
 * Honest limitation: this writes to local disk on whatever server
 * this process runs on. That's genuinely fine for a single-instance
 * deployment with a persistent filesystem, but it will NOT survive a
 * redeploy or work correctly across multiple instances on a platform
 * with an ephemeral/container filesystem (e.g., most PaaS free tiers).
 * A real production deployment on infrastructure like that would need
 * this swapped for real cloud object storage (S3-compatible) - not
 * done here since no such credentials exist in this project's .env,
 * and adding an unused cloud integration nobody asked for would be
 * over-engineering rather than a real fix.
 */
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "certifications");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const certificationFileUpload = multer({

    storage: multer.diskStorage({

        destination: (_req, _file, callback) => {
            callback(null, UPLOAD_DIR);
        },

        filename: (_req, file, callback) => {
            const safeExt = path.extname(file.originalname).toLowerCase();
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
            callback(null, uniqueName);
        }

    }),

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
