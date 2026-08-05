import { RecruiterRepository } from "../../infrastructure/repositories/RecruiterRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import {
    CompanyRepository,
} from "../../../companies/infrastructure/repositories/CompanyRepository.js";

import {
    PlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/PlacementDriveRepository.js";

import {
    JobApplicationRepository,
} from "../../../applications/infrastructure/repositories/JobApplicationRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    SkillRepository,
} from "../../../../career/skills/infrastructure/repositories/SkillRepository.js";

import { CreateRecruiterUseCase } from "../use-cases/CreateRecruiterUseCase.js";
import { GetApplicantsForRecruiterUseCase } from "../use-cases/GetApplicantsForRecruiterUseCase.js";
import { SearchApplicantsUseCase } from "../use-cases/SearchApplicantsUseCase.js";

const recruiterRepository = new RecruiterRepository();

const userRepository = new UserRepository();

const companyRepository = new CompanyRepository();

const placementDriveRepository = new PlacementDriveRepository();

const jobApplicationRepository = new JobApplicationRepository();

const studentRepository = new StudentRepository();

const skillRepository = new SkillRepository();

export const recruiterContainer = {

    createRecruiter:

        new CreateRecruiterUseCase(

            recruiterRepository,

            userRepository,

            companyRepository

        ),

    getApplicantsForRecruiter:

        new GetApplicantsForRecruiterUseCase(

            recruiterRepository,

            placementDriveRepository,

            jobApplicationRepository

        ),

    searchApplicants:

        new SearchApplicantsUseCase(

            recruiterRepository,

            placementDriveRepository,

            jobApplicationRepository,

            studentRepository,

            skillRepository

        )

};
