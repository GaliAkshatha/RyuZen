import { SkillLevel } from "../../domain/constants/SkillLevel.js";

export interface SkillResponseDto {

    id: string;

    userId: string;

    name: string;

    category?: string;

    level?: SkillLevel;

    verified: boolean;

    createdAt?: Date;

    updatedAt?: Date;

}
