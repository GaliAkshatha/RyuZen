import { Assessment } from "../../domain/entities/Assessment.js";

export interface IAssessmentRepository {

    create(assessment: Assessment): Promise<Assessment>;

    findById(id: string): Promise<Assessment | null>;

    findByOrganization(organizationId: string): Promise<Assessment[]>;

    save(assessment: Assessment): Promise<Assessment>;

}
