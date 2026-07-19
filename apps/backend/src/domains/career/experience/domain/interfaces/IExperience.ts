import { EmploymentType } from "../constants/EmploymentType.js";

export interface IExperience {

    id?: string;

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
