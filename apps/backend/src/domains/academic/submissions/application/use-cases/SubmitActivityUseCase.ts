import { Submission } from "../../domain/entities/Submission.js";
import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

import { CreateSubmissionDto } from "../dto/CreateSubmissionDto.js";
import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

import { SubmissionResponseMapper } from "../mappers/SubmissionResponseMapper.js";

import { SubmissionEligibilityService } from "../services/SubmissionEligibilityService.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

export class SubmitActivityUseCase {

    constructor(

        private readonly repository: ISubmissionRepository,

        private readonly eligibilityService: SubmissionEligibilityService

    ) {}

    async execute(

        dto: CreateSubmissionDto,

        organizationId: string,

        submittedBy: string

    ): Promise<SubmissionResponseDto> {

        await this.eligibilityService.validateSubmission(

            dto.activityId,

            organizationId,

            submittedBy

        );

        const submission = Submission.create({

            activityId: dto.activityId,

            organizationId,

            submittedBy,

            status: SubmissionStatus.PENDING,

            remarks: dto.remarks,

            attachments: dto.attachments,

            review: {

                reviewedBy: "",

                reviewedAt: undefined,

                feedback: "",

                pointsAwarded: 0

            },

            submittedAt: new Date()

        });

        const created =

            await this.repository.create(

                submission

            );

        return SubmissionResponseMapper.toDto(

            created

        );

    }

}