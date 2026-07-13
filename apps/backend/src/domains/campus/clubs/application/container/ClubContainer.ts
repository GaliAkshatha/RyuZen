import { ClubRepository } from "../../infrastructure/repositories/ClubRepository.js";

import { ClubMemberRepository } from "../../infrastructure/repositories/ClubMemberRepository.js";

import {
    FacultyRepository,
} from "../../../../academic/faculty/infrastructure/repositories/FacultyRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import { CreateClubUseCase } from "../use-cases/CreateClubUseCase.js";
import { GetClubUseCase } from "../use-cases/GetClubUseCase.js";
import { GetClubsUseCase } from "../use-cases/GetClubsUseCase.js";
import { UpdateClubUseCase } from "../use-cases/UpdateClubUseCase.js";
import { DeleteClubUseCase } from "../use-cases/DeleteClubUseCase.js";
import { AssignAdvisorUseCase } from "../use-cases/AssignAdvisorUseCase.js";
import { AddClubMemberUseCase } from "../use-cases/AddClubMemberUseCase.js";
import { RemoveClubMemberUseCase } from "../use-cases/RemoveClubMemberUseCase.js";
import { GetClubMembersUseCase } from "../use-cases/GetClubMembersUseCase.js";

const clubRepository = new ClubRepository();

const clubMemberRepository = new ClubMemberRepository();

const facultyRepository = new FacultyRepository();

const studentRepository = new StudentRepository();

export const clubContainer = {

    createClub:

        new CreateClubUseCase(

            clubRepository,

            facultyRepository

        ),

    getClub:

        new GetClubUseCase(
            clubRepository
        ),

    getClubs:

        new GetClubsUseCase(
            clubRepository
        ),

    updateClub:

        new UpdateClubUseCase(
            clubRepository
        ),

    deleteClub:

        new DeleteClubUseCase(

            clubRepository,

            clubMemberRepository

        ),

    assignAdvisor:

        new AssignAdvisorUseCase(

            clubRepository,

            facultyRepository

        ),

    addClubMember:

        new AddClubMemberUseCase(

            clubRepository,

            clubMemberRepository,

            studentRepository

        ),

    removeClubMember:

        new RemoveClubMemberUseCase(

            clubRepository,

            clubMemberRepository

        ),

    getClubMembers:

        new GetClubMembersUseCase(

            clubRepository,

            clubMemberRepository

        )

};
