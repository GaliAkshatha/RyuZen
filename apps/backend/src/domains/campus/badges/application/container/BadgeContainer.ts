import { BadgeRepository } from "../../infrastructure/repositories/BadgeRepository.js";

import { StudentBadgeRepository } from "../../infrastructure/repositories/StudentBadgeRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import { CreateBadgeUseCase } from "../use-cases/CreateBadgeUseCase.js";
import { GetBadgeUseCase } from "../use-cases/GetBadgeUseCase.js";
import { GetBadgesUseCase } from "../use-cases/GetBadgesUseCase.js";
import { UpdateBadgeUseCase } from "../use-cases/UpdateBadgeUseCase.js";
import { DeleteBadgeUseCase } from "../use-cases/DeleteBadgeUseCase.js";
import { AwardBadgeUseCase } from "../use-cases/AwardBadgeUseCase.js";
import { GetStudentBadgesUseCase } from "../use-cases/GetStudentBadgesUseCase.js";

const badgeRepository = new BadgeRepository();

const studentBadgeRepository = new StudentBadgeRepository();

const studentRepository = new StudentRepository();

export const badgeContainer = {

    createBadge:

        new CreateBadgeUseCase(
            badgeRepository
        ),

    getBadge:

        new GetBadgeUseCase(
            badgeRepository
        ),

    getBadges:

        new GetBadgesUseCase(
            badgeRepository
        ),

    updateBadge:

        new UpdateBadgeUseCase(
            badgeRepository
        ),

    deleteBadge:

        new DeleteBadgeUseCase(
            badgeRepository
        ),

    awardBadge:

        new AwardBadgeUseCase(

            badgeRepository,

            studentBadgeRepository,

            studentRepository

        ),

    getStudentBadges:

        new GetStudentBadgesUseCase(

            badgeRepository,

            studentBadgeRepository,

            studentRepository

        )

};
