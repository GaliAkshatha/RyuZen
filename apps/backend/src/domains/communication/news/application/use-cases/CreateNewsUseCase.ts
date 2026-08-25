import { News } from "../../domain/entities/News.js";

import { INewsRepository } from "../../infrastructure/repositories/INewsRepository.js";

import { NewsResponseMapper } from "../../infrastructure/mappers/NewsResponseMapper.js";

import { IUserRepository } from "../../../../identity/infrastructure/repositories/IUserRepository.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateNewsDto } from "../dto/CreateNewsDto.js";
import { NewsResponseDto } from "../dto/NewsResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real sender-role enforcement, matching the exact roles named in the
 * request: Faculty, Org Admin, and Placement Admin - the route itself
 * also restricts to these three (defense in depth, same pattern as
 * SendNotificationUseCase), but this is where the actual rule lives.
 * Author name/role are fetched from the real User record and stored
 * denormalized on the News document itself, so the feed never needs
 * a per-item lookup to show who posted.
 */
const ALLOWED_ROLES = [UserRole.FACULTY, UserRole.ORG_ADMIN, UserRole.PLACEMENT_ADMIN];

export class CreateNewsUseCase {

    constructor(

        private readonly repository: INewsRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        dto: CreateNewsDto,

        organizationId: string,

        authorId: string,

        authorRole: UserRole

    ): Promise<NewsResponseDto> {

        if (!ALLOWED_ROLES.includes(authorRole)) {

            throw new ApiError(

                "Your role cannot post news.",

                HttpStatus.FORBIDDEN

            );

        }

        const author =

            await this.userRepository.findById(
                authorId
            );

        if (!author) {

            throw new ApiError(

                "Author account not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const news = News.create({

            organizationId,

            authorId,

            authorName:
                author.name,

            authorRole,

            title:
                dto.title,

            content:
                dto.content

        });

        const created =

            await this.repository.create(

                news

            );

        return NewsResponseMapper.toDto(

            created

        );

    }

}
