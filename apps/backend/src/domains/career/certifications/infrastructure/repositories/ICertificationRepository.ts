import { Certification } from "../../domain/entities/Certification.js";

export interface ICertificationRepository {

    create(
        certification: Certification
    ): Promise<Certification>;

    findById(
        id: string
    ): Promise<Certification | null>;

    findByUserId(
        userId: string
    ): Promise<Certification[]>;

    save(
        certification: Certification
    ): Promise<Certification>;

    delete(
        id: string
    ): Promise<void>;

}
