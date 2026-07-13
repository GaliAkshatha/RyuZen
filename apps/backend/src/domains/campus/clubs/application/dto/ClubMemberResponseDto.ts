import { ClubMemberRole } from "../../domain/constants/ClubMemberRole.js";
import { ClubMemberStatus } from "../../domain/constants/ClubMemberStatus.js";

export interface ClubMemberResponseDto {

    id: string;

    clubId: string;

    studentId: string;

    role: ClubMemberRole;

    joinedAt: Date;

    status: ClubMemberStatus;

}
