import { IRecruiterRepository } from "../../infrastructure/repositories/IRecruiterRepository.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import {
    IJobApplicationRepository,
} from "../../../applications/infrastructure/repositories/IJobApplicationRepository.js";

import {
    JobApplicationResponseMapper,
} from "../../../applications/infrastructure/mappers/JobApplicationResponseMapper.js";

import {
    JobApplicationResponseDto,
} from "../../../applications/application/dto/JobApplicationResponseDto.js";

import { SearchApplicantsDto } from "../dto/SearchApplicantsDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { Student } from "../../../../academic/students/domain/entities/Student.js";

import {
    ISkillRepository,
} from "../../../../career/skills/infrastructure/repositories/ISkillRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Candidate Discovery" - deliberately scoped to this recruiter's own
 * real applicant pool (their company's drives, exactly the same
 * resolution GetApplicantsForRecruiterUseCase already proves out),
 * never an unrestricted student directory. Matches "Future recruiter
 * search/discovery can exist, but it must always respect ...
 * drive scope."
 *
 * Skill matching is against REAL, verified skills only
 * (skill.verified === true) - a student's own unverified, self-typed
 * skill claim never makes them match a search, matching "Results
 * should be based only on verified institutional data, not
 * self-declared claims" directly. Projects/certifications/AI-score/
 * growth-trend search criteria are real, reasonable follow-ups, not
 * built here - this first version covers skills and CGPA honestly
 * rather than half-implementing a broader search surface.
 */
export class SearchApplicantsUseCase {

    constructor(

        private readonly recruiterRepository: IRecruiterRepository,

        private readonly driveRepository: IPlacementDriveRepository,

        private readonly applicationRepository: IJobApplicationRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly skillRepository: ISkillRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        recruiterUserId: string,

        organizationId: string,

        criteria: SearchApplicantsDto

    ): Promise<JobApplicationResponseDto[]> {

        const recruiter =

            await this.recruiterRepository.findByUserId(
                recruiterUserId
            );

        if (

            !recruiter ||
            recruiter.organizationId !== organizationId

        ) {

            throw new ApiError(

                "No recruiter profile found for this account.",

                HttpStatus.FORBIDDEN

            );

        }

        const drives =

            await this.driveRepository.findByOrganization(
                organizationId,
                { companyId: recruiter.companyId }
            );

        if (drives.length === 0) {

            return [];

        }

        const driveIds =

            drives.map(drive => drive.id!);

        const applications =

            await this.applicationRepository.findByPlacementIds(
                driveIds
            );

        const wantedSkills =

            criteria.skillNames?.map(name => name.trim().toLowerCase()) ?? [];

        const matching: { application: (typeof applications)[number]; student: Student }[] = [];

        for (const application of applications) {

            const student =

                await this.studentRepository.findById(
                    application.studentId
                );

            if (!student) {
                continue;
            }

            if (

                criteria.minCgpa !== undefined &&
                (student.cgpa === undefined || student.cgpa < criteria.minCgpa)

            ) {

                continue;

            }

            if (wantedSkills.length > 0) {

                const skills =

                    await this.skillRepository.findByUserId(
                        student.userId
                    );

                const verifiedNames =

                    skills

                        .filter(skill => skill.verified)

                        .map(skill => skill.name.toLowerCase());

                const hasMatch =

                    wantedSkills.some(wanted => verifiedNames.includes(wanted));

                if (!hasMatch) {
                    continue;
                }

            }

            matching.push({ application, student });

        }

        const dtos: JobApplicationResponseDto[] = [];

        for (const { application, student } of matching) {

            const dto = JobApplicationResponseMapper.toDto(application);

            dto.studentUsn = student.usn;

            const user =

                await this.userRepository.findById(
                    student.userId
                );

            if (user) {

                dto.studentName = user.name;

            }

            dtos.push(dto);

        }

        return dtos;

    }

}
