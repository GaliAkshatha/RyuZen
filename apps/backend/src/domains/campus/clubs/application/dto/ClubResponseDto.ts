import { ClubStatus } from "../../domain/constants/ClubStatus.js";

export interface ClubResponseDto {

    id: string;

    organizationId: string;

    name: string;

    code: string;

    description?: string;

    logo?: string;

    facultyAdvisorId?: string;

    presidentStudentId?: string;

    vicePresidentStudentId?: string;

    status: ClubStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
