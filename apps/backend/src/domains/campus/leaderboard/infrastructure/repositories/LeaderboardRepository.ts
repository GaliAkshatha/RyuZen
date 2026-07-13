import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry.js";

import { LeaderboardEntryModel } from "../persistence/LeaderboardEntryModel.js";

import { LeaderboardEntryMapper } from "../mappers/LeaderboardEntryMapper.js";

import { ILeaderboardRepository } from "./ILeaderboardRepository.js";

export class LeaderboardRepository
implements ILeaderboardRepository {

    async findByOrganization(

        organizationId: string

    ): Promise<LeaderboardEntry[]> {

        const documents =

            await LeaderboardEntryModel.find({

                organizationId

            })

                .sort({

                    rank: 1

                });

        return documents.map(

            document =>

                LeaderboardEntryMapper.toDomain(
                    document
                )

        );

    }

    async findByStudentId(

        organizationId: string,

        studentId: string

    ): Promise<LeaderboardEntry | null> {

        const document =

            await LeaderboardEntryModel.findOne({

                organizationId,

                studentId

            });

        if (!document) {

            return null;

        }

        return LeaderboardEntryMapper.toDomain(

            document

        );

    }

    async upsert(

        entry: LeaderboardEntry

    ): Promise<LeaderboardEntry> {

        const document =

            await LeaderboardEntryModel.findOneAndUpdate(

                {

                    organizationId:
                        entry.organizationId,

                    studentId:
                        entry.studentId

                },

                LeaderboardEntryMapper.toPersistence(

                    entry

                ),

                {

                    new: true,

                    upsert: true,

                    setDefaultsOnInsert: true

                }

            );

        return LeaderboardEntryMapper.toDomain(

            document

        );

    }

    async reRank(

        organizationId: string

    ): Promise<LeaderboardEntry[]> {

        const documents =

            await LeaderboardEntryModel.find({

                organizationId

            })

                .sort({

                    totalPoints: -1

                });

        for (let index = 0; index < documents.length; index++) {

            const rank =

                index + 1;

            if (documents[index].rank !== rank) {

                documents[index].rank =

                    rank;

                await documents[index].save();

            }

        }

        return documents.map(

            document =>

                LeaderboardEntryMapper.toDomain(
                    document
                )

        );

    }

}
