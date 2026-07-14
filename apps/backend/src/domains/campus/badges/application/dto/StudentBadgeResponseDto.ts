export interface StudentBadgeResponseDto {

    id: string;

    studentId: string;

    badgeId: string;

    awardedBy: string;

    awardedAt: Date;

    badge?: {

        name: string;

        description?: string;

        icon?: string;

        points: number;

    };

}
