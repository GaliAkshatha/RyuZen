import { Skill } from "../../domain/entities/Skill.js";
import { SkillSource } from "../../domain/constants/SkillSource.js";

import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";
import { SkillResponseMapper } from "../../infrastructure/mappers/SkillResponseMapper.js";

import { ISkillExtractionProvider } from "../ports/ISkillExtractionProvider.js";
import { SkillResponseDto } from "../dto/SkillResponseDto.js";

import {
    IPortfolioProjectRepository
} from "../../../portfolio/infrastructure/repositories/IPortfolioProjectRepository.js";

import {
    ICertificationRepository
} from "../../../certifications/infrastructure/repositories/ICertificationRepository.js";

import {
    IExperienceRepository
} from "../../../experience/infrastructure/repositories/IExperienceRepository.js";

import {
    ISubmissionRepository
} from "../../../../academic/submissions/infrastructure/repositories/ISubmissionRepository.js";

import {
    IActivityRepository
} from "../../../../academic/activities/infrastructure/repositories/IActivityRepository.js";

import { SubmissionStatus } from "../../../../academic/submissions/domain/constants/SubmissionStatus.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

/**
 * Gathers a student's REAL evidence - Portfolio Projects, Certifications,
 * Experience, and approved Activity submissions (their linked Activity
 * titles) - and asks the AI provider to suggest skills backed by that
 * evidence. Every candidate is deduplicated against skills the student
 * already has (any source, approved or not), so re-running extraction
 * never creates duplicates.
 *
 * Suggestions are created as real Skill records immediately
 * (source=AI_SUGGESTED, approved=false) rather than a separate
 * "suggestion" entity - they become full skills the moment the student
 * approves them (ApproveSkillSuggestionUseCase), reusing the exact same
 * Skill domain model rather than building a parallel one.
 */
export class ExtractSkillsUseCase {

    constructor(

        private readonly skillRepository: ISkillRepository,

        private readonly provider: ISkillExtractionProvider,

        private readonly projectRepository: IPortfolioProjectRepository,

        private readonly certificationRepository: ICertificationRepository,

        private readonly experienceRepository: IExperienceRepository,

        private readonly submissionRepository: ISubmissionRepository,

        private readonly activityRepository: IActivityRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        organizationId: string,

        userId: string

    ): Promise<SkillResponseDto[]> {

        const [
            existingSkills,
            projects,
            certifications,
            experience,
            approvedSubmissions
        ] = await Promise.all([

            this.skillRepository.findByUserId(
                userId
            ),

            this.projectRepository.findByUserId(
                userId
            ),

            this.certificationRepository.findByUserId(
                userId
            ),

            this.experienceRepository.findByUserId(
                userId
            ),

            this.submissionRepository.findAll({
                submittedBy: userId,
                status: SubmissionStatus.APPROVED
            })

        ]);

        const activities = await Promise.all(
            approvedSubmissions.map(
                submission =>
                    this.activityRepository.findById(
                        submission.activityId
                    )
            )
        );

        const completedActivityTitles =
            activities
                .filter(
                    (activity): activity is NonNullable<typeof activity> =>
                        activity !== null
                )
                .map(activity => activity.title);

        const existingSkillNames =
            existingSkills.map(skill => skill.name);

        const suggestions = await this.provider.extract({

            projects: projects.map(project => ({
                title: project.title,
                description: project.description,
                techStack: project.techStack
            })),

            certifications: certifications.map(certification => ({
                title: certification.title,
                issuer: certification.issuer,
                skills: certification.skills
            })),

            experience: experience.map(exp => ({
                role: exp.role,
                company: exp.company,
                description: exp.description
            })),

            completedActivityTitles,

            existingSkillNames

        });

        // Defensive dedup against whatever the model actually returned
        // - the prompt asks it not to repeat existing skills, but this
        // guards against it doing so anyway (case-insensitive, since
        // "React" and "react" are the same skill).
        const existingNamesLower =
            new Set(existingSkillNames.map(name => name.toLowerCase()));

        const newSuggestions =
            suggestions.filter(
                suggestion =>
                    !existingNamesLower.has(suggestion.name.toLowerCase())
            );

        const created = await Promise.all(
            newSuggestions.map(suggestion => {
                const skill = Skill.create({
                    userId,
                    name: suggestion.name,
                    verified: false,
                    source: SkillSource.AI_SUGGESTED,
                    confidence: suggestion.confidence,
                    evidence: suggestion.evidence,
                    approved: false
                });

                return this.skillRepository.create(skill);
            })
        );

        if (created.length > 0) {

            await this.recordSystemNotification.execute({

                organizationId,

                recipientUserId:
                    userId,

                senderId:
                    userId,

                title:
                    "New AI skill suggestions ready",

                message:
                    `AI found ${created.length} skill${created.length === 1 ? "" : "s"} from your profile. Review and approve them on your Skills page.`

            });

        }

        return created.map(
            skill => SkillResponseMapper.toDto(skill)
        );

    }

}
