import { SkillLevel } from "../constants/SkillLevel.js";

export interface ISkill {

    id?: string;

    userId: string;

    name: string;

    category?: string;

    level?: SkillLevel;

    verified: boolean;

    createdAt?: Date;

    updatedAt?: Date;

}
