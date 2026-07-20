import { Club } from "../../domain/entities/Club.js";

import { ClientSession } from "mongoose";

export interface IClubRepository {

    create(
        club: Club
    ): Promise<Club>;

    findById(
        id: string
    ): Promise<Club | null>;

    findByOrganization(
        organizationId: string
    ): Promise<Club[]>;

    existsByCode(
        organizationId: string,
        code: string
    ): Promise<boolean>;

    save(
        club: Club
    ): Promise<Club>;

    delete(
        id: string,
        session?: ClientSession
    ): Promise<void>;

}
