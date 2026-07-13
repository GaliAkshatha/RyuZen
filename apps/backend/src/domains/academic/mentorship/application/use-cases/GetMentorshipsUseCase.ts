import { IMentorshipRepository } from "../../infrastructure/repositories/IMentorshipRepository.js";

import { MentorshipResponseMapper } from "../../infrastructure/mappers/MentorshipResponseMapper.js";

import { MentorshipResponseDto } from "../dto/MentorshipResponseDto.js";

export interface GetMentorshipsFilterDto {

    studentId?: string;

    facultyId?: string;

    status?: string;

}

export class GetMentorshipsUseCase {

    constructor(

        private readonly repository: IMentorshipRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetMentorshipsFilterDto

    ): Promise<MentorshipResponseDto[]> {

        const mentorships =

            await this.repository.findByOrganization(

                organizationId,

                {

                    studentId: filters.studentId,

                    facultyId: filters.facultyId,

                    status: filters.status

                }

            );

        return mentorships.map(

            mentorship =>

                MentorshipResponseMapper.toDto(
                    mentorship
                )

        );

    }

}
