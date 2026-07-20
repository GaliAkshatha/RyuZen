import { AchievementLevel } from "../../domain/constants/AchievementLevel.js";

export interface CreateAchievementDto {

    title: string;

    description?: string;

    category?: string;

    level?: AchievementLevel;

    position?: string;

    certificateUrl?: string;

    proofUrl?: string;

    achievementDate: Date;

}
