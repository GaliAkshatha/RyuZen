import { INotificationRepository } from "../../infrastructure/repositories/INotificationRepository.js";

import { NotificationResponseMapper } from "../../infrastructure/mappers/NotificationResponseMapper.js";

import { NotificationResponseDto } from "../dto/NotificationResponseDto.js";

import { IStudentRepository } from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";
import { IFacultyRepository } from "../../../../academic/faculty/infrastructure/repositories/IFacultyRepository.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

/**
 * Resolves the caller's own real departmentId (for STUDENT/FACULTY
 * only - other roles have none) so findForAudience can genuinely
 * respect department-scoped notifications, not just role/ALL
 * broadcasts.
 */
export class GetMyNotificationsUseCase {

    constructor(

        private readonly repository: INotificationRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly facultyRepository: IFacultyRepository

    ) {}

    async execute(

        organizationId: string,

        userId: string,

        role: string

    ): Promise<NotificationResponseDto[]> {

        let viewerDepartmentId: string | undefined;

        if (role === UserRole.STUDENT) {

            const student = await this.studentRepository.findByUserId(userId);
            viewerDepartmentId = student?.departmentId;

        } else if (role === UserRole.FACULTY) {

            const faculty = await this.facultyRepository.findByUserId(userId);
            viewerDepartmentId = faculty?.departmentId;

        }

        const notifications =

            await this.repository.findForAudience(

                organizationId,

                role,

                userId,

                viewerDepartmentId

            );

        return notifications.map(

            notification =>

                NotificationResponseMapper.toDto(
                    notification,
                    userId
                )

        );

    }

}
