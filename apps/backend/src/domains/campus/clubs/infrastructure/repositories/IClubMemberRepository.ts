import { ClubMember } from "../../domain/entities/ClubMember.js";

import { ClientSession } from "mongoose";

export interface IClubMemberRepository {

    create(
        member: ClubMember
    ): Promise<ClubMember>;

    findById(
        id: string
    ): Promise<ClubMember | null>;

    findByClub(
        clubId: string
    ): Promise<ClubMember[]>;

    findByStudent(
        studentId: string
    ): Promise<ClubMember[]>;

    existsByClubAndStudent(
        clubId: string,
        studentId: string
    ): Promise<boolean>;

    save(
        member: ClubMember
    ): Promise<ClubMember>;

    delete(
        id: string
    ): Promise<void>;

    deleteByClub(
        clubId: string,
        session?: ClientSession
    ): Promise<void>;

}
