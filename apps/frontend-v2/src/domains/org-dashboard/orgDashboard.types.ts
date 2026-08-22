/** Matches the real backend DashboardResponseDto exactly - confirmed directly, including which AI domains are genuinely countable (Chat, Mock Interview - persisted) vs which aren't (Resume Review, Career Score, Recommendations - computed fresh every request, never stored). */
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

export interface DashboardAiUsage {
  chatConversations: number;
  mockInterviews: number;
}

export interface DashboardTrendPoint {
  period: string;
  points: number;
}

export interface DashboardDepartmentStat {
  departmentId: string;
  departmentName: string;
  studentCount: number;
  averagePoints: number;
}

export interface PlacementAnalyticsSummary {
  totalCompanies: number;
  activeCompanies: number;
  totalDrives: number;
  publishedDrives: number;
  totalApplications: number;
  selectedCount: number;
  placementRate: number;
}

export interface OrgDashboard {
  users: DashboardUserCounts;
  departments: number;
  activities: DashboardActivityCounts;
  clubs: number;
  events: DashboardEventCounts;
  placements: PlacementAnalyticsSummary;
  activeStudents: number;
  studentEngagementPercent: number;
  xpEarned: number;
  activitiesCompleted: number;
  certificatesEarned: number;
  aiUsage: DashboardAiUsage;
  weeklyTrend: DashboardTrendPoint[];
  monthlyTrend: DashboardTrendPoint[];
  departmentComparison: DashboardDepartmentStat[];
}
