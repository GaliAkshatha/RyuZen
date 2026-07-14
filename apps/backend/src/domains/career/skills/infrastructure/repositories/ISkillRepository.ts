import { Skill } from "../../domain/entities/Skill.js";

export interface ISkillRepository {

    create(
        skill: Skill
    ): Promise<Skill>;

    findById(
        id: string
    ): Promise<Skill | null>;

    findByUserId(
        userId: string
    ): Promise<Skill[]>;

    existsByUserIdAndName(
        userId: string,
        name: string
    ): Promise<boolean>;

    save(
        skill: Skill
    ): Promise<Skill>;

    delete(
        id: string
    ): Promise<void>;

}
