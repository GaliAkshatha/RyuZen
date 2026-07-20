import { AchievementLevel } from "../constants/AchievementLevel.js";
import { AchievementStatus } from "../constants/AchievementStatus.js";

export interface IAchievement {

    id?: string;

    organizationId: string;

    studentId: string;

    facultyId?: string;

    title: string;

    description?: string;

    category?: string;

    level?: AchievementLevel;

    position?: string;

    certificateUrl?: string;

    proofUrl?: string;

    achievementDate: Date;

    verifiedBy?: string;

    status: AchievementStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
