import { RecruiterStatus } from "../../domain/constants/RecruiterStatus.js";

export interface RecruiterResponseDto {

    id: string;

    organizationId: string;

    userId: string;

    companyId: string;

    jobTitle?: string;

    status: RecruiterStatus;

    createdAt?: Date;

}
