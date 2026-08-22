/** Matches the real backend DashboardResponseDto exactly. */
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

export interface DashboardAiUsage {
  chatConversations: number;
  mockInterviews: number;
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
  placements: PlacementAnalyticsSummary;
  activeStudents: number;
  studentEngagementPercent: number;
  xpEarned: number;
  activitiesCompleted: number;
  certificatesEarned: number;
  aiUsage: DashboardAiUsage;
  departmentComparison: DashboardDepartmentStat[];
}
