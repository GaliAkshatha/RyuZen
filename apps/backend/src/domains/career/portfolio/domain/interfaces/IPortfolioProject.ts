export interface IPortfolioProject {

    id?: string;

    userId: string;

    title: string;

    description?: string;

    techStack: string[];

    github?: string;

    liveDemo?: string;

    images: string[];

    video?: string;

    featured: boolean;

    createdAt?: Date;

    updatedAt?: Date;

}
