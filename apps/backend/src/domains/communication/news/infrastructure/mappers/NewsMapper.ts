import { News } from "../../domain/entities/News.js";

import { NewsDocument } from "../persistence/NewsModel.js";

export class NewsMapper {

    static toDomain(

        document: NewsDocument

    ): News {

        return News.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            authorId:
                document.authorId.toString(),

            authorName:
                document.authorName,

            authorRole:
                document.authorRole,

            title:
                document.title,

            content:
                document.content,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        news: News

    ) {

        const data =
            news.toObject();

        return {

            organizationId:
                data.organizationId,

            authorId:
                data.authorId,

            authorName:
                data.authorName,

            authorRole:
                data.authorRole,

            title:
                data.title,

            content:
                data.content

        };

    }

}
