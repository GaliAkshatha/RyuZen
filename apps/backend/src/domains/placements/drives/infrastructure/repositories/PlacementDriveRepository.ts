import { PlacementDrive } from "../../domain/entities/PlacementDrive.js";

import { PlacementDriveModel } from "../persistence/PlacementDriveModel.js";

import { PlacementDriveMapper } from "../mappers/PlacementDriveMapper.js";

import { IPlacementDriveRepository, PlacementDriveFilters } from "./IPlacementDriveRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class PlacementDriveRepository extends BaseRepository<PlacementDrive>
implements IPlacementDriveRepository {

    async create(

        drive: PlacementDrive

    ): Promise<PlacementDrive> {

        const document =

            await PlacementDriveModel.create(

                PlacementDriveMapper.toPersistence(

                    drive

                )

            );

        return PlacementDriveMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<PlacementDrive | null> {

        const document =

            await PlacementDriveModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return PlacementDriveMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: PlacementDriveFilters

    ): Promise<PlacementDrive[]> {

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.companyId) {

            query.companyId =

                filters.companyId;

        }

        if (filters.status) {

            query.status =

                filters.status;

        }

        const documents =

            await PlacementDriveModel.find(query)

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                PlacementDriveMapper.toDomain(
                    document
                )

        );

    }

    async save(

        drive: PlacementDrive

    ): Promise<PlacementDrive> {

        const document =

            await PlacementDriveModel.findByIdAndUpdate(

                drive.id,

                PlacementDriveMapper.toPersistence(

                    drive

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Placement drive not found."

            );

        }

        return PlacementDriveMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await PlacementDriveModel.findByIdAndDelete(

            id

        );

    }

}
