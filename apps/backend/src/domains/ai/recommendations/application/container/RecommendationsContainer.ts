import { createRecommendationProvider } from "../../../../../shared/infrastructure/ai/AIProviderFactory.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    ActivityRepository,
} from "../../../../academic/activities/infrastructure/repositories/ActivityRepository.js";

import {
    SubmissionRepository,
} from "../../../../academic/submissions/infrastructure/repositories/SubmissionRepository.js";

import {
    EventRepository,
} from "../../../../campus/events/infrastructure/repositories/EventRepository.js";

import {
    EventRegistrationRepository,
} from "../../../../campus/events/infrastructure/repositories/EventRegistrationRepository.js";

import {
    ClubRepository,
} from "../../../../campus/clubs/infrastructure/repositories/ClubRepository.js";

import {
    ClubMemberRepository,
} from "../../../../campus/clubs/infrastructure/repositories/ClubMemberRepository.js";

import { GetRecommendationsUseCase } from "../use-cases/GetRecommendationsUseCase.js";

const studentRepository = new StudentRepository();

const activityRepository = new ActivityRepository();

const submissionRepository = new SubmissionRepository();

const eventRepository = new EventRepository();

const eventRegistrationRepository = new EventRegistrationRepository();

const clubRepository = new ClubRepository();

const clubMemberRepository = new ClubMemberRepository();

/*
 Real Ollama-backed recommendation reasons (see
 infrastructure/ai/OllamaRecommendationProvider.ts). Every use case
 depends only on the IRecommendationProvider port, so this is the only
 line that ever needed to change to go live.
*/
const recommendationProvider = createRecommendationProvider();

export const recommendationsContainer = {

    getRecommendations:

        new GetRecommendationsUseCase(

            recommendationProvider,

            studentRepository,

            activityRepository,

            submissionRepository,

            eventRepository,

            eventRegistrationRepository,

            clubRepository,

            clubMemberRepository

        )

};
