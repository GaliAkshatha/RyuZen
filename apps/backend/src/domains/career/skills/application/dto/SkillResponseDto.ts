import { SkillLevel } from "../../domain/constants/SkillLevel.js";
import { SkillSource } from "../../domain/constants/SkillSource.js";

export interface SkillResponseDto {

    id: string;

    userId: string;

    name: string;

    category?: string;

    level?: SkillLevel;

    verified: boolean;

    source: SkillSource;

    confidence?: number;

    evidence?: string;

    approved: boolean;

    createdAt?: Date;

    updatedAt?: Date;

}
