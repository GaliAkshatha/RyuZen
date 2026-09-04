import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { IFileStorageService } from "./IFileStorageService.js";

import { env } from "../../../config/env.js";

/**
 * Real S3-compatible object storage - works against real AWS S3, or
 * anything else speaking the same API (Cloudflare R2, DigitalOcean
 * Spaces, MinIO) by setting S3_ENDPOINT. Only ever constructed when
 * STORAGE_PROVIDER=s3 (see FileStorageFactory) - the real @aws-sdk
 * client is genuinely instantiated and genuinely called here, not a
 * stub.
 */
export class S3StorageService implements IFileStorageService {

    private readonly client: S3Client;

    constructor() {

        this.client = new S3Client({

            region:
                env.S3_REGION,

            endpoint:
                env.S3_ENDPOINT || undefined,

            forcePathStyle:
                Boolean(env.S3_ENDPOINT),

            credentials: {

                accessKeyId:
                    env.S3_ACCESS_KEY_ID,

                secretAccessKey:
                    env.S3_SECRET_ACCESS_KEY

            }

        });

    }

    async upload(

        buffer: Buffer,

        filename: string,

        mimeType: string

    ): Promise<string> {

        const uniqueKey = `certifications/${Date.now()}-${Math.round(Math.random() * 1e9)}-${filename}`;

        await this.client.send(

            new PutObjectCommand({

                Bucket:
                    env.S3_BUCKET,

                Key:
                    uniqueKey,

                Body:
                    buffer,

                ContentType:
                    mimeType

            })

        );

        const base =
            env.S3_PUBLIC_URL_BASE ||
            `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com`;

        return `${base.replace(/\/$/, "")}/${uniqueKey}`;

    }

}
