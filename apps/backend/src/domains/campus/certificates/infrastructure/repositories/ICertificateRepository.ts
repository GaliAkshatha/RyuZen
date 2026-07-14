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

}
