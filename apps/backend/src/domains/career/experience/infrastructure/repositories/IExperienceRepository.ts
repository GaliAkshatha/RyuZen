import { Experience } from "../../domain/entities/Experience.js";

export interface IExperienceRepository {

    create(
        experience: Experience
    ): Promise<Experience>;

    findById(
        id: string
    ): Promise<Experience | null>;

    findByUserId(
        userId: string
    ): Promise<Experience[]>;

    save(
        experience: Experience
    ): Promise<Experience>;

    delete(
        id: string
    ): Promise<void>;

}
