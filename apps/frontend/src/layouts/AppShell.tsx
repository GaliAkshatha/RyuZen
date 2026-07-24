import { Link, Outlet } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useMyNotifications } from "@/features/notifications/hooks/useMyNotifications";

import { Button } from "@/shared/ui/Button";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/Drawer";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { AppTopbar } from "@/shared/components/AppTopbar";
import { EmptyState } from "@/shared/components/EmptyState";

/**
 * The real shared implementation behind all 5 role layouts (F8's own
 * "share ~90% implementation via one AppShell parameterized by role").
 * Each role layout is a thin, semantically-named delegate to this
 * component — see StudentLayout.tsx etc. for why those files exist at
 * all despite rendering nothing role-specific yet.
 */
/**
 * The only RyuZen brand mark inside the authenticated app — used in
 * both the desktop sidebar and the mobile drawer below, so it's
 * defined once here rather than duplicated in two places. Always
 * links to "/" (the Landing Page), matching the same rule the public
 * Header and AuthLayout already follow: clicking the logo always
 * returns to the Landing Page, everywhere in the product, not just
 * before login.
 */
function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="RyuZen — go to homepage"
      className={cn(
        "flex h-16 shrink-0 items-center border-b border-border font-display text-lg font-bold tracking-wide text-foreground transition-colors hover:text-primary",
        collapsed ? "justify-center px-2" : "px-4",
      )}
    >
      {collapsed ? "R" : "RyuZen"}
    </Link>
  );
}

export function AppShell() {
  const { user } = useAuth();
  const logout = useLogout();
  const { data: notifications } = useMyNotifications();
  const unreadNotificationCount = notifications?.filter((n) => !n.isRead).length;
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
  } = useUI();

  // ProtectedRoute guarantees `user` is non-null by the time AppShell
  // mounts, but the type is still nullable — guard rather than `!`.
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar — h-full within the viewport-locked shell so
        its own overflow-y-auto actually has a bounded height to
        scroll against, independently of main content. The collapse
        toggle sits in a separate, non-scrolling footer so it's always
        reachable regardless of scroll position. */}
      <aside
        className={cn(
          "hidden h-full shrink-0 flex-col border-r border-border transition-[width] lg:flex",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarBrand collapsed={sidebarCollapsed} />
        <div className="flex-1 overflow-y-auto">
          <AppSidebar role={user.role} collapsed={sidebarCollapsed} />
        </div>
        <div className="shrink-0 border-t border-border p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-full"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <DrawerContent side="left" className="w-72 p-0">
          <DrawerTitle className="sr-only">Navigation</DrawerTitle>
          <SidebarBrand />
          <AppSidebar role={user.role} />
        </DrawerContent>
      </Drawer>

      {/* Notification drawer — shell only, real content wired in CM1 */}
      <Drawer open={notificationDrawerOpen} onOpenChange={setNotificationDrawerOpen}>
        <DrawerContent side="right">
          <DrawerTitle>Notifications</DrawerTitle>
          <div className="mt-4">
            <EmptyState
              title="No notifications yet"
              description="Notifications will appear here once the Notifications module is built."
            />
          </div>
        </DrawerContent>
      </Drawer>

      <div className="flex min-h-0 flex-1 flex-col">
        <AppTopbar
          userName={user.name}
          userRole={user.role}
          avatarUrl={user.profile.image || undefined}
          unreadNotificationCount={unreadNotificationCount}
          onLogout={logout}
          onNotificationClick={() => setNotificationDrawerOpen(true)}
          leadingSlot={
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          }
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
