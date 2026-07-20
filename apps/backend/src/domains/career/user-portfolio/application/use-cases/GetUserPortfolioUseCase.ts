import { UserPortfolio } from "../../domain/entities/UserPortfolio.js";

import { PortfolioVisibility } from "../../domain/constants/PortfolioVisibility.js";

import { IUserPortfolioRepository } from "../../infrastructure/repositories/IUserPortfolioRepository.js";

import { UserPortfolioResponseDto } from "../dto/UserPortfolioResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    ISkillRepository,
} from "../../../skills/infrastructure/repositories/ISkillRepository.js";

import { SkillResponseMapper } from "../../../skills/infrastructure/mappers/SkillResponseMapper.js";

import {
    IPortfolioProjectRepository,
} from "../../../portfolio/infrastructure/repositories/IPortfolioProjectRepository.js";

import { PortfolioProjectResponseMapper } from "../../../portfolio/infrastructure/mappers/PortfolioProjectResponseMapper.js";

import {
    IExperienceRepository,
} from "../../../experience/infrastructure/repositories/IExperienceRepository.js";

import { ExperienceResponseMapper } from "../../../experience/infrastructure/mappers/ExperienceResponseMapper.js";

import {
    IEducationRepository,
} from "../../../education/infrastructure/repositories/IEducationRepository.js";

import { EducationResponseMapper } from "../../../education/infrastructure/mappers/EducationResponseMapper.js";

import {
    ICertificationRepository,
} from "../../../certifications/infrastructure/repositories/ICertificationRepository.js";

import { CertificationResponseMapper } from "../../../certifications/infrastructure/mappers/CertificationResponseMapper.js";

import {
    IAchievementRepository,
} from "../../../achievements/infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../../achievements/infrastructure/mappers/AchievementResponseMapper.js";

import { AchievementStatus } from "../../../achievements/domain/constants/AchievementStatus.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetUserPortfolioUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly portfolioRepository: IUserPortfolioRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly skillRepository: ISkillRepository,

        private readonly projectRepository: IPortfolioProjectRepository,

        private readonly experienceRepository: IExperienceRepository,

        private readonly educationRepository: IEducationRepository,

        private readonly certificationRepository: ICertificationRepository,

        private readonly achievementRepository: IAchievementRepository

    ) {}

    async execute(

        targetUserId: string,

        viewerUserId: string,

        viewerIsAdmin: boolean

    ): Promise<UserPortfolioResponseDto> {

        const user =

            await this.userRepository.findById(
                targetUserId
            );

        if (!user) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        let portfolio =

            await this.portfolioRepository.findByUserId(
                targetUserId
            );

        if (!portfolio) {

            portfolio = UserPortfolio.create({

                userId:
                    targetUserId,

                visibility:
                    PortfolioVisibility.PUBLIC

            });

        }

        const isOwner =

            targetUserId === viewerUserId;

        if (

            portfolio.visibility === PortfolioVisibility.PRIVATE &&
            !isOwner &&
            !viewerIsAdmin

        ) {

            throw new ApiError(

                "This portfolio is private.",

                HttpStatus.FORBIDDEN

            );

        }

        const [

            skills,

            projects,

            experience,

            education,

            certifications

        ] = await Promise.all([

            this.skillRepository.findByUserId(
                targetUserId
            ),

            this.projectRepository.findByUserId(
                targetUserId
            ),

            this.experienceRepository.findByUserId(
                targetUserId
            ),

            this.educationRepository.findByUserId(
                targetUserId
            ),

            this.certificationRepository.findByUserId(
                targetUserId
            )

        ]);

        const student =

            await this.studentRepository.findByUserId(
                targetUserId
            );

        const achievements =

            student

                ? await this.achievementRepository.findByStudent(

                    student.id!,

                    {

                        status: AchievementStatus.VERIFIED

                    }

                )

                : [];

        return {

            userId:
                user.id!,

            name:
                user.name,

            email:
                user.email,

            role:
                user.role,

            profileImage:
                user.profile.image,

            bio:
                user.profile.bio,

            headline:
                portfolio.headline,

            summary:
                portfolio.summary,

            github:
                portfolio.github,

            linkedin:
                portfolio.linkedin,

            leetcode:
                portfolio.leetcode,

            codeforces:
                portfolio.codeforces,

            portfolio:
                portfolio.portfolio,

            behance:
                portfolio.behance,

            dribbble:
                portfolio.dribbble,

            website:
                portfolio.website,

            visibility:
                portfolio.visibility,

            theme:
                portfolio.theme,

            skills:
                skills.map(

                    skill =>
                        SkillResponseMapper.toDto(skill)

                ),

            projects:
                projects.map(

                    project =>
                        PortfolioProjectResponseMapper.toDto(project)

                ),

            experience:
                experience.map(

                    entry =>
                        ExperienceResponseMapper.toDto(entry)

                ),

            education:
                education.map(

                    entry =>
                        EducationResponseMapper.toDto(entry)

                ),

            certifications:
                certifications.map(

                    certification =>
                        CertificationResponseMapper.toDto(certification)

                ),

            achievements:
                achievements.map(

                    achievement =>
                        AchievementResponseMapper.toDto(achievement)

                )

        };

    }

}
