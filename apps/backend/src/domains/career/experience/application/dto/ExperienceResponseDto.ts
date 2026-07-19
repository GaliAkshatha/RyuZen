import { EmploymentType } from "../../domain/constants/EmploymentType.js";

export interface ExperienceResponseDto {

    id: string;

    userId: string;

    company: string;

    role: string;

    employmentType?: EmploymentType;

    location?: string;

    startDate: Date;

    endDate?: Date;

    currentlyWorking: boolean;

    description?: string;

    skills: string[];

    createdAt?: Date;

    updatedAt?: Date;

}
