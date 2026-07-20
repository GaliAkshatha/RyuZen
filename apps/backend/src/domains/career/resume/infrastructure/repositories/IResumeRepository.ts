import { Resume } from "../../domain/entities/Resume.js";

export interface IResumeRepository {

    findByUserId(
        userId: string
    ): Promise<Resume | null>;

    upsert(
        resume: Resume
    ): Promise<Resume>;

}
