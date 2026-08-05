import { Certificate } from "../../domain/entities/Certificate.js";

export interface ICertificateRepository {

    create(
        certificate: Certificate
    ): Promise<Certificate>;

    findById(
        id: string
    ): Promise<Certificate | null>;

    findByStudent(
        studentId: string
    ): Promise<Certificate[]>;

    /**
     * Batch lookup for organization-wide analytics — Certificate has
     * no organizationId of its own (only studentId), so counting an
     * organization's certificates goes through its real students
     * rather than duplicating organizationId onto Certificate.
     */
    findByStudentIds(
        studentIds: string[]
    ): Promise<Certificate[]>;

}
