import { RecommendationType } from "../../domain/constants/RecommendationType.js";

export interface RecommendationItem {

    type: RecommendationType;

    id: string;

    title: string;

    reason: string;

}
