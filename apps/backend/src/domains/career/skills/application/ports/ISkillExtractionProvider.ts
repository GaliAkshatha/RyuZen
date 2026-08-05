import { SkillExtractionInput } from "./SkillExtractionInput.js";
import { SkillSuggestion } from "./SkillSuggestion.js";

export interface ISkillExtractionProvider {

    extract(
        input: SkillExtractionInput
    ): Promise<SkillSuggestion[]>;

}
