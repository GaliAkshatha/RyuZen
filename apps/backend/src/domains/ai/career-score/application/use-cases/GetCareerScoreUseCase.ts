import { ICareerScoreProvider } from "../ports/ICareerScoreProvider.js";

import { CareerScoreResponseDto } from "../dto/CareerScoreResponseDto.js";

import {
    ILeaderboardRepository,
} from "../../../../campus/leaderboard/infrastructure/repositories/ILeaderboardRepository.js";

import {
    IResumeRepository,
} from "../../../../career/resume/infrastructure/repositories/IResumeRepository.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    IAchievementRepository,
} from "../../../../career/achievements/infrastructure/repositories/IAchievementRepository.js";

import { AchievementStatus } from "../../../../career/achievements/domain/constants/AchievementStatus.js";

import {
    ISkillRepository,
} from "../../../../career/skills/infrastructure/repositories/ISkillRepository.js";

import {
    IPortfolioProjectRepository,
} from "../../../../career/portfolio/infrastructure/repositories/IPortfolioProjectRepository.js";

import {
    IExperienceRepository,
} from "../../../../career/experience/infrastructure/repositories/IExperienceRepository.js";

import {
    IEducationRepository,
} from "../../../../career/education/infrastructure/repositories/IEducationRepository.js";

import {
    ICertificationRepository,
} from "../../../../career/certifications/infrastructure/repositories/ICertificationRepository.js";

export class GetCareerScoreUseCase {

    constructor(

        private readonly provider: ICareerScoreProvider,

        private readonly leaderboardRepository: ILeaderboardRepository,

        private readonly resumeRepository: IResumeRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly achievementRepository: IAchievementRepository,

        private readonly skillRepository: ISkillRepository,

        private readonly projectRepository: IPortfolioProjectRepository,

        private readonly experienceRepository: IExperienceRepository,

        private readonly educationRepository: IEducationRepository,

        private readonly certificationRepository: ICertificationRepository

    ) {}

    async execute(

        organizationId: string,

        userId: string

    ): Promise<CareerScoreResponseDto> {

        const [

            resume,

            skills,

            projects,

            experience,

            education,

            certifications,

            student

        ] = await Promise.all([

            this.resumeRepository.findByUserId(
                userId
            ),

            this.skillRepository.findByUserId(
                userId
            ),

            this.projectRepository.findByUserId(
                userId
            ),

            this.experienceRepository.findByUserId(
                userId
            ),

            this.educationRepository.findByUserId(
                userId
            ),

            this.certificationRepository.findByUserId(
                userId
            ),

            this.studentRepository.findByUserId(
                userId
            )

        ]);

        let leaderboardScore = 0;

        let achievementsScore = 0;

        if (student) {

            const leaderboardEntry =

                await this.leaderboardRepository.findByStudentId(

                    organizationId,

                    student.id!

                );

            leaderboardScore =

                Math.min(

                    100,

                    leaderboardEntry?.totalPoints ?? 0

                );

            const verifiedAchievements =

                await this.achievementRepository.findByStudent(

                    student.id!,

                    {

                        status: AchievementStatus.VERIFIED

                    }

                );

            achievementsScore =

                Math.min(

                    100,

                    verifiedAchievements.length * 20

                );

        }

        const resumeScore =

            resume?.atsScore ?? 0;

        const profileCompletenessScore =

            Math.min(

                100,

                skills.length * 5 +
                projects.length * 10 +
                experience.length * 15 +
                education.length * 10 +
                certifications.length * 5

            );

        const careerScore =

            Math.round(

                (

                    leaderboardScore +
                    resumeScore +
                    profileCompletenessScore +
                    achievementsScore

                ) / 4

            );

        const insight =

            await this.provider.generateInsight({

                careerScore,

                leaderboardScore,

                resumeScore,

                profileCompletenessScore,

                achievementsScore

            });

        return {

            careerScore,

            leaderboardScore,

            resumeScore,

            profileCompletenessScore,

            achievementsScore,

            label:
                insight.label,

            narrative:
                insight.narrative

        };

    }

}
