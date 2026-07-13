import { Mentorship } from "../../domain/entities/Mentorship.js";

export interface MentorshipFilters {

    studentId?: string;

    facultyId?: string;

    status?: string;

}

export interface IMentorshipRepository {

    create(
        mentorship: Mentorship
    ): Promise<Mentorship>;

    findById(
        id: string
    ): Promise<Mentorship | null>;

    findActiveByStudentId(
        studentId: string
    ): Promise<Mentorship | null>;

    findByOrganization(
        organizationId: string,
        filters: MentorshipFilters
    ): Promise<Mentorship[]>;

    save(
        mentorship: Mentorship
    ): Promise<Mentorship>;

}
