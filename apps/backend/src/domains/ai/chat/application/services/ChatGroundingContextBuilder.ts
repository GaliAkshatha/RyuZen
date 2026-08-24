import { IStudentRepository } from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";
import { IActivityRepository } from "../../../../academic/activities/infrastructure/repositories/IActivityRepository.js";
import {
    IPlacementDriveRepository,
} from "../../../../placements/drives/infrastructure/repositories/IPlacementDriveRepository.js";

import { ActivityStatus } from "../../../../academic/activities/domain/constants/ActivityStatus.js";
import { PlacementDriveStatus } from "../../../../placements/drives/domain/constants/PlacementDriveStatus.js";

import { isStudentEligibleForActivity } from "../../../../academic/activities/domain/services/isStudentEligibleForActivity.js";
import { isStudentEligibleForDrive } from "../../../../placements/drives/domain/services/isStudentEligibleForDrive.js";

import { GetCareerScoreUseCase } from "../../../career-score/application/use-cases/GetCareerScoreUseCase.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const MAX_ITEMS_PER_LIST = 6;

/**
 * Real, structured grounding for the AI chat - not RAG or GraphRAG
 * (this platform's data is already structured and shallow-relational,
 * not a large unstructured or loosely-connected corpus; a full
 * retrieval pipeline would be real over-engineering here). Instead,
 * this fetches the caller's own genuinely relevant, currently-open
 * records via the exact same real eligibility rules already enforced
 * elsewhere (isStudentEligibleForActivity, isStudentEligibleForDrive,
 * GetCareerScoreUseCase) and folds a compact summary into the system
 * prompt, so the assistant can answer real questions like "what can I
 * still join" or "am I eligible for X" grounded in the student's
 * actual, current state - instead of the generic, ungrounded answers
 * it could only give before.
 *
 * Only STUDENT gets this treatment for now - the other roles this
 * chat is technically open to (confirmed: no route-level role
 * restriction exists) have no equivalent "what can I act on right
 * now" question this maps onto as cleanly, and inventing one for each
 * role is a real, separate scope.
 */
export class ChatGroundingContextBuilder {

    constructor(

        private readonly studentRepository: IStudentRepository,

        private readonly activityRepository: IActivityRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository,

        private readonly getCareerScore: GetCareerScoreUseCase

    ) {}

    async build(

        userId: string,

        organizationId: string,

        role: string

    ): Promise<string | undefined> {

        if (role !== UserRole.STUDENT) {
            return undefined;
        }

        const student = await this.studentRepository.findByUserId(userId);

        if (!student) {
            return undefined;
        }

        const now = new Date();

        const [activities, drives, careerScore] = await Promise.all([

            this.activityRepository.findAll({
                organizationId,
                status: ActivityStatus.PUBLISHED,
            }),

            this.placementDriveRepository.findByOrganization(organizationId, {
                status: PlacementDriveStatus.PUBLISHED,
            }),

            this.getCareerScore.execute(organizationId, userId).catch(() => null),

        ]);

        const eligibleActivities = activities
            .filter((a) => a.endDate > now && isStudentEligibleForActivity(student, a))
            .slice(0, MAX_ITEMS_PER_LIST);

        const eligibleDrives = drives
            .filter((d) => isStudentEligibleForDrive(student, d.eligibilityCriteria))
            .slice(0, MAX_ITEMS_PER_LIST);

        const lines: string[] = [];

        if (careerScore) {
            lines.push(`The student's current career score is ${careerScore.careerScore}/100 (${careerScore.label}).`);
        }

        if (eligibleActivities.length > 0) {
            const items = eligibleActivities
                .map((a) => `"${a.title}" (${a.points} pts, closes ${a.endDate.toDateString()})`)
                .join("; ");
            lines.push(`Activities currently open and available to this student: ${items}.`);
        } else {
            lines.push("No activities are currently open and available to this student.");
        }

        if (eligibleDrives.length > 0) {
            const items = eligibleDrives.map((d) => `"${d.title}"${d.package ? ` (${d.package})` : ""}`).join("; ");
            lines.push(`Placement drives this student is currently eligible for: ${items}.`);
        } else {
            lines.push("No placement drives are currently open and eligible for this student.");
        }

        return lines.join(" ");

    }

}
