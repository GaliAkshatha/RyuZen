import { useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";

import { cn } from "@/utils/cn";

import { SidebarV2, type SidebarSection } from "./SidebarV2";
import { TopbarV2 } from "./TopbarV2";

/**
 * The rebuilt shell: sidebar + topbar + full-width content workspace.
 * Desktop: persistent sidebar (collapsible), full-width content.
 * Below lg: sidebar becomes an overlay, triggered from the topbar's
 * menu button - not a scaled-down desktop layout, a genuinely
 * different navigation pattern for the viewport, per the rebuild's
 * explicit responsive requirement.
 *
 * Role-agnostic: takes sections + identity as props, same as
 * SidebarV2. This file will host every role's shell once each is
 * rebuilt - Student is simply the first consumer.
 *
 * Renders <Outlet /> when no `children` is given - the real
 * integration mounts this as a React Router layout route (nested
 * children matched via Outlet, not passed as a prop), while explicit
 * `children` remains supported for standalone/diagnostic usage.
 */
export function AppShellV2({
  sections,
  identity,
  children,
}: {
  sections: SidebarSection[];
  identity?: ReactNode;
  children?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop sidebar - persistent, collapsible */}
      <div className="hidden lg:block">
        <SidebarV2
          sections={sections}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          identity={identity}
        />
      </div>

      {/* Mobile sidebar - fixed overlay, not a scaled desktop sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <SidebarV2
              sections={sections}
              collapsed={false}
              onToggleCollapsed={() => setMobileNavOpen(false)}
              identity={identity}
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopbarV2 onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8")}>
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
