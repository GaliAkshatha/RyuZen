import { Club } from "../../domain/entities/Club.js";

import { ClubModel } from "../persistence/ClubModel.js";

import { ClubMapper } from "../mappers/ClubMapper.js";

import { IClubRepository } from "./IClubRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class ClubRepository extends BaseRepository<Club>
implements IClubRepository {

    async create(

        club: Club

    ): Promise<Club> {

        const document =

            await ClubModel.create(

                ClubMapper.toPersistence(

                    club

                )

            );

        return ClubMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Club | null> {

        const document =

            await ClubModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return ClubMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string

    ): Promise<Club[]> {

        const documents =

            await ClubModel.find({

                organizationId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                ClubMapper.toDomain(
                    document
                )

        );

    }

    async existsByCode(

        organizationId: string,

        code: string

    ): Promise<boolean> {

        const document =

            await ClubModel.findOne({

                organizationId,

                code: code.toUpperCase()

            });

        return !!document;

    }

    async save(

        club: Club

    ): Promise<Club> {

        const document =

            await ClubModel.findByIdAndUpdate(

                club.id,

                ClubMapper.toPersistence(

                    club

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Club not found."

            );

        }

        return ClubMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await ClubModel.findByIdAndDelete(

            id

        );

    }

}
