import { AchievementLevel } from "../../domain/constants/AchievementLevel.js";
import { AchievementStatus } from "../../domain/constants/AchievementStatus.js";

export interface AchievementResponseDto {

    id: string;

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
