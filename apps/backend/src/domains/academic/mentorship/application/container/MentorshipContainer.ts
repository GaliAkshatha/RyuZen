import { MentorshipRepository } from "../../infrastructure/repositories/MentorshipRepository.js";

import {
    FacultyRepository,
} from "../../../faculty/infrastructure/repositories/FacultyRepository.js";

import { GetMentorshipUseCase } from "../use-cases/GetMentorshipUseCase.js";
import { GetMentorshipsUseCase } from "../use-cases/GetMentorshipsUseCase.js";
import { UpdateMentorshipUseCase } from "../use-cases/UpdateMentorshipUseCase.js";
import { CompleteMentorshipUseCase } from "../use-cases/CompleteMentorshipUseCase.js";
import { CancelMentorshipUseCase } from "../use-cases/CancelMentorshipUseCase.js";

const mentorshipRepository = new MentorshipRepository();

const facultyRepository = new FacultyRepository();

export const mentorshipContainer = {

    getMentorship:

        new GetMentorshipUseCase(
            mentorshipRepository
        ),

    getMentorships:

        new GetMentorshipsUseCase(
            mentorshipRepository,
            facultyRepository
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
