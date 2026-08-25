import { News } from "../../domain/entities/News.js";

export interface INewsRepository {

    create(
        news: News
    ): Promise<News>;

    findById(
        id: string
    ): Promise<News | null>;

    /** Real org isolation: every caller only ever sees news scoped to their own organizationId, newest first. */
    findByOrganization(
        organizationId: string
    ): Promise<News[]>;

    delete(
        id: string
    ): Promise<void>;

}
