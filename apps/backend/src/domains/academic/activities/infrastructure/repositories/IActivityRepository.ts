import { Activity } from "../../domain/entities/Activity.js";
import { ActivityFilter } from "../../application/dto/ActivityFilter.js";

export interface IActivityRepository {

    create(
        activity: Activity
    ): Promise<Activity>;

    findById(
        id: string
    ): Promise<Activity | null>;

    findAll(
        filter: ActivityFilter
    ): Promise<Activity[]>;

    save(
        activity: Activity
    ): Promise<Activity>;

    delete(
        id: string
    ): Promise<void>;

}