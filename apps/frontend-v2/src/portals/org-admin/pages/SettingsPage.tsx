import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/Tabs";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { ToggleRow } from "@/domains/organization-settings/components/ToggleRow";
import { useOrganizationSettings } from "@/domains/organization-settings/hooks/useOrganizationSettings";
import { useUpdateOrganizationSettings } from "@/domains/organization-settings/hooks/useUpdateOrganizationSettings";
import type { OrganizationSettings } from "@/domains/organization-settings/organizationSettings.types";

/**
 * Real, complete Organization Settings - covers every one of the 18
 * real backend groups (confirmed directly against IOrganizationSettings),
 * not a curated subset. Single local draft state, one real PATCH on
 * save covering only what changed within the current tab's group at
 * minimum, but sent as the full group object each save - matches the
 * real backend's per-group partial-update pattern (every field
 * optional at every level).
 */
export function SettingsPage() {
  const { data: settings, isLoading, isError, error, refetch } = useOrganizationSettings();
  const { mutate: updateSettings, isPending } = useUpdateOrganizationSettings();
  const [draft, setDraft] = useState<OrganizationSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings && !draft) setDraft(settings);
  }, [settings, draft]);

  if (isLoading || !draft) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  function set<K extends keyof OrganizationSettings>(group: K, patch: Partial<OrganizationSettings[K]>) {
    setDraft((prev) =>
      prev ? { ...prev, [group]: { ...(prev[group] as object), ...patch } } : prev,
    );
  }

  function handleSave() {
    if (!draft) return;
    setSaved(false);
    const { id: _id, organizationId: _organizationId, createdAt: _createdAt, updatedAt: _updatedAt, ...groups } = draft;
    updateSettings(groups, { onSuccess: () => setSaved(true) });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Organization settings</h1>
          <p className="text-sm text-muted-foreground">Configure every aspect of your institution's RyuZen instance.</p>
        </div>
        <Button size="sm" disabled={isPending} className="flex items-center gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {saved && (
        <p className="rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm text-success">Settings saved.</p>
      )}

      <Tabs defaultValue="branding">
        <TabsList className="flex-wrap">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="careerSystem">Career</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="fileStorage">Files</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card>
            <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="primaryColor">Primary color</Label>
                  <Input id="primaryColor" value={draft.branding.primaryColor} onChange={(e) => set("branding", { primaryColor: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="secondaryColor">Secondary color</Label>
                  <Input id="secondaryColor" value={draft.branding.secondaryColor} onChange={(e) => set("branding", { secondaryColor: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="accentColor">Accent color</Label>
                  <Input id="accentColor" value={draft.branding.accentColor} onChange={(e) => set("branding", { accentColor: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="loginBanner">Login banner URL</Label>
                <Input id="loginBanner" value={draft.branding.loginBanner} onChange={(e) => set("branding", { loginBanner: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input id="favicon" value={draft.branding.favicon} onChange={(e) => set("branding", { favicon: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="emailBranding">Email branding</Label>
                  <Input id="emailBranding" value={draft.branding.emailBranding} onChange={(e) => set("branding", { emailBranding: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration">
          <Card>
            <CardHeader><CardTitle>Registration</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="allowFacultyRegistration" label="Allow faculty self-registration" checked={draft.registration.allowFacultyRegistration} onCheckedChange={(v) => set("registration", { allowFacultyRegistration: v })} />
              <ToggleRow id="emailDomainRestriction" label="Restrict to organization email domain" checked={draft.registration.emailDomainRestriction} onCheckedChange={(v) => set("registration", { emailDomainRestriction: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Security</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="passwordMinLength">Minimum password length</Label>
                <Input id="passwordMinLength" type="number" value={draft.security.passwordMinLength} onChange={(e) => set("security", { passwordMinLength: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sessionTimeoutMinutes">Session timeout (minutes)</Label>
                <Input id="sessionTimeoutMinutes" type="number" value={draft.security.sessionTimeoutMinutes} onChange={(e) => set("security", { sessionTimeoutMinutes: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="loginAttemptLimit">Login attempt limit</Label>
                <Input id="loginAttemptLimit" type="number" value={draft.security.loginAttemptLimit} onChange={(e) => set("security", { loginAttemptLimit: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="accountLockDurationMinutes">Account lock duration (minutes)</Label>
                <Input id="accountLockDurationMinutes" type="number" value={draft.security.accountLockDurationMinutes} onChange={(e) => set("security", { accountLockDurationMinutes: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invitationExpiryDays">Invitation expiry (days)</Label>
                <Input id="invitationExpiryDays" type="number" value={draft.security.invitationExpiryDays} onChange={(e) => set("security", { invitationExpiryDays: Number(e.target.value) })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader><CardTitle>Academic</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="defaultCgpaScale">Default CGPA scale</Label>
                  <Input id="defaultCgpaScale" type="number" value={draft.academic.defaultCgpaScale} onChange={(e) => set("academic", { defaultCgpaScale: Number(e.target.value) })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="semesterConfiguration">Semester configuration</Label>
                  <Input id="semesterConfiguration" value={draft.academic.semesterConfiguration} onChange={(e) => set("academic", { semesterConfiguration: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col divide-y divide-border">
                <ToggleRow id="attendanceEnabled" label="Attendance tracking enabled" checked={draft.academic.attendanceEnabled} onCheckedChange={(v) => set("academic", { attendanceEnabled: v })} />
                <ToggleRow id="mentorshipEnabled" label="Mentorship enabled" checked={draft.academic.mentorshipEnabled} onCheckedChange={(v) => set("academic", { mentorshipEnabled: v })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader><CardTitle>Activities</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="defaultPoints">Default points</Label>
                <Input id="defaultPoints" type="number" value={draft.activities.defaultPoints} onChange={(e) => set("activities", { defaultPoints: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col divide-y divide-border">
                <ToggleRow id="autoCloseActivities" label="Auto-close activities at deadline" checked={draft.activities.autoCloseActivities} onCheckedChange={(v) => set("activities", { autoCloseActivities: v })} />
                <ToggleRow id="autoLeaderboardUpdate" label="Auto-update leaderboard" checked={draft.activities.autoLeaderboardUpdate} onCheckedChange={(v) => set("activities", { autoLeaderboardUpdate: v })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader><CardTitle>Events</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="registrationLimit">Registration limit</Label>
                <Input id="registrationLimit" type="number" value={draft.events.registrationLimit} onChange={(e) => set("events", { registrationLimit: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col divide-y divide-border">
                <ToggleRow id="waitlistEnabled" label="Waitlist enabled" checked={draft.events.waitlistEnabled} onCheckedChange={(v) => set("events", { waitlistEnabled: v })} />
                <ToggleRow id="attendanceQrEnabled" label="QR code attendance" checked={draft.events.attendanceQrEnabled} onCheckedChange={(v) => set("events", { attendanceQrEnabled: v })} />
                <ToggleRow id="certificateGenerationEnabled" label="Auto-generate certificates" checked={draft.events.certificateGenerationEnabled} onCheckedChange={(v) => set("events", { certificateGenerationEnabled: v })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clubs">
          <Card>
            <CardHeader><CardTitle>Clubs</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maxMembers">Maximum members</Label>
                <Input id="maxMembers" type="number" value={draft.clubs.maxMembers} onChange={(e) => set("clubs", { maxMembers: Number(e.target.value) })} />
              </div>
              <ToggleRow id="advisorRequired" label="Faculty advisor required" checked={draft.clubs.advisorRequired} onCheckedChange={(v) => set("clubs", { advisorRequired: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placements">
          <Card>
            <CardHeader><CardTitle>Placements</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="resumeMandatory" label="Resume mandatory to apply" checked={draft.placements.resumeMandatory} onCheckedChange={(v) => set("placements", { resumeMandatory: v })} />
              <ToggleRow id="companyApprovalRequired" label="Company approval required" checked={draft.placements.companyApprovalRequired} onCheckedChange={(v) => set("placements", { companyApprovalRequired: v })} />
              <ToggleRow id="placementVisibility" label="Placements publicly visible" checked={draft.placements.placementVisibility === "PUBLIC"} onCheckedChange={(v) => set("placements", { placementVisibility: v ? "PUBLIC" : "PRIVATE" })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careerSystem">
          <Card>
            <CardHeader><CardTitle>Career system</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="enableResumeBuilder" label="Resume builder" checked={draft.careerSystem.enableResumeBuilder} onCheckedChange={(v) => set("careerSystem", { enableResumeBuilder: v })} />
              <ToggleRow id="enablePortfolio" label="Portfolio" checked={draft.careerSystem.enablePortfolio} onCheckedChange={(v) => set("careerSystem", { enablePortfolio: v })} />
              <ToggleRow id="enableSkills" label="Skills" checked={draft.careerSystem.enableSkills} onCheckedChange={(v) => set("careerSystem", { enableSkills: v })} />
              <ToggleRow id="enableCertifications" label="Certifications" checked={draft.careerSystem.enableCertifications} onCheckedChange={(v) => set("careerSystem", { enableCertifications: v })} />
              <ToggleRow id="enableAchievements" label="Achievements" checked={draft.careerSystem.enableAchievements} onCheckedChange={(v) => set("careerSystem", { enableAchievements: v })} />
              <ToggleRow id="enableCareerScore" label="Career score" checked={draft.careerSystem.enableCareerScore} onCheckedChange={(v) => set("careerSystem", { enableCareerScore: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader><CardTitle>AI features</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="resumeReview" label="Resume review" checked={draft.ai.resumeReview} onCheckedChange={(v) => set("ai", { resumeReview: v })} />
              <ToggleRow id="careerRecommendations" label="Career recommendations" checked={draft.ai.careerRecommendations} onCheckedChange={(v) => set("ai", { careerRecommendations: v })} />
              <ToggleRow id="skillGapAnalysis" label="Skill gap analysis" checked={draft.ai.skillGapAnalysis} onCheckedChange={(v) => set("ai", { skillGapAnalysis: v })} />
              <ToggleRow id="interviewPreparation" label="Interview preparation" checked={draft.ai.interviewPreparation} onCheckedChange={(v) => set("ai", { interviewPreparation: v })} />
              <ToggleRow id="projectSuggestions" label="Project suggestions" checked={draft.ai.projectSuggestions} onCheckedChange={(v) => set("ai", { projectSuggestions: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="emailNotifications" label="Email notifications" checked={draft.notifications.emailNotifications} onCheckedChange={(v) => set("notifications", { emailNotifications: v })} />
              <ToggleRow id="inAppNotifications" label="In-app notifications" checked={draft.notifications.inAppNotifications} onCheckedChange={(v) => set("notifications", { inAppNotifications: v })} />
              <ToggleRow id="pushNotifications" label="Push notifications" checked={draft.notifications.pushNotifications} onCheckedChange={(v) => set("notifications", { pushNotifications: v })} />
              <ToggleRow id="broadcastMessages" label="Broadcast messages" checked={draft.notifications.broadcastMessages} onCheckedChange={(v) => set("notifications", { broadcastMessages: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader><CardTitle>Chat permissions</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="facultyToStudent" label="Faculty to student" checked={draft.chat.facultyToStudent} onCheckedChange={(v) => set("chat", { facultyToStudent: v })} />
              <ToggleRow id="studentToStudent" label="Student to student" checked={draft.chat.studentToStudent} onCheckedChange={(v) => set("chat", { studentToStudent: v })} />
              <ToggleRow id="alumniToStudent" label="Alumni to student" checked={draft.chat.alumniToStudent} onCheckedChange={(v) => set("chat", { alumniToStudent: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="analyticsDashboard" label="Dashboard analytics" checked={draft.analytics.dashboard} onCheckedChange={(v) => set("analytics", { dashboard: v })} />
              <ToggleRow id="studentAnalytics" label="Student analytics" checked={draft.analytics.studentAnalytics} onCheckedChange={(v) => set("analytics", { studentAnalytics: v })} />
              <ToggleRow id="facultyAnalytics" label="Faculty analytics" checked={draft.analytics.facultyAnalytics} onCheckedChange={(v) => set("analytics", { facultyAnalytics: v })} />
              <ToggleRow id="placementAnalytics" label="Placement analytics" checked={draft.analytics.placementAnalytics} onCheckedChange={(v) => set("analytics", { placementAnalytics: v })} />
              <ToggleRow id="activityAnalytics" label="Activity analytics" checked={draft.analytics.activityAnalytics} onCheckedChange={(v) => set("analytics", { activityAnalytics: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader><CardTitle>Leaderboard</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="badgeSystemEnabled" label="Badge system" checked={draft.leaderboard.badgeSystemEnabled} onCheckedChange={(v) => set("leaderboard", { badgeSystemEnabled: v })} />
              <ToggleRow id="seasonalRankingsEnabled" label="Seasonal rankings" checked={draft.leaderboard.seasonalRankingsEnabled} onCheckedChange={(v) => set("leaderboard", { seasonalRankingsEnabled: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader><CardTitle>Certificates</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="autoGenerate" label="Auto-generate on completion" checked={draft.certificates.autoGenerate} onCheckedChange={(v) => set("certificates", { autoGenerate: v })} />
              <ToggleRow id="digitalVerification" label="Digital verification" checked={draft.certificates.digitalVerification} onCheckedChange={(v) => set("certificates", { digitalVerification: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fileStorage">
          <Card>
            <CardHeader><CardTitle>File storage</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="profileImagesEnabled" label="Profile images" checked={draft.fileStorage.profileImagesEnabled} onCheckedChange={(v) => set("fileStorage", { profileImagesEnabled: v })} />
              <ToggleRow id="projectMediaEnabled" label="Project media" checked={draft.fileStorage.projectMediaEnabled} onCheckedChange={(v) => set("fileStorage", { projectMediaEnabled: v })} />
              <ToggleRow id="certificatesEnabled" label="Certificates" checked={draft.fileStorage.certificatesEnabled} onCheckedChange={(v) => set("fileStorage", { certificatesEnabled: v })} />
              <ToggleRow id="resumePdfsEnabled" label="Resume PDFs" checked={draft.fileStorage.resumePdfsEnabled} onCheckedChange={(v) => set("fileStorage", { resumePdfsEnabled: v })} />
              <ToggleRow id="eventAssetsEnabled" label="Event assets" checked={draft.fileStorage.eventAssetsEnabled} onCheckedChange={(v) => set("fileStorage", { eventAssetsEnabled: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="googleLogin" label="Google login" checked={draft.integrations.googleLogin} onCheckedChange={(v) => set("integrations", { googleLogin: v })} />
              <ToggleRow id="microsoftLogin" label="Microsoft login" checked={draft.integrations.microsoftLogin} onCheckedChange={(v) => set("integrations", { microsoftLogin: v })} />
              <ToggleRow id="googleCalendar" label="Google Calendar" checked={draft.integrations.googleCalendar} onCheckedChange={(v) => set("integrations", { googleCalendar: v })} />
              <ToggleRow id="github" label="GitHub" checked={draft.integrations.github} onCheckedChange={(v) => set("integrations", { github: v })} />
              <ToggleRow id="linkedin" label="LinkedIn" checked={draft.integrations.linkedin} onCheckedChange={(v) => set("integrations", { linkedin: v })} />
              <ToggleRow id="leetcode" label="LeetCode" checked={draft.integrations.leetcode} onCheckedChange={(v) => set("integrations", { leetcode: v })} />
              <ToggleRow id="codeforces" label="Codeforces" checked={draft.integrations.codeforces} onCheckedChange={(v) => set("integrations", { codeforces: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader><CardTitle>Audit</CardTitle></CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow id="logUserActions" label="Log user actions" checked={draft.audit.logUserActions} onCheckedChange={(v) => set("audit", { logUserActions: v })} />
              <ToggleRow id="logAdminActions" label="Log admin actions" checked={draft.audit.logAdminActions} onCheckedChange={(v) => set("audit", { logAdminActions: v })} />
              <ToggleRow id="dataExportEnabled" label="Data export enabled" checked={draft.audit.dataExportEnabled} onCheckedChange={(v) => set("audit", { dataExportEnabled: v })} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
