export interface IFileStorageService {

    /**
     * Persists a real file buffer and returns a real, durable URL it
     * can be reached at afterward. Implementations decide where that
     * actually lives (local disk, S3-compatible object storage) - the
     * caller never needs to know which.
     */
    upload(

        buffer: Buffer,

        filename: string,

        mimeType: string

    ): Promise<string>;

}
