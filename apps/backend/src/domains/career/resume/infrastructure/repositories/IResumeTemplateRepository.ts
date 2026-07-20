import { ResumeTemplate } from "../../domain/entities/ResumeTemplate.js";

export interface IResumeTemplateRepository {

    create(
        template: ResumeTemplate
    ): Promise<ResumeTemplate>;

    findById(
        id: string
    ): Promise<ResumeTemplate | null>;

    findAll(): Promise<ResumeTemplate[]>;

    existsByName(
        name: string
    ): Promise<boolean>;

    save(
        template: ResumeTemplate
    ): Promise<ResumeTemplate>;

    delete(
        id: string
    ): Promise<void>;

}
