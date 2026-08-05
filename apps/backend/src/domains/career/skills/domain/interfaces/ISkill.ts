import { SkillLevel } from "../constants/SkillLevel.js";
import { SkillSource } from "../constants/SkillSource.js";

export interface ISkill {

    id?: string;

    userId: string;

    name: string;

    category?: string;

    level?: SkillLevel;

    verified: boolean;

    /**
     * MANUAL (the original, only path before AI skill extraction) or
     * AI_SUGGESTED. Existing records default to MANUAL via the mapper
     * (see SkillMapper.ts), so nothing about pre-existing skills
     * changes behavior.
     */
    source: SkillSource;

    /** Only set when source is AI_SUGGESTED — the model's own 0-100 confidence in this suggestion. */
    confidence?: number;

    /** Only set when source is AI_SUGGESTED — a short, real explanation of where this skill was inferred from (e.g. "Mentioned in project 'E-commerce Platform'"). */
    evidence?: string;

    /**
     * MANUAL skills are approved=true at creation (the student typed
     * it themselves — there is nothing to approve). AI_SUGGESTED
     * skills start approved=false and only count as a real skill
     * (visible in GetSkillsByUserUseCase, counted toward Resume/Career
     * Score) once the student explicitly approves the suggestion.
     * This is a different, orthogonal concept from `verified`, which
     * is a faculty/admin confirming a skill's legitimacy after the
     * fact — a skill can be approved (student confirmed the AI got it
     * right) without yet being verified (no authority has signed off).
     */
    approved: boolean;

    createdAt?: Date;

    updatedAt?: Date;

}
