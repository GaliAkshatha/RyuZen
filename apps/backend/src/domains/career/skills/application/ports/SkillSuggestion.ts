export interface SkillSuggestion {

    name: string;

    /** 0-100 - the model's own confidence this is a genuine, evidenced skill, not a guess. */
    confidence: number;

    /** A short, specific explanation of where this was inferred from (e.g. "Used in project 'E-commerce Platform'"). */
    evidence: string;

}
