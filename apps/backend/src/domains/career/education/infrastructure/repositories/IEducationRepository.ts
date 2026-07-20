import { Education } from "../../domain/entities/Education.js";

export interface IEducationRepository {

    create(
        education: Education
    ): Promise<Education>;

    findById(
        id: string
    ): Promise<Education | null>;

    findByUserId(
        userId: string
    ): Promise<Education[]>;

    save(
        education: Education
    ): Promise<Education>;

    delete(
        id: string
    ): Promise<void>;

}
