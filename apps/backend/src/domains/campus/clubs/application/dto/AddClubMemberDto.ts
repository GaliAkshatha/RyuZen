import { ClubMemberRole } from "../../domain/constants/ClubMemberRole.js";

export interface AddClubMemberDto {

    studentId: string;

    role?: ClubMemberRole;

}
