import { RecommendationCandidate } from "./RecommendationCandidate.js";
import { RecommendationItem } from "./RecommendationItem.js";

export interface IRecommendationProvider {

    annotate(

        candidates: RecommendationCandidate[]

    ): Promise<RecommendationItem[]>;

}
