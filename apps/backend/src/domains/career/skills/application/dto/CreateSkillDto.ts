import { SkillLevel } from "../../domain/constants/SkillLevel.js";

export interface CreateSkillDto {

    name: string;

    category?: string;

    level?: SkillLevel;

}
