import { EmploymentType } from "../../domain/constants/EmploymentType.js";

export interface CreateExperienceDto {

    company: string;

    role: string;

    employmentType?: EmploymentType;

    location?: string;

    startDate: Date;

    endDate?: Date;

    currentlyWorking?: boolean;

    description?: string;

    skills?: string[];

}
