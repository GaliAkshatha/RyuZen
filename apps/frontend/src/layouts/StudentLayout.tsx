import { AppShellV2 } from "@/app-shell/layout/AppShellV2";
import { STUDENT_SIDEBAR_SECTIONS } from "@/app-shell/config/studentNavigation";
import { StudentIdentity } from "@/app-shell/config/StudentIdentity";

/**
 * Real Student shell integration - Student is the only role using
 * AppShellV2 so far. Every other role layout in this folder still
 * uses the original AppShell, untouched. AppShellV2 renders <Outlet />
 * internally here (no children passed), matching how every other role
 * layout already works as a nested-route parent.
 */
export function StudentLayout() {
  return <AppShellV2 sections={STUDENT_SIDEBAR_SECTIONS} identity={<StudentIdentity />} />;
}
