import { RecommendationType } from "../../domain/constants/RecommendationType.js";

export interface RecommendationCandidate {

    type: RecommendationType;

    id: string;

    title: string;

}
