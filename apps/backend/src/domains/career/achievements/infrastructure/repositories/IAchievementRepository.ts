import { Achievement } from "../../domain/entities/Achievement.js";

export interface AchievementFilters {

    status?: string;

}

export interface IAchievementRepository {

    create(
        achievement: Achievement
    ): Promise<Achievement>;

    findById(
        id: string
    ): Promise<Achievement | null>;

    findByStudent(
        studentId: string,
        filters: AchievementFilters
    ): Promise<Achievement[]>;

    findByOrganization(
        organizationId: string,
        filters: AchievementFilters
    ): Promise<Achievement[]>;

    save(
        achievement: Achievement
    ): Promise<Achievement>;

    delete(
        id: string
    ): Promise<void>;

}
