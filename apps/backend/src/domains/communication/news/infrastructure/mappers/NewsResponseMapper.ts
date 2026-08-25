import { News } from "../../domain/entities/News.js";

import { NewsResponseDto } from "../../application/dto/NewsResponseDto.js";

export class NewsResponseMapper {

    static toDto(

        news: News

    ): NewsResponseDto {

        return {

            id:
                news.id!,

            title:
                news.title,

            content:
                news.content,

            authorId:
                news.authorId,

            authorName:
                news.authorName,

            authorRole:
                news.authorRole,

            createdAt:
                news.createdAt?.toISOString()

        };

    }

}
