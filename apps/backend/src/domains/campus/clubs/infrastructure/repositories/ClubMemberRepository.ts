import { ClubMember } from "../../domain/entities/ClubMember.js";

import { ClientSession } from "mongoose";

import { ClubMemberModel } from "../persistence/ClubMemberModel.js";

import { ClubMemberMapper } from "../mappers/ClubMemberMapper.js";

import { IClubMemberRepository } from "./IClubMemberRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class ClubMemberRepository extends BaseRepository<ClubMember>
implements IClubMemberRepository {

    async create(

        member: ClubMember

    ): Promise<ClubMember> {

        const document =

            await ClubMemberModel.create(

                ClubMemberMapper.toPersistence(

                    member

                )

            );

        return ClubMemberMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<ClubMember | null> {

        const document =

            await ClubMemberModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return ClubMemberMapper.toDomain(

            document

        );

    }

    async findByClub(

        clubId: string

    ): Promise<ClubMember[]> {

        const documents =

            await ClubMemberModel.find({

                clubId

            })

                .sort({

                    joinedAt: -1

                });

        return documents.map(

            document =>

                ClubMemberMapper.toDomain(
                    document
                )

        );

    }

    async findByStudent(

        studentId: string

    ): Promise<ClubMember[]> {

        const documents =

            await ClubMemberModel.find({

                studentId

            })

                .sort({

                    joinedAt: -1

                });

        return documents.map(

            document =>

                ClubMemberMapper.toDomain(
                    document
                )

        );

    }

    async existsByClubAndStudent(

        clubId: string,

        studentId: string

    ): Promise<boolean> {

        const document =

            await ClubMemberModel.findOne({

                clubId,

                studentId

            });

        return !!document;

    }

    async save(

        member: ClubMember

    ): Promise<ClubMember> {

        const document =

            await ClubMemberModel.findByIdAndUpdate(

                member.id,

                ClubMemberMapper.toPersistence(

                    member

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Club member not found."

            );

        }

        return ClubMemberMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await ClubMemberModel.findByIdAndDelete(

            id

        );

    }

    async deleteByClub(

        clubId: string,

        session?: ClientSession

    ): Promise<void> {

        await ClubMemberModel.deleteMany({

            clubId

        }).session(

            session ?? null

        );

    }

}
