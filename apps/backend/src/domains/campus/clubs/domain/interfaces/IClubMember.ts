import { ClubMemberRole } from "../constants/ClubMemberRole.js";
import { ClubMemberStatus } from "../constants/ClubMemberStatus.js";

export interface IClubMember {

    id?: string;

    clubId: string;

    studentId: string;

    role: ClubMemberRole;

    joinedAt: Date;

    status: ClubMemberStatus;

}
