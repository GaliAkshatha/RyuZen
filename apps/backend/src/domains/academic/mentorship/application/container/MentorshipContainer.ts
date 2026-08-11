import { MentorshipRepository } from "../../infrastructure/repositories/MentorshipRepository.js";

import {
    FacultyRepository,
} from "../../../faculty/infrastructure/repositories/FacultyRepository.js";

import {
    StudentRepository,
} from "../../../students/infrastructure/repositories/StudentRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { GetMentorshipUseCase } from "../use-cases/GetMentorshipUseCase.js";
import { GetMentorshipsUseCase } from "../use-cases/GetMentorshipsUseCase.js";
import { UpdateMentorshipUseCase } from "../use-cases/UpdateMentorshipUseCase.js";
import { CompleteMentorshipUseCase } from "../use-cases/CompleteMentorshipUseCase.js";
import { CancelMentorshipUseCase } from "../use-cases/CancelMentorshipUseCase.js";

const mentorshipRepository = new MentorshipRepository();

const facultyRepository = new FacultyRepository();

const studentRepository = new StudentRepository();

const userRepository = new UserRepository();

export const mentorshipContainer = {

    getMentorship:

        new GetMentorshipUseCase(
            mentorshipRepository,
            studentRepository,
            userRepository
        ),

    getMentorships:

        new GetMentorshipsUseCase(
            mentorshipRepository,
            facultyRepository,
            studentRepository,
            userRepository
        ),

    updateMentorship:

        new UpdateMentorshipUseCase(
            mentorshipRepository
        ),

    completeMentorship:

        new CompleteMentorshipUseCase(
            mentorshipRepository
        ),

    cancelMentorship:

        new CancelMentorshipUseCase(
            mentorshipRepository
        )

};
