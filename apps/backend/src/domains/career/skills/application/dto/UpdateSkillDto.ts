import { SkillLevel } from "../../domain/constants/SkillLevel.js";

export interface UpdateSkillDto {

    name?: string;

    category?: string;

    level?: SkillLevel;

}
