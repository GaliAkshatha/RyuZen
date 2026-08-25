import { News } from "../../domain/entities/News.js";

import { INewsRepository } from "./INewsRepository.js";

import { NewsModel } from "../persistence/NewsModel.js";

import { NewsMapper } from "../mappers/NewsMapper.js";

export class NewsRepository implements INewsRepository {

    async create(

        news: News

    ): Promise<News> {

        const document =

            await NewsModel.create(

                NewsMapper.toPersistence(
                    news
                )

            );

        return NewsMapper.toDomain(
            document
        );

    }

    async findById(

        id: string

    ): Promise<News | null> {

        const document =

            await NewsModel.findById(
                id
            );

        return document
            ? NewsMapper.toDomain(document)
            : null;

    }

    async findByOrganization(

        organizationId: string

    ): Promise<News[]> {

        const documents =

            await NewsModel.find({

                organizationId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                NewsMapper.toDomain(
                    document
                )

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await NewsModel.findByIdAndDelete(
            id
        );

    }

}
