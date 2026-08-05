import { LeaderboardRepository } from "../../infrastructure/repositories/LeaderboardRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    SubmissionRepository,
} from "../../../../academic/submissions/infrastructure/repositories/SubmissionRepository.js";

import {
    EventRepository,
} from "../../../events/infrastructure/repositories/EventRepository.js";

import {
    EventRegistrationRepository,
} from "../../../events/infrastructure/repositories/EventRegistrationRepository.js";

import { RecalculateLeaderboardUseCase } from "../use-cases/RecalculateLeaderboardUseCase.js";
import { GetLeaderboardUseCase } from "../use-cases/GetLeaderboardUseCase.js";
import { GetLeaderboardEntryUseCase } from "../use-cases/GetLeaderboardEntryUseCase.js";
import { GetMyLeaderboardEntryUseCase } from "../use-cases/GetMyLeaderboardEntryUseCase.js";
import { AdjustLeaderboardPointsUseCase } from "../use-cases/AdjustLeaderboardPointsUseCase.js";
import {
    pointLedgerContainer,
} from "../../../point-ledger/application/container/PointLedgerContainer.js";

const leaderboardRepository = new LeaderboardRepository();

const studentRepository = new StudentRepository();

const submissionRepository = new SubmissionRepository();

const eventRepository = new EventRepository();

const eventRegistrationRepository = new EventRegistrationRepository();

export const leaderboardContainer = {

    recalculateLeaderboard:

        new RecalculateLeaderboardUseCase(

            leaderboardRepository,

            studentRepository,

            submissionRepository,

            eventRepository,

            eventRegistrationRepository

        ),

    getLeaderboard:

        new GetLeaderboardUseCase(
            leaderboardRepository
        ),

    getLeaderboardEntry:

        new GetLeaderboardEntryUseCase(
            leaderboardRepository
        ),

    getMyLeaderboardEntry:

        new GetMyLeaderboardEntryUseCase(

            leaderboardRepository,

            studentRepository

        ),

    adjustLeaderboardPoints:

        new AdjustLeaderboardPointsUseCase(

            leaderboardRepository,

            studentRepository,

            pointLedgerContainer.recordPointTransaction

        )

};
