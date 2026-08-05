import { CodingProfileRepository } from "../../infrastructure/repositories/CodingProfileRepository.js";

import { CodeforcesApiClient } from "../../infrastructure/external/CodeforcesApiClient.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import { LinkCodingProfileUseCase } from "../use-cases/LinkCodingProfileUseCase.js";
import { SyncCodingProfileUseCase } from "../use-cases/SyncCodingProfileUseCase.js";
import { GetMyCodingProfilesUseCase } from "../use-cases/GetMyCodingProfilesUseCase.js";
import { SyncAllCodingProfilesUseCase } from "../use-cases/SyncAllCodingProfilesUseCase.js";

import { growthEventRecorder } from "../../../../../shared/infrastructure/growth/growthEventRecorder.js";

const codingProfileRepository = new CodingProfileRepository();

const studentRepository = new StudentRepository();

// Only Codeforces is real right now - it's the only platform with a
// real, stable, official public API (see CodingPlatform.ts).
const codeforcesApiClient = new CodeforcesApiClient();

const syncCodingProfileUseCase = new SyncCodingProfileUseCase(

    codingProfileRepository,

    codeforcesApiClient,

    growthEventRecorder

);

export const codingProfileContainer = {

    linkProfile:

        new LinkCodingProfileUseCase(

            codingProfileRepository,

            studentRepository,

            codeforcesApiClient

        ),

    syncProfile:

        syncCodingProfileUseCase,

    getMyProfiles:

        new GetMyCodingProfilesUseCase(

            codingProfileRepository,

            studentRepository

        ),

    syncAllProfiles:

        new SyncAllCodingProfilesUseCase(

            codingProfileRepository,

            syncCodingProfileUseCase

        )

};
