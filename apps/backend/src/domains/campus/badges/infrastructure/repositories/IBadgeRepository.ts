import { Badge } from "../../domain/entities/Badge.js";

export interface IBadgeRepository {

    create(
        badge: Badge
    ): Promise<Badge>;

    findById(
        id: string
    ): Promise<Badge | null>;

    findAll(): Promise<Badge[]>;

    existsByName(
        name: string
    ): Promise<boolean>;

    save(
        badge: Badge
    ): Promise<Badge>;

    delete(
        id: string
    ): Promise<void>;

}
