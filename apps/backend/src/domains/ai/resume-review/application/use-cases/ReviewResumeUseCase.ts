import { IResumeReviewProvider } from "../ports/IResumeReviewProvider.js";

import { ResumeReviewResponseDto } from "../dto/ResumeReviewResponseDto.js";

import {
    IResumeRepository,
} from "../../../../career/resume/infrastructure/repositories/IResumeRepository.js";

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

export class ReviewResumeUseCase {

    constructor(

        private readonly provider: IResumeReviewProvider,

        private readonly resumeRepository: IResumeRepository,

        private readonly skillRepository: ISkillRepository,

        private readonly projectRepository: IPortfolioProjectRepository,

        private readonly experienceRepository: IExperienceRepository,

        private readonly educationRepository: IEducationRepository,

        private readonly certificationRepository: ICertificationRepository

    ) {}

    async execute(

        userId: string

    ): Promise<ResumeReviewResponseDto> {

        const [

            resume,

            skills,

            projects,

            experience,

            education,

            certifications

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
            )

        ]);

        // Unapproved AI-suggested skills are not yet real skills — see
        // GetSkillsByUserUseCase for the same rule applied there. This
        // use case calls the repository directly, so the filter has to
        // be reapplied here too, or an unreviewed AI suggestion would
        // be fed to the AI reviewer as if it were a confirmed skill.
        const approvedSkills =
            skills.filter(skill => skill.approved);

        const result =

            await this.provider.review({

                resumeUrl:
                    resume?.resumeUrl,

                skills:
                    approvedSkills.map(

                        skill => skill.name

                    ),

                projectTitles:
                    projects.map(

                        project => project.title

                    ),

                experienceRoles:
                    experience.map(

                        entry => entry.role

                    ),

                educationDegrees:
                    education.map(

                        entry => entry.degree

                    ),

                certificationTitles:
                    certifications.map(

                        certification => certification.title

                    )

            });

        if (resume) {

            resume.updateAtsScore(

                result.score

            );

            await this.resumeRepository.upsert(

                resume

            );

        }

        return result;

    }

}
