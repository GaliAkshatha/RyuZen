import { PlacementAnalyticsResponseDto } from "../../../../placements/analytics/application/dto/PlacementAnalyticsResponseDto.js";

export interface DashboardUserCounts {

    total: number;

    students: number;

    faculty: number;

    alumni: number;

    orgAdmins: number;

}

export interface DashboardActivityCounts {

    total: number;

    published: number;

    pendingReviews: number;

}

export interface DashboardEventCounts {

    total: number;

    published: number;

}

export interface DashboardResponseDto {

    users: DashboardUserCounts;

    departments: number;

    activities: DashboardActivityCounts;

    clubs: number;

    events: DashboardEventCounts;

    placements: PlacementAnalyticsResponseDto;

}
