import path from "path";
import fs from "fs/promises";

import { IFileStorageService } from "./IFileStorageService.js";

/**
 * The real default - writes to local disk, same directory
 * certificationFileUpload.ts already used, now behind the shared
 * interface so the rest of the app never has to know which
 * implementation is active. Honest limitation, unchanged from
 * before: this needs a real persistent volume mounted at
 * process.cwd()/uploads on any host with an ephemeral filesystem
 * (docker-compose.yml already does this for local/self-hosted use) -
 * for a real serverless or otherwise ephemeral deployment, use
 * S3StorageService instead (STORAGE_PROVIDER=s3).
 */
export class LocalDiskStorageService implements IFileStorageService {

    private readonly uploadDir: string;

    constructor() {

        this.uploadDir = path.join(

            process.cwd(),

            "uploads",

            "certifications"

        );

    }

    async upload(

        buffer: Buffer,

        filename: string,

        _mimeType: string

    ): Promise<string> {

        await fs.mkdir(

            this.uploadDir,

            { recursive: true }

        );

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(filename)}`;

        await fs.writeFile(

            path.join(this.uploadDir, uniqueName),

            buffer

        );

        return `/uploads/certifications/${uniqueName}`;

    }

}
