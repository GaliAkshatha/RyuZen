import { IFileStorageService } from "./IFileStorageService.js";
import { LocalDiskStorageService } from "./LocalDiskStorageService.js";
import { S3StorageService } from "./S3StorageService.js";

import { env } from "../../../config/env.js";

/**
 * The one real switch point - everything else in the app depends on
 * IFileStorageService, never on which implementation is active.
 * Defaults to local disk (STORAGE_PROVIDER unset or "local"),
 * matching this project's original behavior exactly - only switches
 * to real S3-compatible storage when explicitly configured.
 */
export function createFileStorageService(): IFileStorageService {

    if (env.STORAGE_PROVIDER === "s3") {

        return new S3StorageService();

    }

    return new LocalDiskStorageService();

}
