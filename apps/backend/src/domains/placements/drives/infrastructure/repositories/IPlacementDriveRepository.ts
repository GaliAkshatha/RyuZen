import { PlacementDrive } from "../../domain/entities/PlacementDrive.js";

export interface PlacementDriveFilters {

    companyId?: string;

    status?: string;

}

export interface IPlacementDriveRepository {

    create(
        drive: PlacementDrive
    ): Promise<PlacementDrive>;

    findById(
        id: string
    ): Promise<PlacementDrive | null>;

    findByOrganization(
        organizationId: string,
        filters: PlacementDriveFilters
    ): Promise<PlacementDrive[]>;

    save(
        drive: PlacementDrive
    ): Promise<PlacementDrive>;

    delete(
        id: string
    ): Promise<void>;

}
