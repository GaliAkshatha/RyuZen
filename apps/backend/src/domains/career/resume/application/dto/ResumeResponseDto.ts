import { ResumeVisibility } from "../../domain/constants/ResumeVisibility.js";

export interface ResumeResponseDto {

    userId: string;

    selectedTemplate?: string;

    resumeUrl?: string;

    lastGeneratedAt?: Date;

    atsScore?: number;

    visibility: ResumeVisibility;

    createdAt?: Date;

    updatedAt?: Date;

}
