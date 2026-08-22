import { RecruiterCandidateAccessService } from "../services/RecruiterCandidateAccessService.js";

import {
    RecruiterRepository,
} from "../../domains/placements/recruiters/infrastructure/repositories/RecruiterRepository.js";
import {
    PlacementDriveRepository,
} from "../../domains/placements/drives/infrastructure/repositories/PlacementDriveRepository.js";
import {
    StudentRepository,
} from "../../domains/academic/students/infrastructure/repositories/StudentRepository.js";
import {
    JobApplicationRepository,
} from "../../domains/placements/applications/infrastructure/repositories/JobApplicationRepository.js";

/**
 * The one real, shared instance of RecruiterCandidateAccessService -
 * a genuine cross-domain concern owned by none of the 3 domains that
 * depend on it (ai/career-score, career/resume, ai/interview), so it
 * gets its own home rather than being instantiated 3 separate times
 * inside whichever domain happened to need it first.
 */
const recruiterRepository = new RecruiterRepository();

const placementDriveRepository = new PlacementDriveRepository();

const studentRepository = new StudentRepository();

const jobApplicationRepository = new JobApplicationRepository();

export const recruiterCandidateAccessService = new RecruiterCandidateAccessService(
    recruiterRepository,
    placementDriveRepository,
    studentRepository,
    jobApplicationRepository,
);
