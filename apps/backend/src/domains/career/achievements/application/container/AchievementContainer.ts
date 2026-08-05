import { AchievementRepository } from "../../infrastructure/repositories/AchievementRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import { CreateAchievementUseCase } from "../use-cases/CreateAchievementUseCase.js";
import { GetAchievementUseCase } from "../use-cases/GetAchievementUseCase.js";
import { GetAchievementsUseCase } from "../use-cases/GetAchievementsUseCase.js";
import { GetMyAchievementsUseCase } from "../use-cases/GetMyAchievementsUseCase.js";
import { GetAchievementsByStudentUseCase } from "../use-cases/GetAchievementsByStudentUseCase.js";
import { UpdateAchievementUseCase } from "../use-cases/UpdateAchievementUseCase.js";
import { DeleteAchievementUseCase } from "../use-cases/DeleteAchievementUseCase.js";
import { VerifyAchievementUseCase } from "../use-cases/VerifyAchievementUseCase.js";
import {
    notificationContainer,
} from "../../../../communication/notifications/application/container/NotificationContainer.js";
import { RejectAchievementUseCase } from "../use-cases/RejectAchievementUseCase.js";

import { growthEventRecorder } from "../../../../../shared/infrastructure/growth/growthEventRecorder.js";

const achievementRepository = new AchievementRepository();

const studentRepository = new StudentRepository();

export const achievementContainer = {

    createAchievement:

        new CreateAchievementUseCase(

            achievementRepository,

            studentRepository

        ),

    getAchievement:

        new GetAchievementUseCase(
            achievementRepository
        ),

    getAchievements:

        new GetAchievementsUseCase(
            achievementRepository
        ),

    getMyAchievements:

        new GetMyAchievementsUseCase(

            achievementRepository,

            studentRepository

        ),

    getAchievementsByStudent:

        new GetAchievementsByStudentUseCase(

            achievementRepository,

            studentRepository

        ),

    updateAchievement:

        new UpdateAchievementUseCase(

            achievementRepository,

            studentRepository

        ),

    deleteAchievement:

        new DeleteAchievementUseCase(

            achievementRepository,

            studentRepository

        ),

    verifyAchievement:

        new VerifyAchievementUseCase(
            achievementRepository,
            studentRepository,
            notificationContainer.recordSystemNotification,
            growthEventRecorder
        ),

    rejectAchievement:

        new RejectAchievementUseCase(
            achievementRepository
        )

};
