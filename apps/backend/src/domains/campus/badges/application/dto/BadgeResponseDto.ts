export interface BadgeResponseDto {

    id: string;

    name: string;

    description?: string;

    icon?: string;

    criteria?: string;

    points: number;

    createdAt?: Date;

    updatedAt?: Date;

}
