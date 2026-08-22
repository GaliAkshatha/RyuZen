import { ILeaderboardRepository } from "../../infrastructure/repositories/ILeaderboardRepository.js";

import { LeaderboardEntryResponseMapper } from "../../infrastructure/mappers/LeaderboardEntryResponseMapper.js";

import { LeaderboardEntryResponseDto } from "../dto/LeaderboardEntryResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

/**
 * Previously left studentId as the only identifier, forcing the
 * frontend to call the admin-only GET /students to resolve display
 * names - a genuine bug, confirmed directly from a real log: every
 * student loading their own leaderboard triggered a 403 on that call
 * and silently fell back to showing raw ids. Enriches with real
 * name/usn here instead, where any authenticated caller can safely
 * see this - leaderboard entries are already visible to every real
 * role in the organization.
 */
export class GetLeaderboardUseCase {

    constructor(

        private readonly repository: ILeaderboardRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<LeaderboardEntryResponseDto[]> {

        const entries =

            await this.repository.findByOrganization(
                organizationId
            );

        const dtos: LeaderboardEntryResponseDto[] = [];

        for (const entry of entries) {

            const dto =

                LeaderboardEntryResponseMapper.toDto(
                    entry
                );

            const student =

                await this.studentRepository.findById(
                    dto.studentId
                );

            if (student) {

                dto.studentUsn = student.usn;

                dto.departmentId = student.departmentId;

                dto.batch = student.batch;

                const user =

                    await this.userRepository.findById(
                        student.userId
                    );

                if (user) {

                    dto.studentName = user.name;

                }

            }

            dtos.push(dto);

        }

        return dtos;

    }

}
