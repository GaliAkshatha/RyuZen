import { CareerScoreInput } from "./CareerScoreInput.js";
import { CareerScoreInsight } from "./CareerScoreInsight.js";

export interface ICareerScoreProvider {

    generateInsight(

        input: CareerScoreInput

    ): Promise<CareerScoreInsight>;

}
