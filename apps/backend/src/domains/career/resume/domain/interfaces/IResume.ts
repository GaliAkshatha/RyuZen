import { ResumeVisibility } from "../constants/ResumeVisibility.js";

export interface IResume {

    id?: string;

    userId: string;

    selectedTemplate?: string;

    resumeUrl?: string;

    lastGeneratedAt?: Date;

    atsScore?: number;

    visibility: ResumeVisibility;

    createdAt?: Date;

    updatedAt?: Date;

}
