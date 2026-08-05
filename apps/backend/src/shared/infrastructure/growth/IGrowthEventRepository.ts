import { GrowthEvent } from "./GrowthEvent.js";

export interface IGrowthEventRepository {

    /** The only write - genuinely append-only, no update/delete exists here at all. */
    create(
        event: GrowthEvent
    ): Promise<GrowthEvent>;

    /** One real student's full timeline, most recent first - the actual "Growth Profile" a UI or an AI feature would read. */
    findByStudentId(
        organizationId: string,
        studentId: string
    ): Promise<GrowthEvent[]>;

    /** Every event from one real domain across the organization - for future analytics/AI consumers, not exposed as a general query API. */
    findByDomain(
        organizationId: string,
        domain: string
    ): Promise<GrowthEvent[]>;

}
